import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from './JobDetails';
import JobOfferActions from './JobOfferActions';
import { jobs } from '../data/jobs';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [offerStatus, setOfferStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const jobId = parseInt(id);
    const foundJob = jobs.find(j => j.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
      
      // Check if the user has already applied
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      const isJobApplied = appliedJobs.includes(jobId);
      setIsApplied(isJobApplied);
      
      // Check if there's an offer status for this job
      const jobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
      if (jobOfferStatuses[jobId]) {
        setOfferStatus(jobOfferStatuses[jobId]);
      }
    }
    
    setLoading(false);
  }, [id]);

  const handleApply = () => {
    if (!job) return;
    
    // In a real app, this would be an API call
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    if (!appliedJobs.includes(job.id)) {
      appliedJobs.push(job.id);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      setIsApplied(true);
    }
  };

  const handleAcceptOffer = () => {
    if (!job) return;
    
    // Update job offer status
    const jobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
    jobOfferStatuses[job.id] = 'accepted';
    localStorage.setItem('jobOfferStatuses', JSON.stringify(jobOfferStatuses));
    
    // Navigate to welcome page
    navigate(`/welcome-job/${job.id}`);
  };

  const handleRejectOffer = () => {
    if (!job) return;
    
    // Update job offer status
    const jobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
    jobOfferStatuses[job.id] = 'rejected';
    localStorage.setItem('jobOfferStatuses', JSON.stringify(jobOfferStatuses));
    
    setOfferStatus('rejected');
  };

  const handleGoBack = () => {
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
            onClick={handleGoBack}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // Determine what action buttons to show based on application and offer status
  const renderActionButtons = () => {
    if (offerStatus === 'accepted') {
      return (
        <div className="mt-8">
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700">
              You've accepted this job offer! Visit your <button onClick={() => navigate(`/welcome-job/${job.id}`)} className="text-green-800 underline">welcome page</button> for next steps.
            </p>
          </div>
          <button 
            onClick={() => navigate(`/welcome-job/${job.id}`)}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
          >
            View Welcome Page
          </button>
        </div>
      );
    } else if (offerStatus === 'rejected') {
      return (
        <div className="mt-8">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">You've rejected this job offer.</p>
          </div>
        </div>
      );
    } else if (isApplied) {
      return (
        <div className="mt-8">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">You've applied for this position. If selected, you'll have the option to accept or reject the offer.</p>
          </div>
          <JobOfferActions 
            job={job}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
          />
        </div>
      );
    } else {
      return (
        <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleApply}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
          >
            Apply Now
          </button>
          <button 
            className="w-full sm:w-auto border border-blue-600 text-blue-600 py-2 px-6 rounded-md hover:bg-blue-50 transition-colors"
            onClick={() => {
              // This would typically save the job to the user's saved jobs
              alert('Job saved to your favorites!');
            }}
          >
            Save Job
          </button>
          <button 
            className="w-full sm:w-auto bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
            onClick={() => {
              // This would typically share the job
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              alert('Job URL copied to clipboard!');
            }}
          >
            Share Job
          </button>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <button 
              onClick={handleGoBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Jobs
            </button>
          </div>
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-xl text-blue-600 mt-1">{job.company}</p>
          </div>
          
          {/* Job details */}
          <JobDetails job={job} />
          
          {/* Action buttons */}
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;