// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';

// const VirtualClassroom = () => {
//   // Refs for video elements
//   const teacherVideoRef = useRef(null);
//   const userVideoRef = useRef(null);
//   const whiteboardRef = useRef(null);
//   const whiteboardCtxRef = useRef(null);

//   // State for classroom functionality
//   const [isConnected, setIsConnected] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
//   const [isHandRaised, setIsHandRaised] = useState(false);
//   const [isTeacher, setIsTeacher] = useState(true); // Toggle for demo purposes
//   const [chatMessages, setChatMessages] = useState([
//     { id: 1, sender: 'Alex Johnson', message: 'Hello everyone!', time: '10:01 AM', isTeacher: false },
//     { id: 2, sender: 'Dr. Emily Watson', message: 'Welcome to today\'s class on Algebraic Expressions.', time: '10:02 AM', isTeacher: true },
//     { id: 3, sender: 'Sarah Miller', message: 'I have a question about yesterday\'s homework.', time: '10:03 AM', isTeacher: false },
//     { id: 4, sender: 'Dr. Emily Watson', message: 'We\'ll address homework questions in the Q&A section, Sarah.', time: '10:03 AM', isTeacher: true },
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [participants, setParticipants] = useState([
//     { id: 1, name: 'Dr. Emily Watson', role: 'Teacher', isTeacher: true, isActive: true, avatar: 'https://via.placeholder.com/40' },
//     { id: 2, name: 'Alex Johnson', role: 'Student', isTeacher: false, isActive: true, avatar: 'https://via.placeholder.com/40' },
//     { id: 3, name: 'Sarah Miller', role: 'Student', isTeacher: false, isActive: true, avatar: 'https://via.placeholder.com/40' },
//     { id: 4, name: 'James Thompson', role: 'Student', isTeacher: false, isActive: true, avatar: 'https://via.placeholder.com/40' },
//     { id: 5, name: 'Lisa Rodriguez', role: 'Student', isTeacher: false, isActive: true, avatar: 'https://via.placeholder.com/40' },
//     { id: 6, name: 'Michael Brown', role: 'Student', isTeacher: false, isActive: false, avatar: 'https://via.placeholder.com/40' },
//     { id: 7, name: 'Jennifer Adams', role: 'Student', isTeacher: false, isActive: true, avatar: 'https://via.placeholder.com/40' },
//     { id: 8, name: 'David Chen', role: 'Student', isTeacher: false, isActive: true, avatar: 'https://via.placeholder.com/40' },
//   ]);
//   const [raisedHands, setRaisedHands] = useState([
//     { id: 3, name: 'Sarah Miller', time: '10:03 AM' },
//     { id: 5, name: 'Lisa Rodriguez', time: '10:05 AM' },
//   ]);
//   const [currentView, setCurrentView] = useState('gallery'); // gallery, speaker, whiteboard, screen
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPollActive, setIsPollActive] = useState(false);
//   const [currentPoll, setCurrentPoll] = useState({
//     question: 'Which of the following is a quadratic equation?',
//     options: [
//       { id: 1, text: 'y = mx + c', votes: 0 },
//       { id: 2, text: 'ax² + bx + c = 0', votes: 0 },
//       { id: 3, text: 'y = x³ + 2x² - 5', votes: 0 },
//       { id: 4, text: 'y = sin(x)', votes: 0 },
//     ],
//     totalVotes: 0
//   });
//   const [whiteboardColor, setWhiteboardColor] = useState('#000000');
//   const [whiteboardBrushSize, setWhiteboardBrushSize] = useState(3);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [classInfo] = useState({
//     title: 'Mathematics - Algebraic Expressions',
//     teacher: 'Dr. Emily Watson',
//     time: '10:00 AM - 11:00 AM',
//     date: 'Monday, October 10, 2023',
//     duration: '60 minutes',
//     currentTime: '10:15 AM',
//   });

//   // Initialize whiteboard when component mounts
//   useEffect(() => {
//     if (whiteboardRef.current) {
//       const canvas = whiteboardRef.current;
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.lineCap = 'round';
//       ctx.lineJoin = 'round';
//       ctx.strokeStyle = whiteboardColor;
//       ctx.lineWidth = whiteboardBrushSize;
//       whiteboardCtxRef.current = ctx;
//     }
//   }, [isWhiteboardActive, whiteboardColor, whiteboardBrushSize]);

//   // Handle window resize for whiteboard
//   useEffect(() => {
//     const handleResize = () => {
//       if (whiteboardRef.current && whiteboardCtxRef.current) {
//         const canvas = whiteboardRef.current;
//         const ctx = whiteboardCtxRef.current;
        
//         // Save the current drawing
//         const tempCanvas = document.createElement('canvas');
//         const tempCtx = tempCanvas.getContext('2d');
//         tempCanvas.width = canvas.width;
//         tempCanvas.height = canvas.height;
//         tempCtx.drawImage(canvas, 0, 0);
        
//         // Resize canvas
//         canvas.width = canvas.offsetWidth;
//         canvas.height = canvas.offsetHeight;
        
//         // Restore drawing settings
//         ctx.lineCap = 'round';
//         ctx.lineJoin = 'round';
//         ctx.strokeStyle = whiteboardColor;
//         ctx.lineWidth = whiteboardBrushSize;
        
//         // Restore the drawing
//         ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [whiteboardColor, whiteboardBrushSize]);

//   // Whiteboard drawing functions
//   const startDrawing = (e) => {
//     if (!isTeacher && isWhiteboardActive) return; // Only teacher can draw
    
//     const canvas = whiteboardRef.current;
//     const ctx = whiteboardCtxRef.current;
    
//     if (!canvas || !ctx) return;
    
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     setIsDrawing(true);
//   };

//   const draw = (e) => {
//     if (!isDrawing || !isTeacher || !isWhiteboardActive) return;
    
//     const canvas = whiteboardRef.current;
//     const ctx = whiteboardCtxRef.current;
    
//     if (!canvas || !ctx) return;
    
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     if (!isTeacher || !isWhiteboardActive) return;
    
//     const ctx = whiteboardCtxRef.current;
//     if (!ctx) return;
    
//     ctx.closePath();
//     setIsDrawing(false);
//   };

//   const clearWhiteboard = () => {
//     const canvas = whiteboardRef.current;
//     const ctx = whiteboardCtxRef.current;
    
//     if (!canvas || !ctx) return;
    
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   };

