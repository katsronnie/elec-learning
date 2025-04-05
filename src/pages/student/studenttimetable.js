import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StudentTimetable = () => {
  // Days of the week for the timetable
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Time slots for the timetable
  const timeSlots = [
    '8:00 AM - 9:00 AM',
    '9:15 AM - 10:15 AM',
    '10:30 AM - 11:30 AM',
    '11:45 AM - 12:45 PM',
    '1:30 PM - 2:30 PM',
    '2:45 PM - 3:45 PM'
  ];

  // Sample timetable data - in a real app, this would come from an API
  const [timetableData] = useState({
    Monday: {
      '8:00 AM - 9:00 AM': { subject: 'Mathematics', teacher: 'Dr. Emily Watson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      '9:15 AM - 10:15 AM': { subject: 'Physics', teacher: 'Prof. Richard Miller', room: 'Lab 3', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      '10:30 AM - 11:30 AM': { subject: 'English Literature', teacher: 'Ms. Jennifer Adams', room: 'Room 205', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      '11:45 AM - 12:45 PM': { subject: 'Lunch Break', teacher: '', room: 'Cafeteria', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      '1:30 PM - 2:30 PM': { subject: 'Computer Science', teacher: 'Mr. David Chen', room: 'Computer Lab 1', color: 'bg-green-100 text-green-800 border-green-200' },
      '2:45 PM - 3:45 PM': { subject: 'Study Hall', teacher: 'Self-Directed', room: 'Library', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    },
    Tuesday: {
      '8:00 AM - 9:00 AM': { subject: 'Chemistry', teacher: 'Dr. Sarah Wilson', room: 'Lab 2', color: 'bg-red-100 text-red-800 border-red-200' },
      '9:15 AM - 10:15 AM': { subject: 'History', teacher: 'Mr. James Thompson', room: 'Room 302', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      '10:30 AM - 11:30 AM': { subject: 'Physical Education', teacher: 'Coach Michael Brown', room: 'Gymnasium', color: 'bg-pink-100 text-pink-800 border-pink-200' },
      '11:45 AM - 12:45 PM': { subject: 'Lunch Break', teacher: '', room: 'Cafeteria', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      '1:30 PM - 2:30 PM': { subject: 'Mathematics', teacher: 'Dr. Emily Watson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      '2:45 PM - 3:45 PM': { subject: 'Art', teacher: 'Ms. Lisa Rodriguez', room: 'Art Studio', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    },
    Wednesday: {
      '8:00 AM - 9:00 AM': { subject: 'Physics', teacher: 'Prof. Richard Miller', room: 'Lab 3', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      '9:15 AM - 10:15 AM': { subject: 'Mathematics', teacher: 'Dr. Emily Watson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      '10:30 AM - 11:30 AM': { subject: 'Computer Science', teacher: 'Mr. David Chen', room: 'Computer Lab 1', color: 'bg-green-100 text-green-800 border-green-200' },
      '11:45 AM - 12:45 PM': { subject: 'Lunch Break', teacher: '', room: 'Cafeteria', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      '1:30 PM - 2:30 PM': { subject: 'English Literature', teacher: 'Ms. Jennifer Adams', room: 'Room 205', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      '2:45 PM - 3:45 PM': { subject: 'Music', teacher: 'Mr. Robert Lee', room: 'Music Room', color: 'bg-teal-100 text-teal-800 border-teal-200' }
    },
    Thursday: {
      '8:00 AM - 9:00 AM': { subject: 'History', teacher: 'Mr. James Thompson', room: 'Room 302', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      '9:15 AM - 10:15 AM': { subject: 'Chemistry', teacher: 'Dr. Sarah Wilson', room: 'Lab 2', color: 'bg-red-100 text-red-800 border-red-200' },
      '10:30 AM - 11:30 AM': { subject: 'Mathematics', teacher: 'Dr. Emily Watson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      '11:45 AM - 12:45 PM': { subject: 'Lunch Break', teacher: '', room: 'Cafeteria', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      '1:30 PM - 2:30 PM': { subject: 'Physics', teacher: 'Prof. Richard Miller', room: 'Lab 3', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      '2:45 PM - 3:45 PM': { subject: 'Study Hall', teacher: 'Self-Directed', room: 'Library', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    },
    Friday: {
      '8:00 AM - 9:00 AM': { subject: 'English Literature', teacher: 'Ms. Jennifer Adams', room: 'Room 205', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      '9:15 AM - 10:15 AM': { subject: 'Computer Science', teacher: 'Mr. David Chen', room: 'Computer Lab 1', color: 'bg-green-100 text-green-800 border-green-200' },
      '10:30 AM - 11:30 AM': { subject: 'Chemistry', teacher: 'Dr. Sarah Wilson', room: 'Lab 2', color: 'bg-red-100 text-red-800 border-red-200' },
      '11:45 AM - 12:45 PM': { subject: 'Lunch Break', teacher: '', room: 'Cafeteria', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      '1:30 PM - 2:30 PM': { subject: 'Physical Education', teacher: 'Coach Michael Brown', room: 'Gymnasium', color: 'bg-pink-100 text-pink-800 border-pink-200' },
      '2:45 PM - 3:45 PM': { subject: 'Club Activities', teacher: 'Various', room: 'Various', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  });

  // Get current day for highlighting in the timetable
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Upcoming classes - in a real app, this would be calculated based on current time and timetable
  const [upcomingClasses] = useState([
    { 
      id: 1, 
      subject: 'Mathematics', 
      time: '8:00 AM - 9:00 AM', 
      day: 'Monday', 
      teacher: 'Dr. Emily Watson', 
      room: 'Room 101',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    { 
      id: 2, 
      subject: 'Physics', 
      time: '9:15 AM - 10:15 AM', 
      day: 'Monday', 
      teacher: 'Prof. Richard Miller', 
      room: 'Lab 3',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    { 
      id: 3, 
      subject: 'English Literature', 
      time: '10:30 AM - 11:30 AM', 
      day: 'Monday', 
      teacher: 'Ms. Jennifer Adams', 
      room: 'Room 205',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  ]);

  // Special schedule notes
  const [scheduleNotes] = useState([
    { id: 1, title: 'Mid-term Exams', date: 'October 15-19', description: 'Modified schedule during exam week' },
    { id: 2, title: 'School Holiday', date: 'October 25', description: 'No classes - Teacher Professional Development Day' },
    { id: 3, title: 'Science Fair', date: 'November 10', description: 'Afternoon classes will be canceled for Science Fair setup' }
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
            <div className="flex space-x-4">
              <Link to="/studentdashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                Back to Dashboard
              </Link>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Schedule
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Upcoming Classes */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Classes</h3>
                <p className="mt-1 text-sm text-gray-500">Your next scheduled classes</p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {upcomingClasses.map(classItem => (
                    <li key={classItem.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-md ${classItem.color.split(' ')[0]} flex items-center justify-center border ${classItem.color.split(' ')[2]}`}>
                          <span className={`text-lg font-bold ${classItem.color.split(' ')[1]}`}>{classItem.subject.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{classItem.subject}</p>
                          <div className="flex text-xs text-gray-500">
                            <p>{classItem.day}, {classItem.time}</p>
                            <span className="mx-1">•</span>
                            <p>{classItem.room}</p>
                          </div>
                          <p className="text-xs text-gray-500">{classItem.teacher}</p>
                        </div>
                        <div className="ml-auto">
                          <Link to={`/student/class/${classItem.id}`} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            Join
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Schedule Notes */}
            <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Schedule Notes</h3>
                <p className="mt-1 text-sm text-gray-500">Important dates and schedule changes</p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {scheduleNotes.map(note => (
                    <li key={note.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-start">
                      <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">{note.title}</h4>
                          <p className="text-sm text-gray-500">{note.date}</p>
                          <p className="mt-1 text-sm text-gray-500">{note.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/student/attendance" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Attendance Record
                  </Link>
                  <Link to="/student/assignments" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Assignments
                  </Link>
                  <Link to="/student/exams" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Exam Schedule
                  </Link>
                  <Link to="/student/teachers" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Teacher Directory
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Timetable */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Weekly Timetable</h3>
                  <p className="mt-1 text-sm text-gray-500">Fall Semester 2023</p>
                </div>
                <div className="flex space-x-3">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Week
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next Week
                    <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200 overflow-x-auto">
                <div className="min-w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Time
                        </th>
                        {weekdays.map(day => (
                          <th 
                            key={day} 
                            scope="col" 
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                              day === today ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
                            }`}
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeSlots.map(timeSlot => (
                        <tr key={timeSlot}>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500">
                            {timeSlot}
                          </td>
                          {weekdays.map(day => {
                            const classInfo = timetableData[day][timeSlot];
                            return (
                              <td key={`${day}-${timeSlot}`} className="px-2 py-2 whitespace-nowrap">
                                {classInfo ? (
                                  <div className={`px-2 py-2 rounded-md border ${classInfo.color}`}>
                                    <p className="text-xs font-medium">{classInfo.subject}</p>
                                    {classInfo.teacher && (
                                      <p className="text-xs">{classInfo.teacher}</p>
                                    )}
                                    <p className="text-xs">{classInfo.room}</p>
                                  </div>
                                ) : (
                                  <div className="px-2 py-2 rounded-md border border-gray-200 bg-gray-50">
                                    <p className="text-xs text-gray-500">Free Period</p>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-sm font-medium text-gray-500">Subject Legend</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Mathematics</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-purple-100 border border-purple-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Physics</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200 mr-2"></div>
                    <span className="text-xs text-gray-700">English Literature</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-red-100 border border-red-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Chemistry</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Computer Science</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-200 mr-2"></div>
                    <span className="text-xs text-gray-700">History</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-pink-100 border border-pink-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Physical Education</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Art</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-teal-100 border border-teal-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Music</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200 mr-2"></div>
                    <span className="text-xs text-gray-700">Other Activities</span>
                  </div>
                </div>
              </div>
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

export default StudentTimetable;
