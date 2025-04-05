import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TeacherWallet = () => {
  const [walletBalance, setWalletBalance] = useState(1250.75);
  const [pendingPayments, setPendingPayments] = useState(350.00);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      type: 'deposit', 
      amount: 750.00, 
      description: 'Monthly Salary', 
      date: '2023-10-01', 
      status: 'completed' 
    },
    { 
      id: 2, 
      type: 'deposit', 
      amount: 125.00, 
      description: 'Extra Class Allowance', 
      date: '2023-09-28', 
      status: 'completed' 
    },
    { 
      id: 3, 
      type: 'withdrawal', 
      amount: 50.00, 
      description: 'Teaching Materials Purchase', 
      date: '2023-09-25', 
      status: 'completed' 
    },
    { 
      id: 4, 
      type: 'deposit', 
      amount: 350.00, 
      description: 'Special Project Bonus', 
      date: '2023-09-20', 
      status: 'pending' 
    },
    { 
      id: 5, 
      type: 'withdrawal', 
      amount: 75.00, 
      description: 'Conference Registration Fee', 
      date: '2023-09-15', 
      status: 'completed' 
    }
  ]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > walletBalance) {
      alert('Insufficient funds');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTransaction = {
        id: transactions.length + 1,
        type: 'withdrawal',
        amount: parseFloat(withdrawAmount),
        description: `Withdrawal to ${withdrawMethod === 'bank' ? 'Bank Account' : 'Mobile Money'}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      
      setTransactions([newTransaction, ...transactions]);
      setWalletBalance(prevBalance => prevBalance - parseFloat(withdrawAmount));
      setWithdrawAmount('');
      setShowWithdrawModal(false);
      setIsLoading(false);
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-purple-50">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Teacher Wallet</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your earnings and payments</p>
      </div>
      
      {/* Wallet Balance Card */}
      <div className="border-t border-gray-200">
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
              <h4 className="text-sm font-medium opacity-80">Available Balance</h4>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-extrabold">{formatCurrency(walletBalance)}</span>
              </div>
              <div className="mt-4 flex space-x-3">
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-3 rounded-md text-sm font-medium"
                >
                  Withdraw
                </button>
                <Link 
                  to="/teacher/wallet/history" 
                  className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-3 rounded-md text-sm font-medium text-center"
                >
                  History
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
              <h4 className="text-sm font-medium text-gray-500">Pending Payments</h4>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(pendingPayments)}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Expected within 3-5 business days</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
              <h4 className="text-sm font-medium text-gray-500">Payment Schedule</h4>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Next Salary</span>
                  <span className="text-sm font-medium text-gray-900">Nov 1, 2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Next Bonus</span>
                  <span className="text-sm font-medium text-gray-900">Dec 15, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {transactions.slice(0, 5).map(transaction => (
              <li key={transaction.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    {transaction.status === 'pending' && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Link 
              to="/teacher/wallet/transactions" 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              View All Transactions
            </Link>
          </div>
        </div>
      </div>
      
      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Withdraw Funds</h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="text"
                            name="amount"
                            id="amount"
                            className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Available balance: {formatCurrency(walletBalance)}</p>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="withdraw-method" className="block text-sm font-medium text-gray-700">Withdraw Method</label>
                        <select
                          id="withdraw-method"
                          name="withdraw-method"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                          value={withdrawMethod}
                          onChange={(e) => setWithdrawMethod(e.target.value)}
                        >
                          <option value="bank">Bank Transfer</option>
                          <option value="mobile">Mobile Money</option>
                          <option value="paypal">PayPal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  onClick={handleWithdraw}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Withdraw'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherWallet;