//   // Handle chat message submission
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;
    
//     const newMsg = {
//       id: chatMessages.length + 1,
//       sender: isTeacher ? 'Dr. Emily Watson' : 'Alex Johnson',
//       message: newMessage,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       isTeacher: isTeacher
//     };
    
//     setChatMessages([...chatMessages, newMsg]);
//     setNewMessage('');
//   };

//   // Toggle hand raise
//   const toggleHandRaise = () => {
//     setIsHandRaised(!isHandRaised);
    
//     // If raising hand, add to list
//     if (!isHandRaised && !isTeacher) {
//       const newRaisedHand = {
//         id: 2, // Assuming current user is Alex Johnson with id 2
//         name: 'Alex Johnson',
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };
//       setRaisedHands([...raisedHands, newRaisedHand]);
//     } else {
//       // If lowering hand, remove from list
//       setRaisedHands(raisedHands.filter(hand => hand.id !== 2));
//     }
//   };

//   // Toggle poll
//   const togglePoll = () => {
//     setIsPollActive(!isPollActive);
//   };

//   // Vote in poll
//   const handleVote = (optionId) => {
//     const updatedOptions = currentPoll.options.map(option => {
//       if (option.id === optionId) {
//         return { ...option, votes: option.votes + 1 };
//       }
//       return option;
//     });
    
//     setCurrentPoll({
//       ...currentPoll,
//       options: updatedOptions,
//       totalVotes: currentPoll.totalVotes + 1
//     });
//   };

