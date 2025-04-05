import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [studentName] = useState('John Doe');
  const [studentClass] = useState('Senior Secondary 2');
  
  const [subscribedSubjects] = useState([
    { id: 1, name: 'Mathematics', teacher: 'Dr. Sarah Wilson', nextClass: 'Today, 10:00 AM', progress: 65 },
    { id: 2, name: 'Physics', teacher: 'Mr. Robert Johnson', nextClass: 'Tomorrow, 11:30 AM', progress: 42 },
    { id: 3, name: 'English', teacher: 'Mrs. Emily Brown', nextClass: 'Wednesday, 9:15 AM', progress: 78 }
  ]);
  
  const [upcomingClasses] = useState([
    { id: 1, subject: 'Mathematics', topic: 'Quadratic Equations', time: '10:00 AM', date: 'Today', teacher: 'Dr. Sarah Wilson' },
    { id: 2, subject: 'Physics', topic: 'Newton\'s Laws of Motion', time: '11:30 AM', date: 'Tomorrow', teacher: 'Mr. Robert Johnson' },
    { id: 3, subject: 'English', topic: 'Essay Writing', time: '9:15 AM', date: 'Wednesday', teacher: 'Mrs. Emily Brown' }
  ]);
  
  const [pendingAssignments] = useState([
    { id: 1, subject: 'Mathematics', title: 'Algebra Worksheet', dueDate: 'Tomorrow', status: 'Not Started' },
    { id: 2, subject: 'Physics', title: 'Lab Report', dueDate: 'Friday', status: 'In Progress' },
    { id: 3, subject: 'English', title: 'Book Review', dueDate: 'Next Monday', status: 'Not Started' }
  ]);

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
              <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="Profile" />
              <span className="ml-2 text-sm font-medium text-gray-700">{studentName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Student Info Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{studentName}</h3>
                  <p className="text-sm text-gray-500">{studentClass} • Student ID: S2023042</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5 text-center">
                <div>
                  <span className="block text-2xl font-bold text-gray-900">{subscribedSubjects.length}</span>
                  <span className="block text-sm font-medium text-gray-500">Subjects</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-gray-900">62%</span>
                  <span className="block text-sm font-medium text-gray-500">Avg. Score</span>
                </div>
              </div>
              <div className="mt-5">
                <Link to="/student/profile" className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
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
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Subscribe Subjects</span>
                </Link>
                <Link to="/student/assignments" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">View Assignments</span>
                </Link>
                <Link to="/student/timetable" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Class Schedule</span>
                </Link>
                <Link to="/student/grades" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="space-y-3">
                {upcomingClasses.map(cls => (
                  <div key={cls.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">{cls.subject.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{cls.subject}: {cls.topic}</p>
                      <p className="text-xs text-gray-500">{cls.date}, {cls.time} • {cls.teacher}</p>
                    </div>
                    <Link to={`/student/classroom/${cls.id}`} className="ml-auto bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                      Join
                    </Link>
                  </div>
                ))}
                <Link to="/student/timetable" className="block text-center text-sm text-purple-600 hover:text-purple-500 mt-2">
                  View Full Schedule →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribed Subjects */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">My Subjects</h3>
            <Link to="/student/subscription" className="text-sm font-medium text-purple-600 hover:text-purple-500">
              Subscribe to More Subjects
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {subscribedSubjects.map(subject => (
                <li key={subject.id}>
                  <Link to={`/student/subject/${subject.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-medium">{subject.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{subject.name}</p>
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
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${subject.progress}%` }}></div>
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
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Assignments</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pendingAssignments.map(assignment => (
                <li key={assignment.id}>
                  <Link to={`/student/assignment/${assignment.id}`} className="block hover:bg-gray-50">
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
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2 text-right">
            <Link to="/student/assignments" className="text-sm text-purple-600 hover:text-purple-500">
              View All Assignments →
            </Link>
          </div>
        </div>

        {/* Study Resources */}
        <div className="mt-6">
          <div className="bg-purple-50 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-purple-900">Study Resources</h3>
                <p className="text-sm text-purple-700 mt-1">Access textbooks, notes, videos, and practice tests</p>
              </div>
              <Link to="/student/resources" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Browse Resources
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

export default StudentDashboard;

