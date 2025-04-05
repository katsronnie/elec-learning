import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';

const AdminDashboard = () => {
  const [adminName] = useState('Michael Thompson');
  const [role] = useState('System Administrator');
  
  // Firebase data states
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [platformStats, setPlatformStats] = useState([
    { id: 1, name: 'Total Users', count: 0, change: '0%', icon: 'users' },
    { id: 2, name: 'Active Courses', count: 0, change: '0%', icon: 'book' },
    { id: 3, name: 'Revenue', count: '$0', change: '0%', icon: 'cash' },
    { id: 4, name: 'Support Tickets', count: 0, change: '0%', icon: 'ticket' }
  ]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  
  // Modal states for adding teachers and subjects
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    phone: ''
  });
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    department: '',
    teacherId: '',
    price: ''
  });
  
  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentsSnapshot = await getDocs(collection(db, 'users'));
        const studentsData = [];
        studentsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.role === 'student') {
            studentsData.push({ id: doc.id, ...data });
          }
        });
        setStudents(studentsData);
        
        // Fetch teachers
        const teachersSnapshot = await getDocs(collection(db, 'users'));
        const teachersData = [];
        teachersSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.role === 'teacher') {
            teachersData.push({ id: doc.id, ...data });
          }
        });
        setTeachers(teachersData);
        
        // Fetch subjects
        const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
        const subjectsData = [];
        subjectsSnapshot.forEach(doc => {
          subjectsData.push({ id: doc.id, ...doc.data() });
        });
        setSubjects(subjectsData);
        
        // Fetch recent activities
        const activitiesQuery = query(
          collection(db, 'activities'),
          orderBy('timestamp', 'desc'),
          limit(3)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activitiesData = [];
        activitiesSnapshot.forEach(doc => {
          const data = doc.data();
          activitiesData.push({
            id: doc.id,
            action: data.action,
            user: data.user,
            time: formatTimestamp(data.timestamp),
            status: data.status
          });
        });
        setRecentActivities(activitiesData.length > 0 ? activitiesData : [
          { id: 1, action: 'No recent activities', user: 'System', time: 'Now', status: 'Info' }
        ]);
        
        // Fetch pending approvals
        const approvalsQuery = query(
          collection(db, 'approvals'),
          where('status', '==', 'pending')
        );
        const approvalsSnapshot = await getDocs(approvalsQuery);
        const approvalsData = [];
        approvalsSnapshot.forEach(doc => {
          approvalsData.push({ id: doc.id, ...doc.data() });
        });
        setPendingApprovals(approvalsData.length > 0 ? approvalsData : [
          { id: 1, type: 'No pending approvals', name: '', department: '', date: '' }
        ]);
        
        // Update platform stats
        setPlatformStats([
          { id: 1, name: 'Total Users', count: studentsData.length + teachersData.length, change: '+0%', icon: 'users' },
          { id: 2, name: 'Active Courses', count: subjectsData.length, change: '+0%', icon: 'book' },
          { id: 3, name: 'Revenue', count: calculateRevenue(studentsData), change: '+0%', icon: 'cash' },
          { id: 4, name: 'Support Tickets', count: 0, change: '0%', icon: 'ticket' }
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const date = timestamp.toDate();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };
  
  // Helper function to calculate revenue
  const calculateRevenue = (students) => {
    let total = 0;
    students.forEach(student => {
      if (student.subscriptions) {
        Object.values(student.subscriptions).forEach(sub => {
          if (sub.paid) {
            total += sub.amount || 0;
          }
        });
      }
    });
    return `$${total.toFixed(2)}`;
  };
  
  // Handle adding a new teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        newTeacher.email, 
        newTeacher.password
      );
      
      // Add user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: newTeacher.name,
        email: newTeacher.email,
        role: 'teacher',
        department: newTeacher.department,
        phone: newTeacher.phone,
        subject:newTeacher.subject,
        createdAt: serverTimestamp()
      });
      
      // Add activity log
      await addDoc(collection(db, 'activities'), {
        action: `New teacher added: ${newTeacher.name}`,
        user: adminName,
        timestamp: serverTimestamp(),
        status: 'Completed'
      });
      
      // Reset form and close modal
      setNewTeacher({
        name: '',
        email: '',
        password: '',
        department: '',
        phone: ''
      });
      setShowTeacherModal(false);
      
      // Refresh teacher list
      const teachersSnapshot = await getDocs(collection(db, 'users'));
      const teachersData = [];
      teachersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.role === 'teacher') {
          teachersData.push({ id: doc.id, ...data });
        }
      });
      setTeachers(teachersData);
      
      alert('Teacher added successfully!');
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert(`Error adding teacher: ${error.message}`);
    }
  };
  
  // Handle adding a new subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      // Add subject to Firestore
      await addDoc(collection(db, 'subjects'), {
        name: newSubject.name,
        description: newSubject.description,
        department: newSubject.department,
        teacherId: newSubject.teacherId,
        price: parseFloat(newSubject.price) || 0,
        createdAt: serverTimestamp()
      });
      
      // Add activity log
      await addDoc(collection(db, 'activities'), {
        action: `New subject added: ${newSubject.name}`,
        user: adminName,
        timestamp: serverTimestamp(),
        status: 'Completed'
      });
      
      // Reset form and close modal
      setNewSubject({
        name: '',
        description: '',
        department: '',
        teacherId: '',
        price: ''
      });
      setShowSubjectModal(false);
      
      // Refresh subject list
      const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
      const subjectsData = [];
      subjectsSnapshot.forEach(doc => {
        subjectsData.push({ id: doc.id, ...doc.data() });
      });
      setSubjects(subjectsData);
      
      alert('Subject added successfully!');
    } catch (error) {
      console.error("Error adding subject:", error);
      alert(`Error adding subject: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {adminName}</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Platform Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {platformStats.map((stat) => (
            <div key={stat.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    {/* Icon would go here */}
                    <span className="text-white">{stat.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.count}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {stat.change}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="mb-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
              <p className="mt-1 text-sm text-gray-500">A log of recent system activities and events.</p>
            </div>
            <div className="bg-white overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {activity.action}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {activity.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span>By: {activity.user}</span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>Time: {activity.time}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Link to="/admin/activities" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                View All Activities
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="mb-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Approvals</h3>
              <p className="mt-1 text-sm text-gray-500">Requests waiting for your approval.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingApprovals.map((approval) => (
                    <tr key={approval.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {approval.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {approval.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {approval.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {approval.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                        <button className="text-red-600 hover:text-red-900">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Students and Subscriptions */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Students & Subscriptions</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTeacherModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Add Teacher
              </button>
              <button
                onClick={() => setShowSubjectModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Subject
              </button>
            </div>
          </div>
          
          {/* Students Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Enrolled Students</h3>
              <p className="mt-1 text-sm text-gray-500">A list of all students and their subscription status.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed Subjects
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.displayName}</div>
                              <div className="text-sm text-gray-500">ID: {student.id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.createdAt ? formatTimestamp(student.createdAt) : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.subscriptions && Object.values(student.subscriptions).some(sub => sub.paid)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.subscriptions && Object.values(student.subscriptions).some(sub => sub.paid)
                              ? 'Paid'
                              : 'Unpaid'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.subscriptions ? (
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(student.subscriptions).map(([subjectId, details]) => {
                                const subject = subjects.find(s => s.id === subjectId);
                                return (
                                  <span key={subjectId} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    {subject ? subject.name : 'Unknown Subject'}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            'No subscriptions'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/admin/students/${student.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                            View
                          </Link>
                          <button className="text-green-600 hover:text-green-900">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Link to="/admin/students" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                View All Students
              </Link>
            </div>
          </div>
        
          {/* Teachers Table */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Teachers</h3>
              <p className="mt-1 text-sm text-gray-500">A list of all teachers and their assigned subjects.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Subjects
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No teachers found
                      </td>
                    </tr>
                  ) : (
                    teachers.map((teacher) => {
                      const teacherSubjects = subjects.filter(subject => subject.teacherId === teacher.id);
                      return (
                        <tr key={teacher.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                                {teacher.name ? teacher.name.charAt(0).toUpperCase() : 'T'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                <div className="text-sm text-gray-500">ID: {teacher.id.substring(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacher.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacher.department || 'Not assigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacherSubjects.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {teacherSubjects.map(subject => (
                                  <span key={subject.id} className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    {subject.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              'No subjects assigned'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link to={`/admin/teachers/${teacher.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                              View
                            </Link>
                            <button className="text-green-600 hover:text-green-900">
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Link to="/admin/teachers" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                View All Teachers
              </Link>
            </div>
          </div>
        </div>
        
        {/* Add Teacher Modal */}
        {showTeacherModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleAddTeacher}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Add New Teacher
                        </h3>
                        <div className="mt-4 space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              required
                              value={newTeacher.name}
                              onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              required
                              value={newTeacher.email}
                              onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              required
                              value={newTeacher.password}
                              onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                              Department
                            </label>
                            <input
                              type="text"
                              name="department"
                              id="department"
                              value={newTeacher.department}
                              onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              value={newTeacher.phone}
                              onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Add Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTeacherModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Subject Modal */}
        {showSubjectModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleAddSubject}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Add New Subject
                        </h3>
                        <div className="mt-4 space-y-4">
                          <div>
                            <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700">
                              Subject Name
                            </label>
                            <input
                              type="text"
                              name="subject-name"
                              id="subject-name"
                              required
                              value={newSubject.name}
                              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              name="description"
                              id="description"
                              rows="3"
                              value={newSubject.description}
                              onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                          </div>
                          <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                              Department
                            </label>
                            <input
                              type="text"
                              name="department"
                              id="department"
                              value={newSubject.department}
                              onChange={(e) => setNewSubject({...newSubject, department: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">
                              Assign Teacher
                            </label>
                            <select
                              id="teacher"
                              name="teacher"
                              value={newSubject.teacherId}
                              onChange={(e) => setNewSubject({...newSubject, teacherId: e.target.value})}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            >
                              <option value="">Select a teacher</option>
                              {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                  {teacher.name} ({teacher.department || 'No Department'})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              min="0"
                              step="0.01"
                              value={newSubject.price}
                              onChange={(e) => setNewSubject({...newSubject, price: e.target.value})}
                              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Add Subject
            </button>
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{/* Maintenance Mode section remains the same */}
<div className="mt-6">
  <div className="bg-green-50 rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-green-900">System Maintenance</h3>
        <p className="text-sm text-green-700 mt-1">Schedule maintenance windows or enable maintenance mode for system updates</p>
      </div>
      <Link to="/admin/maintenance" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Maintenance Settings
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

export default AdminDashboard;