//   // Toggle screen sharing
//   const toggleScreenSharing = () => {
//     if (!isTeacher) return; // Only teacher can share screen
    
//     setIsScreenSharing(!isScreenSharing);
//     if (isWhiteboardActive && !isScreenSharing) {
//       setIsWhiteboardActive(false);
//     }
//     setCurrentView(isScreenSharing ? 'gallery' : 'screen');
//   };

//   // Toggle whiteboard
//   const toggleWhiteboard = () => {
//     if (!isTeacher) return; // Only teacher can activate whiteboard
    
//     setIsWhiteboardActive(!isWhiteboardActive);
//     if (isScreenSharing && !isWhiteboardActive) {
//       setIsScreenSharing(false);
//     }
//     setCurrentView(isWhiteboardActive ? 'gallery' : 'whiteboard');
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen flex flex-col">
//       {/* Header */}
//       <header className="bg-gray-800 shadow-md">
//         <div className="max-w-full mx-auto px-4 py-2 flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-xl font-bold text-white">{classInfo.title}</h1>
//             <span className="ml-4 px-2 py-1 rounded-md bg-gray-700 text-xs text-gray-300">
//               {classInfo.time} • {classInfo.currentTime}
//             </span>
//           </div>
//           <div className="flex items-center space-x-4">
//             {isRecording && (
//               <span className="flex items-center px-2 py-1 rounded-md bg-red-900 text-xs text-red-100">
//                 <span className="h-2 w-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
//                 Recording
//               </span>
//             )}
//             <button 
//               onClick={() => setIsRecording(!isRecording)}
//               className={`px-3 py-1 rounded-md text-xs font-medium ${
//                 isRecording ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-gray-700 text-white hover:bg-gray-600'
//               }`}
//             >
//               {isRecording ? 'Stop Recording' : 'Start Recording'}
//             </button>
//             <Link 
//               to="/dashboard" 
//               className="px-3 py-1 rounded-md bg-red-600 text-xs font-medium text-white hover:bg-red-700"
//             >
//               Leave Class
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 flex overflow-hidden">
//         {/* Main content area */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Video/Whiteboard display area */}
//           <div className="flex-1 bg-black relative overflow-hidden">
//             {/* Teacher video */}
//             {currentView === 'speaker' && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="relative w-full max-w-4xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
//                   <video 
//                     ref={teacherVideoRef}
//                     className="w-full h-full object-cover"
//                     poster="https://via.placeholder.com/1280x720/374151/FFFFFF?text=Teacher+Video"
//                     muted={isMuted}
//                   />
//                   <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-75 px-2 py-1 rounded-md text-white text-sm">
//                     Dr. Emily Watson (Teacher)
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Screen sharing */}
//             {currentView === 'screen' && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="relative w-full max-w-5xl aspect-video bg-white rounded-lg overflow-hidden">
//                   <img 
//                     src="https://via.placeholder.com/1920x1080/FFFFFF/333333?text=Teacher's+Screen"
//                     alt="Shared screen"
//                     className="w-full h-full object-contain"
//                   />
//                   <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-md text-white text-xs">
//                   Screen Sharing
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Whiteboard */}
//             {currentView === 'whiteboard' && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="relative w-full max-w-5xl aspect-video bg-white rounded-lg overflow-hidden">
//                   <canvas
//                     ref={whiteboardRef}
//                     className="w-full h-full cursor-crosshair"
//                     onMouseDown={startDrawing}
//                     onMouseMove={draw}
//                     onMouseUp={stopDrawing}
//                     onMouseLeave={stopDrawing}
//                   />
//                   {isTeacher && (
//                     <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-75 p-2 rounded-md flex items-center space-x-2">
//                       <input
//                         type="color"
//                         value={whiteboardColor}
//                         onChange={(e) => setWhiteboardColor(e.target.value)}
//                         className="w-6 h-6 rounded cursor-pointer"
//                       />
//                       <select
//                         value={whiteboardBrushSize}
//                         onChange={(e) => setWhiteboardBrushSize(parseInt(e.target.value))}
//                         className="bg-gray-700 text-white text-xs rounded px-1 py-1"
//                       >
//                         <option value="1">Thin</option>
//                         <option value="3">Medium</option>
//                         <option value="5">Thick</option>
//                         <option value="8">Extra Thick</option>
//                       </select>
//                       <button
//                         onClick={clearWhiteboard}
//                         className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
//                       >
//                         Clear
//                       </button>
//                     </div>
//                   )}
//                   <div className="absolute top-2 right-2 bg-indigo-600 px-2 py-1 rounded-md text-white text-xs">
//                     Whiteboard Active
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Gallery view */}
//             {currentView === 'gallery' && (
//               <div className="absolute inset-0 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto">
//                 {/* Teacher video - larger */}
//                 <div className="col-span-1 sm:col-span-2 row-span-2 relative bg-gray-800 rounded-lg overflow-hidden">
//                   <video
//                     ref={teacherVideoRef}
//                     className="w-full h-full object-cover"
//                     poster="https://via.placeholder.com/640x360/374151/FFFFFF?text=Teacher+Video"
//                     muted={isMuted}
//                   />
//                   <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 px-2 py-1 rounded-md text-white text-xs">
//                     Dr. Emily Watson (Teacher)
//                   </div>
//                   {isScreenSharing && (
//                     <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-md text-white text-xs">
//                       Sharing Screen
//                     </div>
//                   )}
//                 </div>

