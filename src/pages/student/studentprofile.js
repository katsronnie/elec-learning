import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudentProfile = () => {
  // In a real application, this data would come from an API
  const [student, setStudent] = useState({
    id: 'ST12345',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    grade: '10th Grade',
    joinDate: 'September 2022',
    avatar: 'https://via.placeholder.com/150',
    address: '123 Student Lane, Education City, EC 12345',
    parentName: 'Robert & Sarah Johnson',
    parentContact: '+1 (555) 987-6543',
    bio: 'Passionate about mathematics and science. Aspiring to become an aerospace engineer.'
  });

  const [enrolledSubjects] = useState([
    { id: 1, name: 'Mathematics', teacher: 'Dr. Emily Watson', grade: 'A', progress: 85 },
    { id: 2, name: 'Physics', teacher: 'Prof. Richard Miller', grade: 'B+', progress: 78 },
    { id: 3, name: 'Chemistry', teacher: 'Dr. Sarah Wilson', grade: 'A-', progress: 82 },
    { id: 4, name: 'English Literature', teacher: 'Ms. Jennifer Adams', grade: 'B', progress: 75 },
    { id: 5, name: 'Computer Science', teacher: 'Mr. David Chen', grade: 'A+', progress: 95 }
  ]);

  const [recentActivities] = useState([
    { id: 1, type: 'Assignment', title: 'Physics Lab Report', date: '2 days ago', status: 'Submitted' },
    { id: 2, type: 'Quiz', title: 'Mathematics Quiz 3', date: '1 week ago', status: 'Completed', score: '90%' },
    { id: 3, type: 'Lesson', title: 'Chemical Bonding', date: '1 week ago', status: 'Completed' },
    { id: 4, type: 'Test', title: 'Mid-term English Exam', date: '2 weeks ago', status: 'Completed', score: '85%' }
  ]);

  const [achievements] = useState([
    { id: 1, title: 'Science Fair Winner', date: 'May 2023', description: 'First place in regional science competition' },
    { id: 2, title: 'Perfect Attendance', date: 'Fall Semester 2022', description: '100% attendance record' },
    { id: 3, title: 'Math Olympiad Finalist', date: 'April 2023', description: 'Top 10 in state mathematics competition' }
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            <Link to="/studentdashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Student Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex flex-col items-center">
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="h-32 w-32 rounded-full mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 text-center">{student.name}</h3>
                <p className="text-sm text-gray-500 text-center">{student.grade} • Student ID: {student.id}</p>
                <div className="mt-4 flex space-x-3">
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Message
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.phone}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.address}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Joined</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.joinDate}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Parent/Guardian</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.parentName}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Parent Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.parentContact}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Bio</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.bio}</dd>
                  </div>
                </dl>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Quick Links</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/student/timetable" className="text-sm text-indigo-600 hover:text-indigo-500">
                    View Timetable
                  </Link>
                  <Link to="/student/grades" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Academic Record
                  </Link>
                  <Link to="/student/attendance" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Attendance Report
                  </Link>
                  <Link to="/student/documents" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Documents
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* Enrolled Subjects */}
            <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Enrolled Subjects</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {enrolledSubjects.length} Subjects
                </span>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrolledSubjects.map(subject => (
                        <tr key={subject.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">{subject.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{subject.teacher}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {subject.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${subject.progress}%` }}></div>
                              </div>
                              <span className="ml-2">{subject.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map(activity => (
                    <li key={activity.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">{activity.type.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.type} • {activity.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activity.status === 'Submitted' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {activity.status}
                          </span>
                          {activity.score && (
                                                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {activity.score}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 text-right">
                                          <Link to="/student/activities" className="text-sm text-indigo-600 hover:text-indigo-500">
                                            View All Activities →
                                          </Link>
                                        </div>
                                      </div>
                          
                                      {/* Achievements */}
                                      <div className="bg-white shadow overflow-hidden rounded-lg">
                                        <div className="px-4 py-5 sm:px-6">
                                          <h3 className="text-lg font-medium text-gray-900">Achievements & Awards</h3>
                                        </div>
                                        <div className="border-t border-gray-200">
                                          <ul className="divide-y divide-gray-200">
                                            {achievements.map(achievement => (
                                              <li key={achievement.id} className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center">
                                                  <div className="flex-shrink-0">
                                                    <svg className="h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                      <path d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"/>
                                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                                                    </svg>
                                                  </div>
                                                  <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                                                    <p className="text-xs text-gray-500">{achievement.date}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                                  </div>
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 text-right">
                                          <Link to="/student/achievements" className="text-sm text-indigo-600 hover:text-indigo-500">
                                            View All Achievements →
                                          </Link>
                                        </div>
                                      </div>
                          
                                      {/* Academic Performance */}
                                      <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
                                        <div className="px-4 py-5 sm:px-6">
                                          <h3 className="text-lg font-medium text-gray-900">Academic Performance</h3>
                                        </div>
                                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                              <h4 className="text-sm font-medium text-gray-500 mb-2">Current Semester GPA</h4>
                                              <div className="flex items-center">
                                                <span className="text-3xl font-bold text-gray-900">3.8</span>
                                                <span className="ml-2 flex items-center text-sm text-green-600">
                                                  <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                  </svg>
                                                  <span>0.2</span>
                                                </span>
                                              </div>
                                              <p className="text-xs text-gray-500 mt-1">Compared to last semester</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                              <h4 className="text-sm font-medium text-gray-500 mb-2">Cumulative GPA</h4>
                                              <div className="flex items-center">
                                                <span className="text-3xl font-bold text-gray-900">3.7</span>
                                                <span className="ml-2 flex items-center text-sm text-green-600">
                                                  <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                  </svg>
                                                  <span>0.1</span>
                                                </span>
                                              </div>
                                              <p className="text-xs text-gray-500 mt-1">Overall academic performance</p>
                                            </div>
                                          </div>
                                          <div className="mt-4 text-center">
                                            <Link to="/student/grades/transcript" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                              View Full Transcript
                                            </Link>
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
                          
                          export default StudentProfile;
                          