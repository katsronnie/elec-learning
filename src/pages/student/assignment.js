import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

const AssignmentsPage = () => {
  const [user, setUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissionLinks, setSubmissionLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [subjects, setSubjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = timestamp instanceof Timestamp 
        ? timestamp.toDate() 
        : new Date(timestamp);
      
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Get status based on dates
  const getAssignmentStatus = (startTime, endTime) => {
    const now = new Date();
    const start = startTime instanceof Timestamp ? startTime.toDate() : new Date(startTime);
    const end = endTime instanceof Timestamp ? endTime.toDate() : new Date(endTime);

    if (now < start) {
      return "Upcoming";
    } else if (now >= start && now <= end) {
      return "Active";
    } else {
      return "Expired";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAssignmentsAndSubmissions = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch assignments with ordering
        const assignmentsQuery = query(
          collection(db, "Assignments"),
          orderBy("createdAt", "desc")
        );
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        
        // Fetch submission links with ordering
        const submissionLinksQuery = query(
          collection(db, "submissionLinks"),
          orderBy("createdAt", "desc")
        );
        const submissionLinksSnapshot = await getDocs(submissionLinksQuery);
        
        // Process assignments with status
        const fetchedAssignments = assignmentsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            status: getAssignmentStatus(data.startTime, data.endTime)
          };
        });
        
        // Process submission links
        const fetchedSubmissionLinks = submissionLinksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Extract unique subjects
        const uniqueSubjects = [...new Set(fetchedAssignments.map(a => a.subjectId))];
        const subjectsList = uniqueSubjects.map(id => {
          const assignment = fetchedAssignments.find(a => a.subjectId === id);
          return {
            id,
            name: assignment?.subjectName || "Unknown Subject"
          };
        });
        
        setAssignments(fetchedAssignments);
        setSubmissionLinks(fetchedSubmissionLinks);
        setSubjects(subjectsList);
        setFilteredAssignments(fetchedAssignments);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsAndSubmissions();
  }, [user]);

  // Filter assignments when filters change
  useEffect(() => {
    if (!assignments.length) return;
    
    let filtered = [...assignments];
    
    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(a => a.subjectId === selectedSubject);
    }
    
    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        (a.title && a.title.toLowerCase().includes(query)) || 
        (a.description && a.description.toLowerCase().includes(query)) ||
        (a.subjectName && a.subjectName.toLowerCase().includes(query)) ||
        (a.teacherName && a.teacherName.toLowerCase().includes(query))
      );
    }
    
    setFilteredAssignments(filtered);
  }, [assignments, selectedSubject, selectedStatus, searchQuery]);

  const renderAssignment = (assignment) => {
    const relevantSubmissionLinks = submissionLinks.filter(link => link.subjectId === assignment.subjectId);
    
    return (
      <div key={assignment.id} className="border p-4 mb-4 rounded-lg bg-white shadow hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-sm text-gray-600">Subject: {assignment.subjectName}</span>
              <span className="text-sm text-gray-600">Teacher: {assignment.teacherName}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                {assignment.status}
              </span>
            </div>
          </div>
          
          {assignment.fileURL && (
            <a 
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              href={assignment.fileURL} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View Assignment
            </a>
          )}
        </div>
        
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Start:</span> {formatDate(assignment.startTime)}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Due:</span> {formatDate(assignment.endTime)}
          </div>
        </div>
        
        {assignment.description && (
          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
            {assignment.description}
          </div>
        )}
        
        {relevantSubmissionLinks.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <p className="font-semibold text-sm text-gray-700">Submission Links:</p>
            <div className="mt-2 space-y-2">
              {relevantSubmissionLinks.map(link => (
                <div key={link.id} className="bg-gray-50 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{link.title}</p>
                    {link.submissionUrl && (
                      <a 
                        href={link.submissionUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                      >
                        Open Link
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Due: {formatDate(link.dueDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
          <Link 
            to="/student/dashboard" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Back to Dashboard
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Search by title or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Subject Filter */}
            <div>
              <label htmlFor="subject-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject-filter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="ml-2 text-purple-500">Loading your assignments...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {filteredAssignments.length} {filteredAssignments.length === 1 ? 'assignment' : 'assignments'}
            </div>
            
            {filteredAssignments.length > 0 ? (
              <div>{filteredAssignments.map(renderAssignment)}</div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
