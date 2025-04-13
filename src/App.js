import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingpage';
import Virtual from './pages/virtualclass';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { FirebaseProvider } from './contexts/FirebaseContext';
import TeacherDashboard from './pages/teacher/teacherdashboard';
import TeacherWallet from './pages/teacher/teacherwallet';
import StudentDashboard from './pages/student/studentdashboard';
import StudentProfile from './pages/student/studentprofile';
import StudentAssignments from './pages/student/assignment';
import StudentTime from './pages/student/studenttimetable';
import AdminDashboard from './pages/admin/admindashboard';
import TimetablePage from './pages/admin/timetable';
import './index.css';
import SubjectSubscription from './pages/student/subjectsubscription';
import SubscriptionPage from './pages/student/subscription';

function App() {
  return (
    <FirebaseProvider>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/virtualclass" element={<Virtual />} />

        {/* Teacher Routes */}
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/teacherwallet" element={<TeacherWallet />} />

        {/* Student Routes */}
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/studenttimetable" element={<StudentTime />} />
        <Route path="/subscription" element={<SubscriptionPage/>} />
        <Route path="/assignment" element={<StudentAssignments/>} />
        <Route path="/subjectsubscription" element={<SubjectSubscription />} />
        <Route path="/admin/timetable" element={<TimetablePage />} />

        {/* Admin Routes */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    </FirebaseProvider>
  );
}

export default App;