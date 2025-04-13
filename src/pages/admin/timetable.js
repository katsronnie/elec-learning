import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const TimetablePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    schedule: {
      Monday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
      Tuesday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
      Wednesday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
      Thursday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
      Friday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timeSlots] = useState([
    { id: 0, label: '8:00 AM - 9:00 AM' },
    { id: 1, label: '9:00 AM - 10:00 AM' },
    { id: 2, label: '10:00 AM - 11:00 AM' },
    { id: 3, label: '11:00 AM - 12:00 PM' },
    { id: 4, label: '12:00 PM - 1:00 PM' },
    { id: 5, label: '1:00 PM - 2:00 PM' },
    { id: 6, label: '2:00 PM - 3:00 PM' },
    { id: 7, label: '3:00 PM - 4:00 PM' },
  ]);

  // Fetch subjects and teachers from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subjects
        const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
        const subjectsData = [];
        subjectsSnapshot.forEach(doc => {
          subjectsData.push({ id: doc.id, ...doc.data() });
        });
        setSubjects(subjectsData);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Initialize timetable with empty slots
  useEffect(() => {
    const initializedTimetable = { ...timetable };
    
    Object.keys(initializedTimetable.schedule).forEach(day => {
      initializedTimetable.schedule[day] = timeSlots.map(slot => ({
        subject: '',
        subjectName: '',
        teacher: '',
        teacherName: '',
        startTime: slot.label.split(' - ')[0],
        endTime: slot.label.split(' - ')[1],
      }));
    });
    
    setTimetable(initializedTimetable);
  }, [timeSlots, timetable]);

  // Handle timetable name and description changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimetable({
      ...timetable,
      [name]: value
    });
  };

  // Handle schedule changes
  const handleScheduleChange = (day, slotIndex, field, value) => {
    const updatedSchedule = { ...timetable.schedule };
    
    if (field === 'subject') {
      // Find the subject object by ID
      const selectedSubject = subjects.find(subject => subject.id === value);
      
      updatedSchedule[day][slotIndex] = {
        ...updatedSchedule[day][slotIndex],
        subject: value, // Keep the ID for reference
        subjectName: selectedSubject ? selectedSubject.name : '', // Add the name
      };
      
      // If subject is selected, auto-populate teacher if there's only one teacher for that subject
      if (value && selectedSubject && selectedSubject.teacherId) {
        const selectedTeacher = teachers.find(teacher => teacher.id === selectedSubject.teacherId);
        updatedSchedule[day][slotIndex].teacher = selectedSubject.teacherId;
        updatedSchedule[day][slotIndex].teacherName = selectedTeacher ? selectedTeacher.name : '';
      }
    } else if (field === 'teacher') {
      // Find the teacher object by ID
      const selectedTeacher = teachers.find(teacher => teacher.id === value);
      
      updatedSchedule[day][slotIndex] = {
        ...updatedSchedule[day][slotIndex],
        teacher: value, // Keep the ID for reference
        teacherName: selectedTeacher ? selectedTeacher.name : '', // Add the name
      };
    } else {
      // For other fields like startTime, endTime
      updatedSchedule[day][slotIndex] = {
        ...updatedSchedule[day][slotIndex],
        [field]: value
      };
    }

    setTimetable({
      ...timetable,
      schedule: updatedSchedule
    });
  };

  // Save timetable to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!timetable.name || !timetable.startDate || !timetable.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format timetable data for Firestore
      const timetableData = {
        name: timetable.name,
        description: timetable.description,
        startDate: new Date(timetable.startDate),
        endDate: new Date(timetable.endDate),
        schedule: timetable.schedule,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "timetables"), timetableData);
      console.log("Timetable created with ID: ", docRef.id);
      
      // Show success message
      alert('Timetable created successfully!');
      
      // Reset form
      setTimetable({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        schedule: {
          Monday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
          Tuesday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
          Wednesday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
          Thursday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
          Friday: Array(8).fill({ subject: '', teacher: '', startTime: '', endTime: '' }),
        }
      });
    } catch (error) {
      console.error("Error creating timetable:", error);
      alert(`Error creating timetable: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Timetable</h1>
            <Link to="/admin/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Timetable Information</h3>
            <p className="mt-1 text-sm text-gray-500">Create a new timetable for classes from Monday to Friday.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Timetable Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={timetable.name}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={timetable.description}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                    value={timetable.startDate}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    required
                    value={timetable.endDate}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Day tabs */}
              <div className="mt-8">
                <div className="sm:hidden">
                  <label htmlFor="day-select" className="sr-only">Select a day</label>
                  <select
                    id="day-select"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {Object.keys(timetable.schedule).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div className="hidden sm:block">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {Object.keys(timetable.schedule).map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`
                            ${selectedDay === day
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                          `}
                        >
                          {day}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
              
              {/* Schedule for selected day */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">{selectedDay} Schedule</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeSlots.map((slot, index) => (
                        <tr key={slot.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {slot.label}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={timetable.schedule[selectedDay][index].subject}
                              onChange={(e) => handleScheduleChange(selectedDay, index, 'subject', e.target.value)}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="">Select a subject</option>
                                {subjects.map(subject => (
                                  <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <select
                                value={timetable.schedule[selectedDay][index].teacher}
                                onChange={(e) => handleScheduleChange(selectedDay, index, 'teacher', e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="">Select a teacher</option>
                                {teachers.map(teacher => (
                                  <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    // Copy Monday's schedule to all days
                    if (window.confirm("Do you want to apply Monday's schedule to all weekdays?")) {
                      const updatedSchedule = { ...timetable.schedule };
                      ['Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
                        updatedSchedule[day] = [...updatedSchedule['Monday']];
                      });
                      setTimetable({
                        ...timetable,
                        schedule: updatedSchedule
                      });
                    }
                  }}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
                >
                  Copy Monday to All Days
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? 'Saving...' : 'Save Timetable'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Timetable Preview */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Timetable Preview</h3>
              <p className="mt-1 text-sm text-gray-500">Preview how your timetable will look.</p>
            </div>
            
            <div className="px-4 py-5 sm:p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    {Object.keys(timetable.schedule).map(day => (
                      <th key={day} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots.map((timeSlot, timeSlotIndex) => (
                    <tr key={timeSlot.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {timeSlot.label}
                      </td>
                      {Object.keys(timetable.schedule).map(day => {
                        const cellData = timetable.schedule[day][timeSlotIndex];
                        
                        return (
                          <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cellData && cellData.subject ? (
                              <div>
                                <div className="font-medium text-gray-900">{cellData.subjectName || 'Unknown Subject'}</div>
                                <div className="text-gray-500">{cellData.teacherName || 'Unknown Teacher'}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">No class</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Print and Export Options */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Print Timetable
            </button>
            <button
              type="button"
              onClick={() => {
                // Export as JSON
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timetable));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", timetable.name + ".json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export as JSON
            </button>
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
  
  export default TimetablePage;
  