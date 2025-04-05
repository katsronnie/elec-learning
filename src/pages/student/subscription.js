// import React from 'react';
// import { Link } from 'react-router-dom';

// const SubscriptionPage = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900">Subject Subscription</h1>
//           <Link to="/studentdashboard" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
//             Back to Dashboard
//           </Link>
//         </div>
//       </header>

//       <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold text-gray-900">Subscribe to Subjects</h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Select the subjects you want to enroll in for this semester. Each subject costs ₦50,000 per semester.
//           </p>
//         </div>
        
//         <SubjectSubscription />
        
//         <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
//           <div className="px-4 py-5 sm:px-6 bg-purple-50">
//             <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Benefits</h3>
//             <p className="mt-1 max-w-2xl text-sm text-gray-500">What you get with your subject subscription</p>
//           </div>
//           <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h4 className="text-sm font-medium text-gray-900">Live Classes</h4>
//                   <p className="mt-1 text-sm text-gray-500">Access to all scheduled live classes for the subject</p>
//                 </div>
//               </div>
              
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h4 className="text-sm font-medium text-gray-900">Study Materials</h4>
//                   <p className="mt-1 text-sm text-gray-500">Complete access to all course materials and resources</p>
//                 </div>
//               </div>
              
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h4 className="text-sm font-medium text-gray-900">Assignments & Tests</h4>
//                   <p className="mt-1 text-sm text-gray-500">All assignments, quizzes, and tests for the subject</p>
//                 </div>
//               </div>
              
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h4 className="text-sm font-medium text-gray-900">Teacher Support</h4>
//                   <p className="mt-1 text-sm text-gray-500">Direct access to teachers for questions and support</p>
//                 </div>
//               </div>
              
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h4 className="text-sm font-medium text-gray-900">Recorded Sessions</h4>
//                   <p className="mt-1 text-sm text-gray-500">Access to recordings of all classes for revision</p>
//                 </div>
//               </div>
              
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h4 className="text-sm font-medium text-gray-900">Progress Tracking</h4>
//                   <p className="mt-1 text-sm text-gray-500">Detailed tracking of your academic progress</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-8">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
//           <p className="text-center text-sm text-gray-500">© 2023 School E-Learning Platform. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default SubscriptionPage;
