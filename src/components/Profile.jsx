import React, { useState, useEffect } from 'react';
import { FaHome, FaBell, FaEnvelope, FaCamera, FaSearch, FaHistory, FaRobot, FaCertificate, FaVideo, FaFileAlt, FaSignOutAlt, FaFileUpload, FaFilePdf, FaFileInvoiceDollar, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HistoryModal from './HistoryModal';
import JobCard from './JobCard';
import JobModal from './JobModal';
import VideoRecordModal from './VideoRecordModal';
import PaychecksModal from './PaychecksModal';
import NotificationDropdown from './NotificationDropdown';
import NotificationBadge from './NotificationBadge';
import PaycheckBadge from './PaycheckBadge';
import { useNotification } from '../context/NotificationContext';
import { initializeSamplePaychecks } from '../services/paycheckService';
import { hasApprovedApplications, getApprovedJobIds } from '../services/applicationService';
import { hasApprovedTimesheets, getApprovedTimesheetsByUser } from '../services/timesheetService';
import { getUserProfile, saveUserProfile, initializeUserData } from '../services/userService';
import { saveResume, getResume, deleteResume } from '../services/resumeService';
import logo from '../assets/icon.png';
import { jobs } from '../data/jobs';
import { calculateHours } from '../lib/hourUtils';

const Profile = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [about, setAbout] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPaychecksModalOpen, setIsPaychecksModalOpen] = useState(false);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [paychecks, setPaychecks] = useState([]);
  const [newPaychecksCount, setNewPaychecksCount] = useState(0);
  const [hasApprovedJobs, setHasApprovedJobs] = useState(false);
  const [hasTimesheets, setHasTimesheets] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    fullName: 'User',
    about: ''
  });
  
  // Get notification context
  const { 
    getUnreadAlertCount, 
    getUnreadEmailCount, 
    addJobApplicationNotification,
    addJobOfferNotification,
    addTimesheetNotification
  } = useNotification();

  useEffect(() => {
    // Initialize user data for demo accounts
    initializeUserData();
    
    // Get user profile data
    const profile = getUserProfile();
    setUserProfile(profile);
    setAbout(profile.about || '');
    
    // Get current user email
    const userEmail = profile.email || localStorage.getItem('userEmail') || '';
    
    // Check if user has any approved job applications
    const hasApproved = hasApprovedApplications(userEmail);
    setHasApprovedJobs(hasApproved);
    
    if (hasApproved) {
      // Get approved job IDs
      const approvedJobIds = getApprovedJobIds(userEmail);
      
      // Load accepted jobs based on approved applications
      const acceptedJobsData = jobs.filter(job => approvedJobIds.includes(job.id));
      setAcceptedJobs(acceptedJobsData);
      
      // Check if user has any approved timesheets
      const hasApprovedTS = hasApprovedTimesheets(userEmail);
      setHasTimesheets(hasApprovedTS);
      
      if (hasApprovedTS) {
        // Load approved timesheets
        const approvedTimesheets = getApprovedTimesheetsByUser(userEmail);
        setTimesheets(approvedTimesheets);
      } else {
        // No approved timesheets, clear timesheets
        setTimesheets([]);
      }
    } else {
      // No approved jobs, clear accepted jobs and timesheets
      setAcceptedJobs([]);
      setTimesheets([]);
    }
    
    // Always load paychecks directly from localStorage
    const savedPaychecks = JSON.parse(localStorage.getItem('userPaychecks') || '[]');
    // Filter paychecks for this user
    const userPaychecks = savedPaychecks.filter(p => !p.userId || p.userId === userEmail);
    
    if (userPaychecks.length > 0) {
      setPaychecks(userPaychecks);
      
      // Set new paychecks count
      const viewedPaychecks = JSON.parse(localStorage.getItem('viewedPaychecks') || '[]');
      const newPaychecks = userPaychecks.filter(p => !viewedPaychecks.includes(p.id));
      setNewPaychecksCount(newPaychecks.length);
    } else {
      setPaychecks([]);
      setNewPaychecksCount(0);
    }
    
    // Load applied jobs from localStorage
    const appliedJobIds = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const appliedJobsData = jobs.filter(job => appliedJobIds.includes(job.id));
    setAppliedJobs(appliedJobsData);
    
    // Load resume from localStorage if it exists
    const savedResume = localStorage.getItem('userResume');
    const savedResumeFileName = localStorage.getItem('userResumeFileName');
    if (savedResume) {
      setResume(savedResume);
      setResumeFileName(savedResumeFileName || 'resume.pdf');
    }
  }, []);

  const handleVideoModalOpen = () => {
    setIsVideoModalOpen(true);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
  };
  
  const handlePaychecksModalOpen = () => {
    // Get current user email
    const userEmail = userProfile.email || localStorage.getItem('userEmail') || '';
    
    // Load paychecks directly from localStorage
    const savedPaychecks = JSON.parse(localStorage.getItem('userPaychecks') || '[]');
    
    // Filter paychecks for this user if needed
    const userPaychecks = savedPaychecks.filter(p => !p.userId || p.userId === userEmail);
    
    // Update state with the latest paychecks
    setPaychecks(userPaychecks);
    
    if (!hasApprovedJobs) {
      // Show message that no paychecks are available until job is approved
      alert('No paychecks available. Your job application needs to be approved by an employer first.');
      return;
    }
    
    if (userPaychecks.length === 0) {
      alert('No paychecks available yet. Your employer needs to process your approved timesheets.');
      return;
    }
    
    setIsPaychecksModalOpen(true);
    // Mark all paychecks as viewed
    const payCheckIds = userPaychecks.map(p => p.id);
    localStorage.setItem('viewedPaychecks', JSON.stringify(payCheckIds));
    setNewPaychecksCount(0);
  };

  const handlePaychecksModalClose = () => {
    setIsPaychecksModalOpen(false);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userAbout');
    localStorage.removeItem('appliedJobs');
    localStorage.removeItem('userResume');
    localStorage.removeItem('userResumeFileName');
    
    // Redirect to login page
    navigate('/login');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is a PDF
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const resumeData = reader.result;
        setResume(resumeData);
        setResumeFileName(file.name);
        
        // Get current user email
        const userEmail = userProfile.email || localStorage.getItem('userEmail') || '';
        
        // Save resume using resumeService
        saveResume(userEmail, resumeData, file.name);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleResumeDelete = () => {
    // Get current user email
    const userEmail = userProfile.email || localStorage.getItem('userEmail') || '';
    
    // Delete resume using resumeService
    deleteResume(userEmail);
    
    // Update UI
    setResume(null);
    setResumeFileName('');
  };

  const handleResumeView = () => {
    if (resume) {
      const newWindow = window.open();
      newWindow.document.write(`
        <iframe src="${resume}" width="100%" height="100%" style="border: none;"></iframe>
      `);
    }
  };

  const handleAboutUpdate = () => {
    // Save about text to user profile
    const updatedProfile = { ...userProfile, about };
    saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleJobSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleJobApply = (job) => {
    if (!appliedJobs.find(j => j.id === job.id)) {
      const updatedAppliedJobs = [...appliedJobs, job];
      setAppliedJobs(updatedAppliedJobs);
      
      // Save to localStorage
      const appliedJobIds = updatedAppliedJobs.map(j => j.id);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobIds));
      
      // Add notification with jobId
      addJobApplicationNotification(job.title, job.company, job.id);
      
      // Submit job application
      const userEmail = userProfile.email || localStorage.getItem('userEmail') || '';
      import('../services/applicationService').then(({ submitJobApplication }) => {
        submitJobApplication({
          jobId: job.id,
          userEmail: userEmail,
          jobTitle: job.title,
          companyName: job.company
        });
      });
      
      // Show message to user
      alert('Your job application has been submitted. You will be able to submit timesheets once your application is approved by the employer.');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display name for user
  const displayName = userProfile.firstName && userProfile.lastName 
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : userProfile.email?.split('@')[0] || "User";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md p-3 md:p-4 mb-4 md:mb-3 border-b-2 border-gray-200">
        <div className="container mx-auto flex justify-between items-center px-2">
          <img src={logo} alt="Profile Logo" className="h-15 w-12" />
          <div className="flex space-x-3 md:space-x-4">
            <FaHome className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-blue-500" />
            
            {/* Alert Bell with Badge */}
            <div className="relative">
              <FaBell 
                className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-blue-500" 
                onClick={() => {
                  setShowAlertDropdown(!showAlertDropdown);
                  setShowEmailDropdown(false);
                }}
              />
              <NotificationBadge count={getUnreadAlertCount()} />
              {showAlertDropdown && (
                <NotificationDropdown 
                  type="alerts" 
                  onClose={() => setShowAlertDropdown(false)} 
                />
              )}
            </div>
            
            {/* Email with Badge */}
            <div className="relative">
              <FaEnvelope 
                className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-blue-500" 
                onClick={() => {
                  setShowEmailDropdown(!showEmailDropdown);
                  setShowAlertDropdown(false);
                }}
              />
              <NotificationBadge count={getUnreadEmailCount()} />
              {showEmailDropdown && (
                <NotificationDropdown 
                  type="emails" 
                  onClose={() => setShowEmailDropdown(false)} 
                />
              )}
            </div>
            
            <FaSignOutAlt 
              className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-red-500" 
              onClick={handleLogout}
              title="Logout"
            />
          </div>
        </div>
      </div>
      <VideoRecordModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
      <PaychecksModal isOpen={isPaychecksModalOpen} onClose={handlePaychecksModalClose} paychecks={paychecks} />
      
      {/* Profile Content */}
      <div className="container mx-auto px-4 space-y-4">
        <div className="flex flex-col md:flex-row-reverse gap-6">
         
          {/* Virtual Interview and Certification Icons */}
          <div className="w-full md:w-1/12 bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-row gap-1">
              <div className="items-center p-3 bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <FaRobot className="text-4xl text-blue-500 mb-3" title='Virtual Interview by AI - Practice with our AI interviewer' />
                <FaCertificate className="text-4xl text-green-500 mb-3" title='Certification Test - Take the test to get certified' />
                <div className="relative">
                  <FaVideo 
                    className="text-4xl text-blue-500 cursor-pointer hover:text-blue-600"
                    onClick={handleVideoModalOpen}
                    title="Record Video/Audio" 
                  />
                </div>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => navigate('/timesheet/list')}
                >
                  <FaClipboardList 
                    className="text-4xl text-purple-500 my-3 hover:text-purple-600"
                    title="View All Timesheets" 
                  />
                </div>
                <div className="relative">
                  <FaFileInvoiceDollar 
                    className="text-4xl text-green-500 mt-3 cursor-pointer hover:text-green-600"
                    onClick={handlePaychecksModalOpen}
                    title="View Paychecks" 
                  />
                  <PaycheckBadge count={newPaychecksCount} />
                </div>
              </div>
            </div>
          </div>

           {/* About Section */}
           <div className="w-full md:w-8/12 bg-white rounded-lg shadow-md p-6" 
             >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">About</h3>
              <button
                onClick={() => isEditing ? handleAboutUpdate() : setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700">
                {userProfile.about || about || "No information provided yet."}
              </p>
            )}
            
            {/* Accepted Jobs Section - Only show if user has approved applications */}
            {hasApprovedJobs && acceptedJobs.length > 0 && (
              <div className="mt-6 border-t pt-4" >
                <h3 className="text-lg font-semibold mb-3">Your Current Position</h3>
                <div style={{maxHeight: '250px', overflowY: 'auto'}}>
                {acceptedJobs.map(job => (
                  <div key={job.id} className="bg-blue-50 rounded-lg p-4 mb-3" >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-gray-500 text-sm">{job.location}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => navigate(`/roles-and-responsibilities/${job.id}`)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FaFileAlt className="mr-1" />
                          View Roles & Responsibilities
                        </button>
                        <button
                          onClick={() => navigate(`/timesheet/new/${job.id}`)}
                          className="flex items-center text-green-600 hover:text-green-800"
                        >
                          <FaFileAlt className="mr-1" />
                          Enter Timesheet
                        </button>
                        <button
                          onClick={() => navigate('/timesheet/list')}
                          className="flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <FaClipboardList className="mr-1" />
                          View Timesheets
                        </button>
                      </div>
                    </div>
                    
                    {/* Recent Timesheets - Only show if user has approved timesheets */}
                    {hasTimesheets && timesheets.filter(ts => ts.jobId === job.id).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Timesheets</h5>
                        <div className="space-y-2">
                          {timesheets
                            .filter(ts => ts.jobId === job.id)
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 3)
                            .map(timesheet => (
                              <div key={timesheet.id} className="bg-white p-2 rounded-md text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    {timesheet.date || new Date().toLocaleDateString()}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    {timesheet.status === 'approved' ? (
                                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        Approved
                                      </span>
                                    ) : timesheet.status === 'rejected' ? (
                                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                        Rejected
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                        Pending
                                      </span>
                                    )}
                                    <span className="text-blue-600 cursor-pointer" onClick={() => navigate(`/timesheet/view/${timesheet.id}`)}>
                                      View
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <span className="text-gray-500">
                                    {timesheet?.entries?.reduce((total, entry) => {
                                      if (!entry || !entry.hours) return total;
                                      return total + calculateHours(entry.hours);
                                    }, 0).toFixed(1)} hours total
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                        {timesheets.filter(ts => ts.jobId === job.id).length > 3 && (
                          <div className="mt-2 text-center">
                            <button 
                              onClick={() => navigate('/timesheet/list')}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View all timesheets
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Message for pending timesheets */}
                    {hasApprovedJobs && !hasTimesheets && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-700 text-sm">
                            No approved timesheets yet. Please submit a timesheet and wait for employer approval.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                </div>
              </div>
            )}
            
            {/* Message for pending applications */}
            {appliedJobs.length > 0 && !hasApprovedJobs && (
              <div className="mt-6 border-t pt-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800">Application Pending</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Your job application is pending approval from the employer. 
                    Once approved, you'll be able to submit timesheets and view paychecks.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile Picture Section */}
          <div className="w-full md:w-3/12 bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200">
                  {image ? (
                    <img src={image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaCamera className="text-3xl text-gray-400" />
                    </div>
                  )}
                </div>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
                  <FaCamera className="text-white" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              {/* User Info Section */}
              <div className="text-center mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{displayName}</h2>
                <p className="text-sm md:text-base text-gray-600">{userProfile.email || "user@example.com"}</p>
              </div>
              
              {/* Resume Upload Section */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-md font-semibold mb-3">Resume</h3>
                {resume ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center bg-gray-100 p-3 rounded-lg w-full mb-2">
                      <FaFilePdf className="text-red-500 text-xl mr-2" />
                      <span className="text-sm text-gray-700 truncate max-w-[150px]">{resumeFileName}</span>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button 
                        onClick={handleResumeView}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm flex items-center"
                      >
                        <FaFileAlt className="mr-1" /> View
                      </button>
                      <button 
                        onClick={handleResumeDelete}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <label htmlFor="resume-upload" className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg flex flex-col items-center w-full">
                      <FaFileUpload className="text-3xl mb-2" />
                      <span className="text-sm font-medium">Upload Resume (PDF)</span>
                      <input
                        type="file"
                        id="resume-upload"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleResumeUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Search Jobs Section */}
        <div className="mt-4 md:mt-8">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h2 className="text-xl md:text-2xl font-bold">Search Jobs</h2>
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FaHistory className="mr-2" />
                View Applied Jobs
              </button>
            </div>
            <div className="relative mb-4 md:mb-6">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={handleJobSearch}
                className="w-full p-2 md:p-3 pl-9 md:pl-10 text-sm md:text-base border rounded-lg"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={setSelectedJob}
                  onApply={handleJobApply}
                  isApplied={appliedJobs.some(j => j.id === job.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* History Modal */}
        <HistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          appliedJobs={appliedJobs}
        />
      </div>
    
  );
};

export default Profile;