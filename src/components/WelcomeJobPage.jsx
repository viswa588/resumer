import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs } from '../data/jobs';

const WelcomeJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const jobId = parseInt(id);
    const foundJob = jobs.find(j => j.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
    }
    
    setLoading(false);
  }, [id]);

  const handleGoToJobs = () => {
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-lg font-semibold">Job Not Found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={handleGoToJobs}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          {/* Confetti or celebration graphic could be added here */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Congratulations!</h1>
            <p className="text-xl text-gray-600 mt-2">You've accepted the job offer!</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to {job.company}</h2>
            <p className="text-gray-700 mb-4">
              We're excited to have you join our team as a <span className="font-semibold">{job.title}</span>. 
              We look forward to your contributions and are confident that you'll be a valuable addition to our team.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Complete your onboarding paperwork</li>
                <li>Schedule your orientation session</li>
                <li>Set up your work equipment</li>
                <li>Meet your team members</li>
                <li>
                  <button 
                    onClick={() => navigate(`/roles-and-responsibilities/${job.id}`)}
                    className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Review your roles and responsibilities
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Position</p>
                  <p className="text-gray-900">{job.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="text-gray-900">{job.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{job.location}</p>
                </div>
                {job.salary && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Salary</p>
                    <p className="text-gray-900">{job.salary}</p>
                  </div>
                )}
                {job.jobType && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Type</p>
                    <p className="text-gray-900">{job.jobType}</p>
                  </div>
                )}
                {job.contactEmail && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <p className="text-gray-900">{job.contactEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleGoToJobs}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors mr-4"
            >
              Back to Jobs
            </button>
            <button 
              onClick={() => navigate(`/roles-and-responsibilities/${job.id}`)}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
            >
              View Roles & Responsibilities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeJobPage;