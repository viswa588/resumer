import React from 'react';
import JobDetails from './JobDetails';

const JobModal = ({ job, onClose, onApply, isApplied }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-xl text-blue-600 mt-1">{job.company}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Job details */}
        <JobDetails job={job} />

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            className="w-full sm:w-auto bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            onClick={() => onApply(job)}
            className={`w-full sm:w-auto ${
              isApplied 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-6 rounded-md transition-colors`}
            disabled={isApplied}
          >
            {isApplied ? 'Applied' : 'Apply Now'}
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
        </div>
      </div>
    </div>
  );
};

export default JobModal;