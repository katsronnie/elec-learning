import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import TeacherWallet from './teacherwallet';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, query, where, getDocs, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { Dialog, Transition } from '@headlessui/react';
import { uploadFileToMongo, getFileUrl } from '../../utils/fileUpload';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TeacherDashboard = () => {
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [testStartDate, setTestStartDate] = useState(new Date());
  const [testEndDate, setTestEndDate] = useState(new Date());
  const [testStartTime, setTestStartTime] = useState('');
  const [testEndTime, setTestEndTime] = useState('');
  const [testFile, setTestFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);
  const fileInputRef = useRef(null);
    


  
  // Original state variables
  const [upcomingClasses] = useState([
    { id: 1, subject: 'Physics', class: '10th Grade', topic: 'Newton\'s Laws', time: '10:00 AM', date: 'Today', room: 'Lab 101' },
    { id: 2, subject: 'Chemistry', class: '11th Grade', topic: 'Periodic Table', time: '1:30 PM', date: 'Today', room: 'Room 203' },
    { id: 3, subject: 'Biology', class: '9th Grade', topic: 'Cell Structure', time: '9:15 AM', date: 'Tomorrow', room: 'Lab 102' }
  ]);
 
  const [assignedSubjects] = useState([
    { id: 1, name: 'Physics', grades: ['10th', '11th'], students: 45, nextClass: 'Today, 10:00 AM' },
    { id: 2, name: 'Chemistry', grades: ['11th', '12th'], students: 38, nextClass: 'Today, 1:30 PM' },
    { id: 3, name: 'Biology', grades: ['9th'], students: 32, nextClass: 'Tomorrow, 9:15 AM' }
  ]);
 
  const [pendingTasks] = useState([
    { id: 1, type: 'Assignment', title: 'Grade Physics Lab Reports', dueDate: 'Tomorrow', class: '10th Grade' },
    { id: 2, type: 'Test', title: 'Prepare Chemistry Mid-Term', dueDate: 'Friday', class: '11th Grade' },
    { id: 3, type: 'Lesson', title: 'Create Biology Presentation', dueDate: 'Next Monday', class: '9th Grade' }
  ]);
  
  // Added state for wallet section visibility
  const [showWallet, setShowWallet] = useState(false);
  const [teacherSubjects, setTeacherSubjects] = useState([]);

  // File input change handler
const handleFileChange = (e) => {
  if (e.target.files[0]) {
    // Check file size - limit to 10MB
    if (e.target.files[0].size > 10 * 1024 * 1024) {
      alert('File is too large. Please select a file smaller than 10MB.');
      return;
    }
    setTestFile(e.target.files[0]);
  }
};

// Create test handler
const handleCreateTest = async () => {
  if (!testTitle || !testSubject || !testStartTime || !testEndTime || !testFile) {
    alert('Please fill in all required fields and upload a test file');
    return;
  }
  
  setIsTestSubmitting(true);
  setUploadProgress(10); // Show initial progress
  
  try {
    console.log('Starting test creation process...');
    
    // Find the selected subject details
    const subjectDetails = teacherSubjects.find(subject => subject.id === testSubject);
    console.log('Subject details:', subjectDetails);
    
    // Create start datetime
    const testStartDateTime = new Date(testStartDate);
    const [startHours, startMinutes] = testStartTime.split(':');
    testStartDateTime.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));
    
    // Create end datetime
    const testEndDateTime = new Date(testEndDate);
    const [endHours, endMinutes] = testEndTime.split(':');
    testEndDateTime.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));
    
    console.log('Uploading file to MongoDB...');
    console.log('File details:', {
      name: testFile.name,
      type: testFile.type,
      size: testFile.size
    });
    
    // Upload file to MongoDB via the server API
    const fileData = await uploadFileToMongo(testFile);
    console.log('File uploaded successfully:', fileData);
    setUploadProgress(100); // Upload complete
    
    // Get file URL for later retrieval
    const fileURL = getFileUrl(fileData.filename);
    console.log('File URL:', fileURL);
    
    console.log('Creating test document in Firestore...');
    // Create the test document in Firestore
    const testData = {
      title: testTitle,
      description: testDescription,
      subjectId: testSubject,
      subjectName: subjectDetails?.name || '',
      teacherId: teacher.id,
      teacherName: teacher.name,
      startTime: testStartDateTime,
      endTime: testEndDateTime,
      fileURL: fileURL,
      fileId: fileData.fileId,
      fileName: testFile.name,
      fileType: testFile.type,
      createdAt: serverTimestamp(),
      status: 'scheduled'
    };
    
    console.log('Test data to be saved:', testData);
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, "tests"), testData);
    console.log("Test created with ID: ", docRef.id);
    
    // Reset form and close dialog
    setTestTitle('');
    setTestDescription('');
    setTestSubject('');
    setTestStartDate(new Date());
    setTestEndDate(new Date());
    setTestStartTime('');
    setTestEndTime('');
    setTestFile(null);
    setUploadProgress(0);
    setIsCreateTestOpen(false);
    
    // Show success message
    alert('Test created successfully!');
  } catch (error) {
    console.error("Error creating test: ", error);
    alert(`Failed to create test: ${error.message}`);
  } finally {
    setIsTestSubmitting(false);
  }
};



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Query users collection to find a teacher with matching email
          const usersRef = collection(db, "users");
          const q = query(
            usersRef, 
            where("email", "==", user.email),
            where("role", "==", "teacher")
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Get the first matching teacher document
            const teacherDoc = querySnapshot.docs[0];
            const teacherData = teacherDoc.data();
            const teacherId = teacherDoc.id;
            
            setTeacher({
              ...teacherData,
              id: teacherId
            });
            
            // Check if this is first login
            setIsFirstLogin(!teacherData.lastLogin);
            
            // Update teacher's subjects count
            const subjectsQuery = query(
              collection(db, "subjects"),
              where("teacherId", "==", teacherId)
            );
            const subjectsSnapshot = await getDocs(subjectsQuery);
            setSubjectsCount(subjectsSnapshot.size);
               // Process subject data for display
          const subjectsData = [];
          subjectsSnapshot.forEach(doc => {
            const subject = doc.data();
            subjectsData.push({
              id: doc.id,
              name: subject.name || "Unnamed Subject",
              description: subject.description || "No description",
              grades: subject.grades || [],
              students: subject.enrolledStudents?.length || 0,
              nextClass: subject.nextClass || "No upcoming classes"
            });
          });
          
          setTeacherSubjects(subjectsData);
            
          
          // Count students enrolled in teacher's subjects
          let totalStudents = 0;
          const teacherSubjectIds = subjectsSnapshot.docs.map(doc => doc.id);
          const teacherSubjectNames = subjectsSnapshot.docs.map(doc => doc.data().name);

          console.log("Teacher subject IDs:", teacherSubjectIds);
          console.log("Teacher subject names:", teacherSubjectNames);

          if (teacherSubjectIds.length > 0) {
            try {
              // Query the subscribedsubjects collection
              const subscribedSubjectsRef = collection(db, "subscribedSubjects");
              const subscribedSubjectsSnapshot = await getDocs(subscribedSubjectsRef);
              
              console.log("Total subscriptions found:", subscribedSubjectsSnapshot.size);
              
              // Create a Set to track unique student IDs
              const uniqueStudentIds = new Set();
              
              // Check each subscription
              subscribedSubjectsSnapshot.forEach(subDoc => {
                const subscriptionData = subDoc.data();
                console.log("Checking subscription:", subscriptionData);
                
                // Check if this subscription is for one of the teacher's subjects
                // First check by subject ID
                if (subscriptionData.subjectId && teacherSubjectIds.includes(subscriptionData.subjectId)) {
                  console.log("Match found by subject ID");
                  if (subscriptionData.studentId) {
                    uniqueStudentIds.add(subscriptionData.studentId);
                  }
                } 
                // Then check by subject name
                else if (subscriptionData.subjectName && teacherSubjectNames.includes(subscriptionData.subjectName)) {
                  console.log("Match found by subject name");
                  if (subscriptionData.studentId) {
                    uniqueStudentIds.add(subscriptionData.studentId);
                  }
                }
              });
              
              totalStudents = uniqueStudentIds.size;
              console.log("Unique students found:", totalStudents);
              console.log("Student IDs:", Array.from(uniqueStudentIds));
              
            } catch (error) {
              console.error("Error counting students from subscribedsubjects:", error);
            }
          }

          setStudentsCount(totalStudents);


            
            // Update last login timestamp would be done here
            // This would typically be done in a Cloud Function or server-side
            
          } else {
            // No teacher found with this email
            console.log("No teacher account found with this email");
            navigate('/login');
          }
        } catch (error) {
          console.error("Error fetching teacher data:", error);
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
  // Add this function to handle lesson creation
  const handleCreateLesson = async () => {
    if (!selectedSubject || !selectedTime || !lessonTitle || !endTime) {
      alert('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      // Find the selected subject details
      const subjectDetails = teacherSubjects.find(subject => subject.id === selectedSubject);
      
      // Create a combined date and time for start time
      const lessonDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      lessonDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      // Create a combined date and time for end time
      const lessonEndDateTime = new Date(selectedDate);
      const [endHours, endMinutes] = endTime.split(':');
      lessonEndDateTime.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));
      
      // Create the lesson document
      const lessonData = {
        title: lessonTitle,
        description: lessonDescription,
        subjectId: selectedSubject,
        subjectName: subjectDetails?.name || '',
        teacherId: teacher.id,
        teacherName: teacher.name,
        date: lessonDateTime,
        endTime: lessonEndDateTime, // Add end time
        createdAt: serverTimestamp(),
        status: 'scheduled'
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "lessons"), lessonData);
      console.log("Lesson created with ID: ", docRef.id);
      
      // Reset form and close dialog
      setLessonTitle('');
      setLessonDescription('');
      setSelectedSubject('');
      setSelectedDate(new Date());
      setSelectedTime('');
      setEndTime(''); // Reset end time
      setIsCreateLessonOpen(false);
      
      // Show success message
      alert('Lesson created successfully!');
    } catch (error) {
      console.error("Error creating lesson: ", error);
      alert('Failed to create lesson. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
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
                src={teacher.photoURL || "https://via.placeholder.com/150"} 
                alt="Profile" 
              />
              <span className="ml-2 text-sm font-medium text-gray-700">{teacher.name}</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="mb-6 bg-purple-100 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-purple-800">
            {isFirstLogin 
              ? `Welcome, Tr. ${teacher.name}!` 
              : `Welcome back, Tr. ${teacher.name}!`
            }
          </h2>
          <p className="text-purple-600">
            {isFirstLogin 
              ? "Thank you for joining our e-learning platform. Get started by exploring your dashboard." 
              : `You have ${pendingTasks.length} pending tasks and ${upcomingClasses.length} upcoming classes.`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Teacher Info Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
                  <p className="text-sm text-gray-500">{teacher.department || 'Department not set'} • Teacher ID: {teacher.id ? teacher.id.substring(0, 8) : 'N/A'}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5 text-center">
                <div>
                  <span className="block text-2xl font-bold text-gray-900">{subjectsCount}</span>
                  <span className="block text-sm font-medium text-gray-500">Subjects</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-gray-900">{studentsCount}</span>
                  <span className="block text-sm font-medium text-gray-500">Students</span>
                </div>
              </div>
              <div className="mt-5">
                <Link to="/teacher/profile" className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same */}
          {/* Quick Actions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/virtualclass" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Create Class</span>
                </Link>
                {/* Replace the existing Create Lesson link with this button */}
                <button 
                  onClick={() => setIsCreateLessonOpen(true)} 
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Create Lesson</span>
                </button>
                {/* Create Lesson Dialog */}
                <Transition appear show={isCreateLessonOpen} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={() => setIsCreateLessonOpen(false)}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                              as="h3"
                              className="text-lg font-medium leading-6 text-gray-900"
                            >
                              Create New Lesson
                            </Dialog.Title>
                            
                            <div className="mt-4 space-y-4">
                              {/* Lesson Title */}
                              <div>
                                <label htmlFor="lesson-title" className="block text-sm font-medium text-gray-700">
                                  Lesson Title *
                                </label>
                                <input
                                  type="text"
                                  id="lesson-title"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  value={lessonTitle}
                                  onChange={(e) => setLessonTitle(e.target.value)}
                                  required
                                />
                              </div>
                              
                              {/* Subject Selection */}
                              <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                  Subject *
                                </label>
                                <select
                                  id="subject"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  value={selectedSubject}
                                  onChange={(e) => setSelectedSubject(e.target.value)}
                                  required
                                >
                                  <option value="">Select a subject</option>
                                  {teacherSubjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                      {subject.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              {/* Date Picker */}
                              <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                  Date *
                                </label>
                                <DatePicker
                                  selected={selectedDate}
                                  onChange={(date) => setSelectedDate(date)}
                                  minDate={new Date()}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  required
                                />
                              </div>
                              
                              {/* Time Input */}
                              <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                  Start Time *
                                </label>
                                <input
                                  type="time"
                                  id="time"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  value={selectedTime}
                                  onChange={(e) => setSelectedTime(e.target.value)}
                                  required
                                />
                              </div>

                              {/* End Time Input - New Field */}
                              <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                  End Time *
                                </label>
                                <input
                                  type="time"
                                  id="endTime"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                  required
                                />
                              </div>

                              
                              {/* Description */}
                              <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <textarea
                                  id="description"
                                  rows={3}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                  value={lessonDescription}
                                  onChange={(e) => setLessonDescription(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                              <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                onClick={() => setIsCreateLessonOpen(false)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                                  isSubmitting 
                                    ? 'bg-purple-300 cursor-not-allowed' 
                                    : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                                onClick={handleCreateLesson}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? 'Creating...' : 'Create Lesson'}
                              </button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>


                <button
                  onClick={() => setIsCreateTestOpen(true)}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Create Test</span>
                </button>
                {/* Create Test Dialog */}
<Transition appear show={isCreateTestOpen} as={Fragment}>
  <Dialog as="div" className="relative z-10" onClose={() => setIsCreateTestOpen(false)}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
    </Transition.Child>
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Create New Test
            </Dialog.Title>
            
            <div className="mt-4 space-y-4">
              {/* Test Title */}
              <div>
                <label htmlFor="test-title" className="block text-sm font-medium text-gray-700">
                  Test Title *
                </label>
                <input
                  type="text"
                  id="test-title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  required
                />
              </div>
              
              {/* Subject Selection */}
              <div>
                <label htmlFor="test-subject" className="block text-sm font-medium text-gray-700">
                  Subject *
                </label>
                <select
                  id="test-subject"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  required
                >
                  <option value="">Select a subject</option>
                  {teacherSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <DatePicker
                    selected={testStartDate}
                    onChange={(date) => setTestStartDate(date)}
                    minDate={new Date()}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="start-time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={testStartTime}
                    onChange={(e) => setTestStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* End Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                    End Date *
                  </label>
                  <DatePicker
                    selected={testEndDate}
                    onChange={(date) => setTestEndDate(date)}
                    minDate={testStartDate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                    End Time *
                  </label>
                  <input
                    type="time"
                    id="end-time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={testEndTime}
                    onChange={(e) => setTestEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* File Upload */}
              <div>
                <label htmlFor="test-file" className="block text-sm font-medium text-gray-700">
                  Upload Test File * (PDF, DOCX, or Image - Max 10MB)
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="test-file"
                    ref={fileInputRef}
                    className="sr-only"
                    accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose File
                  </button>
                  <span className="ml-3 text-sm text-gray-500">
                    {testFile ? testFile.name : 'No file selected'}
                  </span>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
                  </div>
                )}
                {uploadProgress === 100 && (
                  <p className="text-xs text-green-500 mt-1">Upload complete!</p>
                )}
              </div>


              
              {/* Description */}
              <div>
                <label htmlFor="test-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="test-description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                onClick={() => setIsCreateTestOpen(false)}
                disabled={isTestSubmitting}
              >
                Cancel
              </button>
              <button    
               type="button"
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                        isTestSubmitting
                          ? 'bg-purple-300 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                      onClick={handleCreateTest}
                      disabled={isTestSubmitting}
                    >
                      {isTestSubmitting ? 'Creating...' : 'Create Test'}
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
                </div>
                  </Dialog>
                </Transition>



                <Link to="/teacherwallet" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">My Wallet</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Upcoming Classes */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Classes</h3>
              <div className="space-y-3">
                {upcomingClasses.map(cls => (
                  <div key={cls.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">{cls.subject.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{cls.subject}: {cls.topic}</p>
                      <p className="text-xs text-gray-500">{cls.date}, {cls.time} • {cls.class} • {cls.room}</p>
                    </div>
                    <Link to={`/teacher/classroom/${cls.id}`} className="ml-auto bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                      Start
                    </Link>
                  </div>
                ))}
                <Link to="/teacher/timetable" className="block text-center text-sm text-purple-600 hover:text-purple-500 mt-2">
                  View Full Schedule →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Teacher Wallet Section */}
        {showWallet && (
          <div className="mt-6">
            <TeacherWallet />
          </div>
        )}
        
        {/* Assigned Subjects */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">My Subjects</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {teacherSubjects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {teacherSubjects.map(subject => (
                  <li key={subject.id}>
                    <Link to={`/teacher/subject/${subject.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-600 font-medium">{subject.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{subject.name}</p>
                              <p className="text-xs text-gray-500">
                                {subject.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Link to={`/teacher/subject/${subject.id}/materials`} className="mr-4 text-xs text-purple-600 hover:text-purple-500">
                              Manage Materials
                            </Link>
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
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">You don't have any subjects assigned yet.</p>
                <Link to="/teacher/create-subject" className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
                  Create Your First Subject
                </Link>
              </div>
            )}
          </div>
          <div className="mt-2 text-right">
            <Link to="/teacher/subjects" className="text-sm text-purple-600 hover:text-purple-500">
              View All Subjects →
            </Link>
          </div>
        </div>

        
        {/* Pending Tasks */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Tasks</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pendingTasks.map(task => (
                <li key={task.id}>
                  <Link to={`/teacher/task/${task.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <span className="text-yellow-600 font-medium">{task.type.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.type} • {task.class} • Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                          <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2 text-right">
            <Link to="/teacher/tasks" className="text-sm text-purple-600 hover:text-purple-500">
              View All Tasks →
            </Link>
          </div>
        </div>
        
        {/* Student Performance Overview */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Student Performance Overview</h3>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Physics</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">78%</span>
                    <span className="ml-2 flex items-center text-sm text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>3%</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Average class score</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Chemistry</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">72%</span>
                    <span className="ml-2 flex items-center text-sm text-red-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>2%</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Average class score</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Biology</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">85%</span>
                    <span className="ml-2 flex items-center text-sm text-green-600">
                      <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>5%</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Average class score</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link to="/teacher/analytics" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
                  View Detailed Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Resource Center */}
        <div className="mt-6">
          <div className="bg-purple-50 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-purple-900">Teacher Resource Center</h3>
                <p className="text-sm text-purple-700 mt-1">Access lesson plans, teaching materials, and professional development resources</p>
              </div>
              <Link to="/teacher/resources" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Explore Resources
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2023 School E-Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TeacherDashboard;
