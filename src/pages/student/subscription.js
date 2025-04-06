import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SubjectSubscription from './subjectsubscription';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Query users collection to find a student with matching email
          const usersRef = collection(db, "users");
          const q = query(
            usersRef,
            where("email", "==", user.email),
            where("role", "==", "student")
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Get the first matching student document
            const studentDoc = querySnapshot.docs[0];
            const studentData = studentDoc.data();
            const studentId = studentDoc.id;
            
            setStudent({
              ...studentData,
              id: studentId
            });
          } else {
            // No student found with this email
            console.log("No student account found with this email");
            navigate('/login');
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
          setError("Failed to load student data. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in, redirect to login
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleSubjectSelection = (subjects) => {
    setSelectedSubjects(subjects);
  };

  const handleSubscribe = () => {
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject to subscribe.");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSubscription = async () => {
    if (!student || !student.id) {
      setError("Student information not available. Please try again later.");
      return;
    }

    try {
      setLoading(true);
      
      // Reference to the student document
      const studentRef = doc(db, "users", student.id);
      
      // Get current student data to check existing subscriptions
      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) {
        throw new Error("Student document not found");
      }
      
      const studentData = studentSnap.data();
      
      // Initialize subscriptions object if it doesn't exist
      const currentSubscriptions = studentData.subscriptions || {};
      
      // Add new subscriptions
      const updatedSubscriptions = { ...currentSubscriptions };
      
      for (const subject of selectedSubjects) {
        // Only add if not already subscribed
        if (!updatedSubscriptions[subject.id]) {
          updatedSubscriptions[subject.id] = {
            subscribedAt: new Date(),
            progress: 0,
            status: 'active'
          };
        }
      }
      
      // Update the student document with new subscriptions
      await updateDoc(studentRef, {
        subscriptions: updatedSubscriptions
      });
      
      // Also add subscription records to a separate collection for tracking
      for (const subject of selectedSubjects) {
        const subscriptionRef = doc(collection(db, "subscriptions"));
        await setDoc(subscriptionRef, {
          studentId: student.id,
          studentName: student.name || "Unknown Student",
          studentEmail: student.email,
          subjectId: subject.id,
          subjectName: subject.name,
          subscribedAt: new Date(),
          status: 'active',
          paymentStatus: 'pending' // You can update this after payment processing
        });
      }
      
      setSubscriptionSuccess(true);
      setShowConfirmDialog(false);
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate('/studentdashboard');
      }, 3000);
      
    } catch (error) {
      console.error("Error subscribing to subjects:", error);
      setError("Failed to complete subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Subject Subscription</h1>
          <Link to="/studentdashboard" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
            Back to Dashboard
          </Link>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
                <button 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {subscriptionSuccess ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Subscription successful! You have subscribed to {selectedSubjects.length} subject(s).
                      Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Subscribe to Subjects</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Select the subjects you want to enroll in for this semester. Each subject costs ₦50,000 per semester.
                  </p>
                </div>
                
                <SubjectSubscription onSubjectSelection={handleSubjectSelection} />
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubscribe}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Subscribe to Selected Subjects
                  </button>
                </div>
              </>
            )}
            
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-purple-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Benefits</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">What you get with your subject subscription</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Live Classes</h4>
                      <p className="mt-1 text-sm text-gray-500">Access to all scheduled live classes for the subject</p>
                    </div>
                  </div>
                  
                  {/* Other benefits remain the same */}
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Study Materials</h4>
                      <p className="mt-1 text-sm text-gray-500">Complete access to all course materials and resources</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Assignments & Tests</h4>
                      <p className="mt-1 text-sm text-gray-500">All assignments, quizzes, and tests for the subject</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Teacher Support</h4>
                      <p className="mt-1 text-sm text-gray-500">Direct access to teachers for questions and support</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Recorded Sessions</h4>
                      <p className="mt-1 text-sm text-gray-500">Access to recordings of all classes for revision</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Progress Tracking</h4>
                      <p className="mt-1 text-sm text-gray-500">Detailed tracking of your academic progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Confirm Subscription
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to subscribe to {selectedSubjects.length} subject(s):
                      </p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                        {selectedSubjects.map(subject => (
                          <li key={subject.id}>{subject.name}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm text-gray-500">
                        Total cost: ₦{(selectedSubjects.length * 50000).toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm font-medium text-gray-700">
                        Do you want to proceed with this subscription?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmSubscription}
                  disabled={loading}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : 'Confirm Subscription'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2023 School E-Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionPage;
