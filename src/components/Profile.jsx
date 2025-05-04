import React, { useState, useEffect } from 'react';
import { FaHome, FaBell, FaEnvelope, FaCamera, FaSearch, FaHistory, FaRobot, FaCertificate, FaVideo, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HistoryModal from './HistoryModal';
import JobCard from './JobCard';
import JobModal from './JobModal';
import VideoRecordModal from './VideoRecordModal';
import logo from '../assets/icon.png';
import { jobs } from '../data/jobs';


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
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    // Load accepted jobs from localStorage
    const jobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
    const acceptedJobIds = Object.keys(jobOfferStatuses)
      .filter(id => jobOfferStatuses[id] === 'accepted')
      .map(id => parseInt(id));
    
    const acceptedJobsData = jobs.filter(job => acceptedJobIds.includes(job.id));
    setAcceptedJobs(acceptedJobsData);
    
    // Load applied jobs from localStorage
    const appliedJobIds = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const appliedJobsData = jobs.filter(job => appliedJobIds.includes(job.id));
    setAppliedJobs(appliedJobsData);

    // Load timesheets from localStorage
    const timesheetsData = JSON.parse(localStorage.getItem('timesheets') || '[]');
    setTimesheets(timesheetsData);
  }, []);

  const handleVideoModalOpen = () => {
    setIsVideoModalOpen(true);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
  };

  

  // Dummy jobs data
  // const [jobs] = useState([
  //   {
  //     id: 1,
  //     title: "Senior Software Engineer",
  //     company: "Tech Corp",
  //     location: "San Francisco, CA",
  //     description: "We are looking for a Senior Software Engineer to join our team...",
  //     requirements: [
  //       "5+ years of experience in software development",
  //       "Strong proficiency in React and Node.js",
  //       "Experience with cloud platforms (AWS/Azure)",
  //       "Excellent problem-solving skills"
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: "Frontend Developer",
  //     company: "Web Solutions Inc",
  //     location: "Remote",
  //     description: "Join our dynamic team as a Frontend Developer...",
  //     requirements: [
  //       "3+ years of frontend development experience",
  //       "Expertise in React, HTML, CSS",
  //       "Experience with modern frontend tools",
  //       "Good communication skills"
  //     ]
  //   },
  //   {
  //     id: 3,
  //     title: "Full Stack Developer",
  //     company: "Innovation Labs",
  //     location: "New York, NY",
  //     description: "Looking for a Full Stack Developer to build scalable applications...",
  //     requirements: [
  //       "4+ years of full stack development",
  //       "Experience with React and Node.js",
  //       "Database design and optimization",
  //       "Agile development experience"
  //     ]
  //   }
  // ]);
  
  // Mock user data - replace with actual user data from your auth system
  const user = {
    username: "John Doe",
    email: "john.doe@example.com"
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

  const handleAboutUpdate = () => {
    // Add API call to update about section
    setIsEditing(false);
  };

  const handleJobSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleJobApply = (job) => {
    if (!appliedJobs.find(j => j.id === job.id)) {
      setAppliedJobs([...appliedJobs, job]);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md p-3 md:p-4 mb-4 md:mb-3 border-b-2 border-gray-200">
        <div className="container mx-auto flex justify-between items-center px-2">
          <img src={logo} alt="Profile Logo" className="h-15 w-12" />
          <div className="flex space-x-3 md:space-x-4">
            <FaHome className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-blue-500" />
            <FaBell className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-blue-500" />
            <FaEnvelope className="text-xl md:text-2xl text-gray-600 cursor-pointer hover:text-blue-500" />
          </div>
        </div>
      </div>
      <VideoRecordModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
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
                
              </div>
            </div>
          </div>

           {/* About Section */}
           <div className="w-full md:w-8/12 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">About</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
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
                {about || "No information provided yet."}
              </p>
            )}
            
            {/* Accepted Jobs Section */}
            {acceptedJobs.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Your Current Position</h3>
                {acceptedJobs.map(job => (
                  <div key={job.id} className="bg-blue-50 rounded-lg p-4 mb-3">
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
                      </div>
                    </div>
                    
                    {/* Recent Timesheets */}
                    {timesheets.filter(ts => ts.jobId === job.id).length > 0 && (
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
                                    {new Date(timesheet.date).toLocaleDateString()}
                                  </span>
                                  <span className="text-blue-600 cursor-pointer" onClick={() => navigate(`/timesheet/view/${timesheet.id}`)}>
                                    View Details
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className="text-gray-500">
                                    {timesheet.entries.reduce((total, entry) => {
                                      const entryTotal = entry.hours.reduce((sum, h) => sum + (parseFloat(h) || 0), 0);
                                      return total + entryTotal;
                                    }, 0)} hours total
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
                  </div>
                ))}
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
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-sm md:text-base text-gray-600">{user.email}</p>
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

        {/* Job Search Section */}
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          
          {/* <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleJobSearch}
              className="w-full bg-transparent focus:outline-none"
            />
          </div> */}
          
          {/* <div className="mt-6 space-y-4">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={setSelectedJob}
                onApply={handleJobApply}
                isApplied={appliedJobs.some(j => j.id === job.id)}
              />
            ))}
          </div> */}
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