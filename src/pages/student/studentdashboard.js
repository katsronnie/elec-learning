import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [subscribedSubjects, setSubscribedSubjects] = useState([]);
  const [hasSubscriptions, setHasSubscriptions] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [dialogTarget, setDialogTarget] = useState('');
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showPaymentReceipt, setShowPaymentReceipt] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          console.log("Current user email:", user.email);
          // Query users collection to find a student with matching email
          const usersRef = collection(db, "users");
          const q = query(
            usersRef,
            where("email", "==", user.email),
            where("role", "==", "student")
          );
          
          let querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            const studentsRef = collection(db, "students");
            const studentQuery = query(
              studentsRef,
              where("email", "==", user.email)
            );
            querySnapshot = await getDocs(studentQuery);
          }
          
          if (!querySnapshot.empty) {
            // Get the first matching student document
            const studentDoc = querySnapshot.docs[0];
            const studentData = studentDoc.data();
            const studentId = studentDoc.id;
            console.log("Found student data:", studentData);
            setStudent({
              ...studentData,
              id: studentId
            });
            
            // Check if this is first login
            setIsFirstLogin(!studentData.lastLogin);
            
            // Check if student has subscriptions
            // Inside your useEffect hook, after you've set the student state
            // Check if student has subscriptions by querying the subscribedSubjects collection
            const subscribedSubjectsRef = collection(db, "subscribedSubjects");
            const subscriptionsQuery = query(
              subscribedSubjectsRef,
              where("studentId", "==", studentId),
              where("status", "==", "active")
            );

            const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
            console.log("Subscriptions found:", subscriptionsSnapshot.size);
            const hasSubscriptions = !subscriptionsSnapshot.empty;
            setHasSubscriptions(hasSubscriptions);

            // If student has subscriptions, process them
            if (hasSubscriptions) {
              const subjectsData = [];
              const classesData = [];
              const assignmentsData = [];
              
              // Process each subscription
              for (const doc of subscriptionsSnapshot.docs) {
                const subscription = doc.data();
                console.log("Processing subscription:", subscription);
                
                // Add subject data from the subscription document
                subjectsData.push({
                  id: subscription.subjectId.toString(),
                  name: subscription.subjectName || "Unnamed Subject",
                  code: subscription.subjectCode || "",
                  teacher: "Unknown Teacher", // Will be updated if teacher info is available
                  nextClass: "No upcoming classes", // Will be updated if available
                  progress: subscription.progress || 0
                });
                
                // Try to get additional subject info if needed
                try {
                  // Convert subjectId to string if it's stored as a number
                  const subjectIdStr = subscription.subjectId.toString();
                  const subjectRef = doc(db, "subjects", subjectIdStr);
                  const subjectSnap = await getDoc(subjectRef);
                  
                  if (subjectSnap.exists()) {
                    const fullSubjectData = subjectSnap.data();
                    
                    // Get teacher name if available
                    if (fullSubjectData.teacherId) {
                      const teacherRef = doc(db, "users", fullSubjectData.teacherId);
                      const teacherSnap = await getDoc(teacherRef);
                      if (teacherSnap.exists()) {
                        // Update the teacher name in the already added subject
                        const index = subjectsData.findIndex(s => s.id === subjectIdStr);
                        if (index >= 0) {
                          subjectsData[index].teacher = teacherSnap.data().name || "Unknown Teacher";
                        }
                      }
                    }
                    
                    // Fetch upcoming classes for this subject
                    const classesRef = collection(db, "classes");
                    const classesQuery = query(
                      classesRef,
                      where("subjectId", "==", subjectIdStr),
                      where("date", ">=", new Date())
                    );
                    const classesSnapshot = await getDocs(classesQuery);
                    
                    classesSnapshot.forEach(classDoc => {
                      const classData = classDoc.data();
                      classesData.push({
                        id: classDoc.id,
                        subject: subscription.subjectName,
                        topic: classData.topic || "General Class",
                        time: classData.time || "TBD",
                        date: formatDate(classData.date),
                        teacher: subjectsData.find(s => s.id === subjectIdStr)?.teacher || "Unknown Teacher"
                      });
                    });
                    
                    // Fetch assignments for this subject
                    const assignmentsRef = collection(db, "assignments");
                    const assignmentsQuery = query(
                      assignmentsRef,
                      where("subjectId", "==", subjectIdStr)
                    );
                    const assignmentsSnapshot = await getDocs(assignmentsQuery);
                    
                    if (assignmentsSnapshot.empty) {
                      // If no assignments found for this subject, add a placeholder
                      assignmentsData.push({
                        id: `no-assignments-${subjectIdStr}`,
                        subject: subscription.subjectName,
                        title: "No assignments for this subject",
                        dueDate: "N/A",
                        status: "N/A",
                        isPlaceholder: true
                      });
                    } else {
                      assignmentsSnapshot.forEach(assignDoc => {
                        const assignmentData = assignDoc.data();
                        // Check if student has started this assignment
                        const status = assignmentData.submissions &&
                                      assignmentData.submissions[studentId] ?
                                      "In Progress" : "Not Started";
                        
                        assignmentsData.push({
                          id: assignDoc.id,
                          subject: subscription.subjectName,
                          title: assignmentData.title || "Untitled Assignment",
                          dueDate: formatDate(assignmentData.dueDate),
                          status: status
                        });
                      });
                    }
                  }
                } catch (error) {
                  console.error("Error fetching additional subject data:", error);
                }
              }
              
              console.log("Final subjects data:", subjectsData);
              setSubscribedSubjects(subjectsData);
              
              // Sort classes by date and time
              classesData.sort((a, b) => {
                const dateA = new Date(a.date + " " + a.time);
                const dateB = new Date(b.date + " " + b.time);
                return dateA - dateB;
              });
              
              setUpcomingClasses(classesData.slice(0, 3)); // Show only 3 upcoming classes
              
              // Filter out placeholder assignments
              const realAssignments = assignmentsData.filter(a => !a.isPlaceholder);
              setPendingAssignments(realAssignments.length > 0 ?
                realAssignments.slice(0, 3) : // Show only 3 pending assignments
                assignmentsData.slice(0, 3)   // Or show placeholders if no real assignments
              );
            }



            // Fetch payment history
            const paymentsRef = collection(db, "payments");
            const paymentsQuery = query(
              paymentsRef,
              where("studentId", "==", studentId)
            );
            const paymentsSnapshot = await getDocs(paymentsQuery);
            
            const paymentsData = [];
            paymentsSnapshot.forEach(doc => {
              const paymentData = doc.data();
              paymentsData.push({
                id: doc.id,
                amount: paymentData.amount,
                date: paymentData.date ? new Date(paymentData.date.seconds * 1000) : new Date(),
                subjects: paymentData.subjects || [],
                method: paymentData.method || "Unknown",
                status: paymentData.status || "Completed",
                reference: paymentData.reference || doc.id.substring(0, 8)
              });
            });
            
            // Sort payments by date (newest first)
            paymentsData.sort((a, b) => b.date - a.date);
            setPayments(paymentsData);

            // Update the last login timestamp in Firestore
            const studentRef = doc(db, querySnapshot.docs[0].ref.path);
            await updateDoc(studentRef, {
              lastLogin: new Date()
            });
          } else {
            // No student found with this email
            console.log("No student account found with this email");
            navigate('/login');
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
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

  const handleNavigation = (e, path) => {
    if (!hasSubscriptions && path !== '/subjectsubscription' && path !== '/student/profile') {
      e.preventDefault();
      setDialogTarget(path);
      setShowSubscriptionDialog(true);
    }
  };

  const formatDate = (date) => {
    if (!date) return "TBD";
    
    if (typeof date === 'string') return date;
    
    if (date.seconds) {
      date = new Date(date.seconds * 1000);
    }
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };

  const showReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentReceipt(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src={student?.photoURL || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">{student?.name}</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="mb-6 bg-blue-100 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-800">
          {isFirstLogin
            ? `Welcome, ${student?.name || student?.displayName || "Student"}!`
            : `Welcome back, ${student?.name || student?.displayName || "Student"}!`
          }
          </h2>
          <p className="text-blue-600">
            {isFirstLogin
              ? "Thank you for joining our e-learning platform. Get started by subscribing to subjects."
              : hasSubscriptions
                ? `You have ${pendingAssignments.filter(a => !a.isPlaceholder).length} pending assignments and ${upcomingClasses.length} upcoming classes.`
                : "You haven't subscribed to any subjects yet. Start learning by subscribing to subjects."
            }
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Student Info Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{student?.name || student?.displayName}</h3>
                                    <p className="text-sm text-gray-500">{student?.grade || 'Grade not set'} • Student ID: {student?.id ? student.id.substring(0, 8) : 'N/A'}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5 text-center">
                <div>
                  <span className="block text-2xl font-bold text-gray-900">{subscribedSubjects.length}</span>
                  <span className="block text-sm font-medium text-gray-500">Subjects</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-gray-900">
                    {subscribedSubjects.length > 0
                      ? Math.round(subscribedSubjects.reduce((acc, subj) => acc + subj.progress, 0) / subscribedSubjects.length)
                      : 0}%
                  </span>
                  <span className="block text-sm font-medium text-gray-500">Avg. Score</span>
                </div>
              </div>
              <div className="mt-5">
                <Link to="/student/profile" className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/subjectsubscription" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Subscribe Subjects</span>
                </Link>
                <Link
                  to="/student/assignments"
                  onClick={(e) => handleNavigation(e, '/student/assignments')}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">View Assignments</span>
                </Link>
                <Link
                  to="/student/timetable"
                  onClick={(e) => handleNavigation(e, '/student/timetable')}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Class Schedule</span>
                </Link>
                <Link
                  to="/student/grades"
                  onClick={(e) => handleNavigation(e, '/student/grades')}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">My Grades</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Upcoming Classes */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Classes</h3>
              {hasSubscriptions ? (
                <div className="space-y-3">
                  {upcomingClasses.length > 0 ? (
                    upcomingClasses.map(cls => (
                      <div key={cls.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{cls.subject.charAt(0)}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{cls.subject}: {cls.topic}</p>
                          <p className="text-xs text-gray-500">{cls.date}, {cls.time} • {cls.teacher}</p>
                        </div>
                        <Link
                          to={`/student/classroom/${cls.id}`}
                          onClick={(e) => handleNavigation(e, `/student/classroom/${cls.id}`)}
                          className="ml-auto bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          Join
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No upcoming classes scheduled</p>
                    </div>
                  )}
                  <Link
                    to="/student/timetable"
                    onClick={(e) => handleNavigation(e, '/student/timetable')}
                    className="block text-center text-sm text-blue-600 hover:text-blue-500 mt-2"
                  >
                    View Full Schedule →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No classes scheduled</h3>
                  <p className="mt-1 text-sm text-gray-500">Subscribe to subjects to see your class schedule.</p>
                  <div className="mt-6">
                    <Link to="/subjectsubscription" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      Subscribe to Subjects
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Payments</h3>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {payments.slice(0, 3).map(payment => (
                  <li key={payment.id}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              Payment for {payment.subjects.length} {payment.subjects.length === 1 ? 'subject' : 'subjects'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.date.toLocaleDateString()} • Ref: {payment.reference}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-4">
                          {formatCurrency(payment.amount)}
                        </span>
                        <button
                          onClick={() => showReceipt(payment)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Subscribed Subjects */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">My Subjects</h3>
            <Link to="/subjectsubscription" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Subscribe to More Subjects
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {hasSubscriptions ? (
              <ul className="divide-y divide-gray-200">
                {subscribedSubjects.map(subject => (
                  <li key={subject.id}>
                    <Link
                      to={`/student/subject/${subject.id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">{subject.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{subject.name} {subject.code && `(${subject.code})`}</p>
                              <p className="text-xs text-gray-500">
                                Teacher: {subject.teacher} • Next class: {subject.nextClass}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4">
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-gray-900">{subject.progress}%</span>
                                <div className="ml-2 w-24 bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${subject.progress}%` }}></div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">Progress</p>
                            </div>
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by subscribing to subjects.</p>
                <div className="mt-6">
                  <Link to="/subjectsubscription" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Subscribe to Subjects
                    <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Assignments</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {hasSubscriptions ? (
              <ul className="divide-y divide-gray-200">
                {pendingAssignments.map(assignment => (
                  <li key={assignment.id}>
                    {assignment.isPlaceholder ? (
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{assignment.subject.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                            <p className="text-xs text-gray-500">{assignment.subject}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={`/student/assignment/${assignment.id}`}
                        onClick={(e) => handleNavigation(e, `/student/assignment/${assignment.id}`)}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <span className="text-yellow-600 font-medium">{assignment.subject.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                                <p className="text-xs text-gray-500">{assignment.subject} • Due: {assignment.dueDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                assignment.status === 'Not Started'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {assignment.status}
                              </span>
                              <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments yet</h3>
                <p className="mt-1 text-sm text-gray-500">Subscribe to subjects to receive assignments.</p>
                <div className="mt-6">
                  <Link to="/subjectsubscription" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Subscribe to Subjects
                  </Link>
                </div>
              </div>
            )}
          </div>
          {hasSubscriptions && pendingAssignments.some(a => !a.isPlaceholder) && (
            <div className="mt-2 text-right">
              <Link
                to="/student/assignments"
                onClick={(e) => handleNavigation(e, '/student/assignments')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View All Assignments →
              </Link>
            </div>
          )}
        </div>

        {/* Study Resources */}
        <div className="mt-6">
          <div className="bg-blue-50 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Study Resources</h3>
                <p className="text-sm text-blue-700 mt-1">Access textbooks, notes, videos, and practice tests</p>
              </div>
              <Link
                to="/student/resources"
                onClick={(e) => handleNavigation(e, '/student/resources')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Receipt Modal */}
      {showPaymentReceipt && selectedPayment && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Payment Receipt
                    </h3>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Receipt Number:</span>
                        <span className="text-sm font-medium">{selectedPayment.reference}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm font-medium">{selectedPayment.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Payment Method:</span>
                        <span className="text-sm font-medium">{selectedPayment.method}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className="text-sm font-medium text-green-600">{selectedPayment.status}</span>
                      </div>
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Subjects Purchased:</h4>
                        <ul className="divide-y divide-gray-200">
                          {selectedPayment.subjects.map((subject, index) => (
                            <li key={index} className="py-2">
                              <div className="flex justify-between">
                                <span className="text-sm">{subject.name || `Subject ${index + 1}`}</span>
                                <span className="text-sm font-medium">
                                  {formatCurrency(subject.price || (selectedPayment.amount / selectedPayment.subjects.length))}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <span className="text-base font-medium">Total Amount:</span>
                          <span className="text-base font-bold">{formatCurrency(selectedPayment.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowPaymentReceipt(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Dialog */}
      {showSubscriptionDialog && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Subscribe to Subjects
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You haven't subscribed to any subjects yet. Would you like to browse available subjects and subscribe now?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  to="/subjectsubscription"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Browse Subjects
                </Link>
                <button
                  type="button"
                  onClick={() => setShowSubscriptionDialog(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
