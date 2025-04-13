// import React, { useState } from 'react';
// import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// const SubmissionDialog = ({ isOpen, onClose, submissionLink, studentId, studentName }) => {
//   const [submissionText, setSubmissionText] = useState('');
//   const [submissionUrl, setSubmissionUrl] = useState('');
//   const [file, setFile] = useState(null); // For the uploaded file
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!submissionText && !submissionUrl && !file) {
//       setError("Please provide a comment, a link, or upload a file.");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       // Reference to the submission link document
//       const submissionLinkRef = doc(db, "submissionLinks", submissionLink.id);
      
//       let uploadedFileUrl = "";

//       // If a file is uploaded, store it in Firebase Storage
//       if (file) {
//         const storage = getStorage();
//         const filePath = `submissions/${submissionLink.id}/${studentId}/${file.name}`;
//         const storageRef = ref(storage, filePath);
//         const snapshot = await uploadBytes(storageRef, file);
//         uploadedFileUrl = await getDownloadURL(snapshot.ref);
//       }

//       // Create the submission data
//       const submissionData = {
//         studentId,
//         studentName,
//         submittedAt: serverTimestamp(),
//         comment: submissionText,
//         url: submissionUrl || uploadedFileUrl, // Use provided URL or the uploaded file URL
//         status: "submitted"
//       };

//       // Update the submissions field in the document
//       // This creates a map where the key is the studentId and the value is the submission data
//       await updateDoc(submissionLinkRef, {
//         [`submissions.${studentId}`]: submissionData
//       });

//       setSuccess(true);
//       setIsSubmitting(false);

//       // Reset form after successful submission
//       setTimeout(() => {
//         setSubmissionText('');
//         setSubmissionUrl('');
//         setFile(null); // Clear file input
//         setSuccess(false);
//         onClose(true); // Pass true to indicate successful submission
//       }, 2000);
      
//     } catch (error) {
//       console.error("Error submitting work:", error);
//       setError("Failed to submit your work. Please try again.");
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//       <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
//                   {submissionLink?.hasSubmitted ? "View Your Submission" : "Submit Your Work"}
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500 mb-4">
//                     {submissionLink?.title} - {submissionLink?.subject}
//                   </p>
//                   <p className="text-sm text-gray-700 mb-4">
//                     <span className="font-medium">Due:</span> {submissionLink?.formattedClosingTime}
//                   </p>
//                   {submissionLink?.description && (
//                     <div className="mb-4 p-3 bg-gray-50 rounded-md">
//                       <p className="text-sm text-gray-700">{submissionLink?.description}</p>
//                     </div>
//                   )}
                  
//                   {submissionLink?.hasSubmitted ? (
//                     <div className="mt-4">
//                       <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
//                         <div className="flex">
//                           <div className="flex-shrink-0">
//                             <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                             </svg>
//                           </div>
//                           <div className="ml-3">
//                             <p className="text-sm font-medium text-green-800">
//                               You have already submitted this assignment
//                             </p>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Display the previous submission details */}
//                       <div className="border border-gray-200 rounded-md p-4">
//                         <h4 className="text-sm font-medium text-gray-900 mb-2">Your Submission</h4>
//                         {/* This would need to be populated with actual submission data */}
//                         <p className="text-sm text-gray-700 mb-2">
//                           {submissionLink?.submissions?.[studentId]?.comment || "No comment provided"}
//                         </p>
//                         {submissionLink?.submissions?.[studentId]?.url && (
//                           <a 
//                             href={submissionLink.submissions[studentId].url} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="text-sm text-blue-600 hover:text-blue-800"
//                           >
//                             View Submitted Work
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <form onSubmit={handleSubmit}>
//                       <div className="mb-4">
//                         <label htmlFor="submissionText" className="block text-sm font-medium text-gray-700 mb-1">
//                           Comments or Notes (optional)
//                         </label>
//                         <textarea
//                           id="submissionText"
//                           name="submissionText"
//                           rows={4}
//                           className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           placeholder="Add any comments or notes about your submission"
//                           value={submissionText}
//                           onChange={(e) => setSubmissionText(e.target.value)}
//                         />
//                       </div>
//                       <div className="mb-4">
//                         <label htmlFor="submissionUrl" className="block text-sm font-medium text-gray-700 mb-1">
//                           Link to Your Work (Google Drive, GitHub, etc.)
//                         </label>
//                         <input
//                           type="url"
//                           id="submissionUrl"
//                           name="submissionUrl"
//                           className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                           placeholder="https://..."
//                           value={submissionUrl}
//                           onChange={(e) => setSubmissionUrl(e.target.value)}
//                         />
//                       </div>

//                       {/* File upload input */}
//                       <div className="mb-4">
//                         <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">
//                           Upload File (optional)
//                         </label>
//                         <input
//                           type="file"
//                           id="fileUpload"
//                           onChange={(e) => setFile(e.target.files[0])}
//                           className="block w-full text-sm border border-gray-300 rounded-md shadow-sm"
//                         />
//                       </div>
                      
//                       {error && (
//                         <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                           {error}
//                         </div>
//                       )}
                      
//                       {success && (
//                         <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
//                           Your work has been submitted successfully!
//                         </div>
//                       )}
//                     </form>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             {!submissionLink?.hasSubmitted && (
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={isSubmitting || success}
//                 className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
//                   (isSubmitting || success) ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit Work'}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => onClose(false)}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               {submissionLink?.hasSubmitted ? 'Close' : 'Cancel'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmissionDialog;
