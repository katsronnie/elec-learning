import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { doc, query, where, getDocs, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { db } from '../firebase/config';

const CreateSubmissionLink = ({ isOpen, onClose, teacherId, teacherName }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [openingDate, setOpeningDate] = useState(new Date());
  const [openingTime, setOpeningTime] = useState('');
  const [closingDate, setClosingDate] = useState(new Date());
  const [closingTime, setClosingTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherSubjects, setTeacherSubjects] = useState([]);

  // Fetch teacher's subjects when component mounts
  React.useEffect(() => {
    const fetchTeacherSubjects = async () => {
      if (!teacherId) return;
      
      try {
        const q = query(
          collection(db, "subjects"),
          where("teacherId", "==", teacherId)
        );
        
        const querySnapshot = await getDocs(q);
        const subjects = [];
        
        querySnapshot.forEach((doc) => {
          subjects.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setTeacherSubjects(subjects);
      } catch (error) {
        console.error("Error fetching teacher subjects:", error);
      }
    };
    
    fetchTeacherSubjects();
  }, [teacherId]);

  const handleCreateSubmissionLink = async () => {
    if (!title || !selectedSubject || !openingTime || !closingTime) {
      alert('Please fill in all required fields');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // Find the selected subject details
      const subjectDetails = teacherSubjects.find(subject => subject.id === selectedSubject);
  
      // Create opening datetime
      const openDateTime = new Date(openingDate);
      const [openHours, openMinutes] = openingTime.split(':');
      openDateTime.setHours(parseInt(openHours, 10), parseInt(openMinutes, 10));
  
      // Create closing datetime
      const closeDateTime = new Date(closingDate);
      const [closeHours, closeMinutes] = closingTime.split(':');
      closeDateTime.setHours(parseInt(closeHours, 10), parseInt(closeMinutes, 10));
  
      // Validate dates
      if (closeDateTime <= openDateTime) {
        alert('Closing time must be after opening time');
        setIsSubmitting(false);
        return;
      }
  
      // Prepare the submission link data
      const submissionLinkData = {
        title,
        description,
        subjectId: selectedSubject,
        subjectName: subjectDetails?.name || '',
        teacherId,
        teacherName,
        openingTime: openDateTime,
        closingTime: closeDateTime,
        createdAt: serverTimestamp(),
        status: 'active',
        submissions: []
      };
  
      // Add document to Firestore
      const docRef = await addDoc(collection(db, "submissionLinks"), submissionLinkData);
  
      // Update the same document to include the generated ID as linkId
      await updateDoc(doc(db, "submissionLinks", docRef.id), {
        linkId: docRef.id
      });
  
      console.log("Submission link created with ID: ", docRef.id);
  
      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setSelectedSubject('');
      setOpeningDate(new Date());
      setOpeningTime('');
      setClosingDate(new Date());
      setClosingTime('');
      onClose();
  
      // Show success message
      alert('Submission link created successfully!');
    } catch (error) {
      console.error("Error creating submission link: ", error);
      alert('Failed to create submission link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create Assignment Submission Link
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  {/* Assignment Title */}
                  <div>
                    <label htmlFor="assignment-title" className="block text-sm font-medium text-gray-700">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      id="assignment-title"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Subject Selection */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      required
                    >
                      <option value="">Select a subject</option>
                      {teacherSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Opening Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="opening-date" className="block text-sm font-medium text-gray-700">
                        Opening Date *
                      </label>
                      <DatePicker
                        selected={openingDate}
                        onChange={(date) => setOpeningDate(date)}
                        minDate={new Date()}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="opening-time" className="block text-sm font-medium text-gray-700">
                        Opening Time *
                      </label>
                      <input
                        type="time"
                        id="opening-time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Closing Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="closing-date" className="block text-sm font-medium text-gray-700">
                        Closing Date *
                      </label>
                      <DatePicker
                        selected={closingDate}
                        onChange={(date) => setClosingDate(date)}
                        minDate={openingDate}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="closing-time" className="block text-sm font-medium text-gray-700">
                        Closing Time *
                      </label>
                      <input
                        type="time"
                        id="closing-time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                      isSubmitting
                        ? 'bg-purple-300 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    onClick={handleCreateSubmissionLink}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Submission Link'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateSubmissionLink;
