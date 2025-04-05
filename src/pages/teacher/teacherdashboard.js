import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TeacherWallet from '../../pages/teacher/teacherwallet';

const TeacherDashboard = () => {
  const [teacherName] = useState('Dr. Sarah Wilson');
  const [department] = useState('Science Department');
  
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
              <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="Profile" />
              <span className="ml-2 text-sm font-medium text-gray-700">{teacherName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
                  <h3 className="text-lg font-medium text-gray-900">{teacherName}</h3>
                  <p className="text-sm text-gray-500">{department} • Teacher ID: T2023001</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5 text-center">
                <div>
                  <span className="block text-2xl font-bold text-gray-900">3</span>
                  <span className="block text-sm font-medium text-gray-500">Subjects</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-gray-900">115</span>
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
                <Link to="/teacher/create-lesson" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Create Lesson</span>
                </Link>
                <Link to="/teacher/create-test" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Create Test</span>
                </Link>
                <button 
                  onClick={() => setShowWallet(!showWallet)} 
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <Link to="/teacherwallet" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <span className="ml-2 text-sm font-medium text-gray-700">My Wallet</span>
                  </Link>
                </button>
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
            <ul className="divide-y divide-gray-200">
              {assignedSubjects.map(subject => (
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
                              {subject.grades.join(', ')} • {subject.students} students • Next class: {subject.nextClass}
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