//                 {/* Student videos */}
//                 {participants.filter(p => p.id !== 1 && p.isActive).map(participant => (
//                   <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
//                     <video
//                       className="w-full h-full object-cover"
//                       poster={`https://via.placeholder.com/320x180/374151/FFFFFF?text=${participant.name}`}
//                       muted
//                     />
//                     <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 px-2 py-1 rounded-md text-white text-xs">
//                       {participant.name}
//                       {participant.id === 2 && isHandRaised && (
//                         <span className="ml-1 text-yellow-400">✋</span>
//                       )}
//                     </div>
//                     {raisedHands.some(hand => hand.id === participant.id) && participant.id !== 2 && (
//                       <div className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded-md text-white text-xs">
//                         ✋ Hand Raised
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Controls overlay at bottom */}
//             <div className="absolute bottom-0 inset-x-0 bg-gray-800 bg-opacity-90 px-4 py-2">
//               <div className="flex justify-center items-center space-x-4">
//                 <button
//                   onClick={() => setIsMuted(!isMuted)}
//                   className={`p-2 rounded-full ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}
//                 >
//                   {isMuted ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                     </svg>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => setIsVideoOn(!isVideoOn)}
//                   className={`p-2 rounded-full ${!isVideoOn ? 'bg-red-600 text-white' : 'bg-gray-700 text-white'}`}
//                 >
//                   {!isVideoOn ? (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
//                     </svg>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//                     </svg>
//                   )}
//                 </button>
//                 <button
//                   onClick={toggleHandRaise}
//                   className={`p-2 rounded-full ${isHandRaised ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-white'}`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
//                   </svg>
//                 </button>
//                 {isTeacher && (
//                   <>
//                     <button
//                       onClick={toggleScreenSharing}
//                       className={`p-2 rounded-full ${isScreenSharing ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'}`}
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={toggleWhiteboard}
//                       className={`p-2 rounded-full ${isWhiteboardActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-white'}`}
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={togglePoll}
//                       className={`p-2 rounded-full ${isPollActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'}`}
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//                       </svg>
//                     </button>
//                   </>
//                 )}
//                 <div className="border-l border-gray-600 h-8 mx-2"></div>
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => setCurrentView('gallery')}
//                     className={`p-2 rounded-md text-xs ${currentView === 'gallery' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
//                   >
//                     Gallery View
//                   </button>
//                   <button
//                     onClick={() => setCurrentView('speaker')}
//                     className={`p-2 rounded-md text-xs ${currentView === 'speaker' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
//                   >
//                     Speaker View
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Poll overlay */}
//           {isPollActive && (
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-lg p-4 w-80">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-white font-medium">Poll</h3>
//                 <button 
//                   onClick={togglePoll}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <p className="text-white text-sm mb-3">{currentPoll.question}</p>
//               <div className="space-y-2">
//                 {currentPoll.options.map(option => (
//                   <div key={option.id} className="bg-gray-700 rounded-md p-2">
//                     <div className="flex justify-between items-center">
//                       <label className="text-white text-sm flex items-center">
//                         <input
//                           type="radio"
//                           name="poll-option"
//                           className="mr-2"
//                           onChange={() => handleVote(option.id)}
//                         />
//                         {option.text}
//                       </label>
//                       <span className="text-xs text-gray-400">
//                         {currentPoll.totalVotes > 0 
//                           ? `${Math.round((option.votes / currentPoll.totalVotes) * 100)}%` 
//                           : '0%'}
//                       </span>
//                     </div>
//                     {currentPoll.totalVotes > 0 && (
//                       <div className="mt-1 h-1 w-full bg-gray-600 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-blue-500 rounded-full" 
//                           style={{ width: `${(option.votes / currentPoll.totalVotes) * 100}%` }}
//                         ></div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               {isTeacher && (
//                 <div className="mt-4 flex justify-end">
//                   <button 
//                     onClick={togglePoll}
//                     className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
//                   >
//                     End Poll
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
//           {/* Tabs */}
//           <div className="flex border-b border-gray-700">
//             <button className="flex-1 py-3 text-sm font-medium text-white bg-gray-700">
//               Chat
//             </button>
//             <button className="flex-1 py-3 text-sm font-medium text-gray-400 hover:text-white">
//               Participants ({participants.filter(p => p.isActive).length})
//             </button>
//           </div>

