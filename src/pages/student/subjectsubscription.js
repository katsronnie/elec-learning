// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const SubjectSubscription = () => {
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('bank');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [transactionComplete, setTransactionComplete] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [bankName, setBankName] = useState('');

//   const PRICE_PER_SUBJECT = 50000;

//   const availableSubjects = [
//     { id: 1, name: 'Mathematics', code: 'MATH101', description: 'Algebra, Calculus, Geometry and more' },
//     { id: 2, name: 'Biology', code: 'BIO101', description: 'Study of living organisms and their interactions' },
//     { id: 3, name: 'Chemistry', code: 'CHEM101', description: 'Study of matter, its properties, and reactions' },
//     { id: 4, name: 'Physics', code: 'PHYS101', description: 'Study of matter, energy, and their interactions' },
//     { id: 5, name: 'Geography', code: 'GEO101', description: 'Study of lands, features, and inhabitants of Earth' },
//     { id: 6, name: 'Commerce', code: 'COM101', description: 'Study of business, trade, and economics' },
//     { id: 7, name: 'Economics', code: 'ECON101', description: 'Study of production, distribution, and consumption' },
//     { id: 8, name: 'English', code: 'ENG101', description: 'Language, literature, and communication skills' },
//     { id: 9, name: 'History', code: 'HIST101', description: 'Study of past events and human civilization' },
//     { id: 10, name: 'Computer Science', code: 'CS101', description: 'Programming, algorithms, and computing' }
//   ];

//   useEffect(() => {
//     // Calculate total amount whenever selected subjects change
//     setTotalAmount(selectedSubjects.length * PRICE_PER_SUBJECT);
//   }, [selectedSubjects]);

//   const handleSubjectToggle = (subjectId) => {
//     setSelectedSubjects(prevSelected => {
//       if (prevSelected.includes(subjectId)) {
//         return prevSelected.filter(id => id !== subjectId);
//       } else {
//         return [...prevSelected, subjectId];
//       }
//     });
//   };

//   const handlePaymentMethodChange = (method) => {
//     setPaymentMethod(method);
//   };

//   const handleProceedToPayment = () => {
//     if (selectedSubjects.length === 0) {
//       alert('Please select at least one subject to subscribe');
//       return;
//     }
//     setShowConfirmation(true);
//   };

//   const handleConfirmPayment = () => {
//     // Validate payment details
//     if (paymentMethod === 'mobile' && !phoneNumber) {
//       alert('Please enter your mobile money number');
//       return;
//     }
    
//     if (paymentMethod === 'bank' && (!accountNumber || !bankName)) {
//       alert('Please enter your bank account details');
//       return;
//     }

//     setIsProcessing(true);
    
//     // Simulate payment processing
//     setTimeout(() => {
//       setIsProcessing(false);
//       setTransactionComplete(true);
//     }, 2000);
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'UGX',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   return (
//     <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//       <div className="px-4 py-5 sm:px-6 bg-purple-50">
//         <h3 className="text-lg leading-6 font-medium text-gray-900">Subject Subscription</h3>
//         <p className="mt-1 max-w-2xl text-sm text-gray-500">Select subjects you want to subscribe to for this semester</p>
//       </div>
      
//       {!transactionComplete ? (
//         <>
//           {!showConfirmation ? (
//             <div className="border-t border-gray-200">
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="mb-6">
//                   <h4 className="text-md font-medium text-gray-900 mb-2">Available Subjects</h4>
//                   <p className="text-sm text-gray-500 mb-4">Each subject costs {formatCurrency(PRICE_PER_SUBJECT)} per semester</p>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {availableSubjects.map(subject => (
//                       <div 
//                         key={subject.id} 
//                         className={`border rounded-lg p-4 cursor-pointer transition-all ${
//                           selectedSubjects.includes(subject.id) 
//                             ? 'border-purple-500 bg-purple-50' 
//                             : 'border-gray-200 hover:border-purple-300'
//                         }`}
//                         onClick={() => handleSubjectToggle(subject.id)}
//                       >
//                         <div className="flex items-start">
//                           <div className="flex items-center h-5">
//                             <input
//                               type="checkbox"
//                               className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
//                               checked={selectedSubjects.includes(subject.id)}
//                               onChange={() => {}}
//                             />
//                           </div>
//                           <div className="ml-3 text-sm">
//                             <label className="font-medium text-gray-700">{subject.name} <span className="text-gray-500 text-xs">({subject.code})</span></label>
//                             <p className="text-gray-500">{subject.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h4 className="text-md font-medium text-gray-900">Subscription Summary</h4>
//                       <p className="text-sm text-gray-500">
//                         {selectedSubjects.length} {selectedSubjects.length === 1 ? 'subject' : 'subjects'} selected
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-gray-500">Total Amount</p>
//                       <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="mb-6">
//                   <h4 className="text-md font-medium text-gray-900 mb-2">Payment Method</h4>
//                   <div className="flex space-x-4">
//                     <div 
//                       className={`flex-1 border rounded-lg p-4 cursor-pointer ${
//                         paymentMethod === 'bank' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
//                       }`}
//                       onClick={() => handlePaymentMethodChange('bank')}
//                     >
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
//                           checked={paymentMethod === 'bank'}
//                           onChange={() => {}}
//                         />
//                         <label className="ml-3 block text-sm font-medium text-gray-700">
//                           Bank Account
//                         </label>
//                       </div>
//                     </div>
//                     <div 
//                       className={`flex-1 border rounded-lg p-4 cursor-pointer ${
//                         paymentMethod === 'mobile' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
//                       }`}
//                       onClick={() => handlePaymentMethodChange('mobile')}
//                     >
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
//                           checked={paymentMethod === 'mobile'}
//                           onChange={() => {}}
//                         />
//                         <label className="ml-3 block text-sm font-medium text-gray-700">
//                           Mobile Money
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                     onClick={handleProceedToPayment}
//                     disabled={selectedSubjects.length === 0}
//                   >
//                     Proceed to Payment
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="border-t border-gray-200">
//               <div className="px-4 py-5 sm:p-6">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4">Confirm Payment</h4>
                
//                 <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                   <h5 className="font-medium text-gray-700 mb-2">Selected Subjects</h5>
//                   <ul className="space-y-1 mb-4">
//                     {selectedSubjects.map(subjectId => {
//                       const subject = availableSubjects.find(s => s.id === subjectId);
//                       return (
//                         <li key={subjectId} className="text-sm text-gray-600">
//                           • {subject.name} ({subject.code})
//                         </li>
//                       );
//                     })}
//                   </ul>
                  
//                   <div className="flex justify-between border-t pt-2">
//                     <span className="font-medium">Total Amount:</span>
//                     <span className="font-bold">{formatCurrency(totalAmount)}</span>
//                   </div>
//                 </div>
                
//                 <div className="mb-6">
//                   <h5 className="font-medium text-gray-700 mb-2">Payment Details</h5>
                  
//                   {paymentMethod === 'mobile' ? (
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Money Number</label>
//                         <input
//                           type="text"
//                           id="phone"
//                           className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                           placeholder="Enter your mobile money number"
//                           value={phoneNumber}
//                           onChange={(e) => setPhoneNumber(e.target.value)}
//                         />
//                         <p className="mt-1 text-xs text-gray-500">We'll send a payment request to this number</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <div>
//                         <label htmlFor="bank" className="block text-sm font-medium text-gray-700">Bank Name</label>
//                         <input
//                           type="text"
//                           id="bank"
//                           className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                           placeholder="Enter your bank name"
//                           value={bankName}
//                           onChange={(e) => setBankName(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="account" className="block text-sm font-medium text-gray-700">Account Number</label>
//                         <input
//                           type="text"
//                           id="account"
//                           className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                           placeholder="Enter your account number"
//                           value={accountNumber}
//                           onChange={(e) => setAccountNumber(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex justify-between">
//                   <button
//                     type="button"
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                     onClick={() => setShowConfirmation(false)}
//                     disabled={isProcessing}
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="button"
//                     className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
//                       isProcessing ? 'opacity-75 cursor-not-allowed' : ''
//                     }`}
//                     onClick={handleConfirmPayment}
//                     disabled={isProcessing}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </>
//                     ) : (
//                       'Complete Payment'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="border-t border-gray-200">
//           <div className="px-4 py-5 sm:p-6 text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//               <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="mt-3 text-lg font-medium text-gray-900">Payment Successful!</h3>
//             <p className="mt-2 text-sm text-gray-500">
//               Your subscription to {selectedSubjects.length} {selectedSubjects.length === 1 ? 'subject' : 'subjects'} has been confirmed.
//               You can now access all your subscribed courses.
//             </p>
//             <div className="mt-6">
//               <Link
//                 to="/studentdashboard"
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//               >
//                 Go to Dashboard
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubjectSubscription;
