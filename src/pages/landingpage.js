import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* App Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/app-logo.png" alt="App Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-xl font-bold">School E-Learning</h1>
          </div>
          <div className="flex space-x-2">
            <Link to="/login" className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded-md text-sm font-medium">Login</Link>
            <Link to="/register" className="px-3 py-1 bg-white text-blue-600 rounded-md text-sm font-medium">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex flex-col items-center text-center">
            <img src="/app-illustration.png" alt="App Illustration" className="w-64 h-64 mb-4 object-contain" />
            <h2 className="text-2xl font-bold mb-2">Welcome to School E-Learning</h2>
            <p className="mb-4">Your complete learning companion</p>
            <Link to="/signup" className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium shadow-md">Get Started</Link>
          </div>
        </div>

        {/* App Features */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Key Features</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-2">
                <img src="/lessons-icon.png" alt="Lessons" className="h-8 w-8" />
              </div>
              <h4 className="font-medium text-blue-700 mb-1">Interactive Lessons</h4>
              <p className="text-xs text-gray-600 text-center">Learn through engaging content</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
              <div className="bg-purple-100 p-2 rounded-full mb-2">
                <img src="/homework-icon.png" alt="Homework" className="h-8 w-8" />
              </div>
              <h4 className="font-medium text-purple-700 mb-1">Homework</h4>
              <p className="text-xs text-gray-600 text-center">Submit and track assignments</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
              <div className="bg-green-100 p-2 rounded-full mb-2">
                <img src="/resources-icon.png" alt="Resources" className="h-8 w-8" />
              </div>
              <h4 className="font-medium text-green-700 mb-1">Study Resources</h4>
              <p className="text-xs text-gray-600 text-center">Access learning materials</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
              <div className="bg-orange-100 p-2 rounded-full mb-2">
                <img src="/progress-icon.png" alt="Progress" className="h-8 w-8" />
              </div>
              <h4 className="font-medium text-orange-700 mb-1">Track Progress</h4>
              <p className="text-xs text-gray-600 text-center">Monitor your learning journey</p>
            </div>
          </div>
        </div>

        {/* App Screenshots */}
        <div className="p-4 bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">App Preview</h3>
          <div className="flex overflow-x-auto pb-4 space-x-4 snap-x">
            <img src="/screenshot1.png" alt="App Screenshot" className="h-48 rounded-lg shadow-md snap-center" />
            <img src="/screenshot2.png" alt="App Screenshot" className="h-48 rounded-lg shadow-md snap-center" />
            <img src="/screenshot3.png" alt="App Screenshot" className="h-48 rounded-lg shadow-md snap-center" />
          </div>
        </div>

        {/* Testimonials */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Student Feedback</h3>
          <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
            <div className="flex items-center mb-2">
              <img src="/student1.jpg" alt="Student" className="h-8 w-8 rounded-full mr-2" />
              <div>
                <p className="font-medium text-sm">Sarah J.</p>
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">"This app has made studying so much easier. I can access all my materials in one place!"</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center mb-2">
              <img src="/student2.jpg" alt="Student" className="h-8 w-8 rounded-full mr-2" />
              <div>
                <p className="font-medium text-sm">Michael T.</p>
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">"Submitting homework through the app is so convenient. I never miss deadlines now."</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
          <p className="text-sm mb-4">Join your classmates on the School E-Learning app today</p>
          <Link to="/signup" className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium shadow-md inline-block">Create Account</Link>
        </div>
      </main>

      {/* App Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>© 2023 School E-Learning App</p>
        <div className="flex justify-center space-x-4 mt-2">
          {/* <a href="#" className="text-gray-400 hover:text-white">Help</a>
          <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
          <a href="#" className="text-gray-400 hover:text-white">Terms</a> */}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