//           {/* Chat messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {chatMessages.map(message => (
//               <div key={message.id} className={`flex ${message.isTeacher ? 'justify-start' : 'justify-end'}`}>
//                 <div className={`max-w-xs rounded-lg px-4 py-2 ${
//                   message.isTeacher 
//                     ? 'bg-indigo-600 text-white' 
//                     : 'bg-gray-700 text-white'
//                 }`}>
//                   <div className="flex items-center">
//                     <span className={`text-xs font-medium ${
//                       message.isTeacher ? 'text-indigo-200' : 'text-gray-300'
//                     }`}>
//                       {message.sender}
//                     </span>
//                     <span className={`ml-2 text-xs ${
//                       message.isTeacher ? 'text-indigo-300' : 'text-gray-400'
//                     }`}>
//                       {message.time}
//                     </span>
//                   </div>
//                   <p className="mt-1 text-sm">{message.message}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Chat input */}
//           <div className="p-4 border-t border-gray-700">
//             <form onSubmit={handleSendMessage} className="flex">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 bg-gray-700 text-white text-sm rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//               />
//               <button
//                 type="submit"
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Raised hands sidebar - only visible for teacher */}
//         {isTeacher && raisedHands.length > 0 && (
//           <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
//             <div className="p-4 border-b border-gray-700">
//               <h3 className="text-white font-medium flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
//                 </svg>
//                 Raised Hands ({raisedHands.length})
//               </h3>
//             </div>
//             <div className="flex-1 overflow-y-auto p-2">
//               {raisedHands.map(hand => (
//                 <div key={hand.id} className="bg-gray-700 rounded-md p-3 mb-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-white text-sm">{hand.name}</span>
//                     <span className="text-xs text-gray-400">{hand.time}</span>
//                   </div>
//                   <div className="mt-2 flex space-x-2">
//                     <button className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700">
//                       Call On
//                     </button>
//                     <button className="flex-1 bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-500">
//                       Dismiss
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default VirtualClassroom;
