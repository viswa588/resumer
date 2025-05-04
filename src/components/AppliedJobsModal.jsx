import React, { useState } from 'react';
import JobDetails from './JobDetails';
import JobOfferActions from './JobOfferActions';

const AppliedJobsModal = ({ appliedJobs, jobs, onClose, onAcceptOffer, onRejectOffer }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  
  if (appliedJobs.size === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Applied Jobs</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600">You haven't applied to any jobs yet.</p>
          <div className="mt-6">
            <button 
              className="w-full bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter jobs to only include those that have been applied to
  const appliedJobsList = jobs.filter(job => appliedJobs.has(job.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Applied Jobs</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {selectedJob ? (
          <div>
            <button 
              onClick={() => setSelectedJob(null)}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Applied Jobs
            </button>
            
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h3>
              <p className="text-xl text-blue-600 mt-1">{selectedJob.company}</p>
            </div>
            
            <JobDetails job={selectedJob} />
            
            <div className="mt-6">
              <JobOfferActions 
                job={selectedJob} 
                onAcceptOffer={() => onAcceptOffer(selectedJob)} 
                onRejectOffer={() => onRejectOffer(selectedJob)} 
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">Select a job to view details and respond to offers:</p>
            
            <div className="space-y-4">
              {appliedJobsList.map(job => (
                <div 
                  key={job.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-blue-600">{job.company}</p>
                  <p className="text-gray-500 text-sm mt-1">{job.location}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button 
                className="w-full bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsModal;