import React from 'react';
import JobDetails from './JobDetails';

const JobModal = ({ job, onClose, onApply, isApplied, isStudentFriendly }) => {
  if (!job) return null;

  // Calculate if job is student-friendly if not explicitly provided
  const studentFriendly = isStudentFriendly !== undefined ? isStudentFriendly : (
    job.jobType === 'Part-time' || 
    job.experienceLevel === 'Entry' || 
    (job.hoursPerWeek && job.hoursPerWeek <= 20) ||
    (job.benefits && job.benefits.some(benefit => 
      benefit.toLowerCase().includes('flexible') || 
      benefit.toLowerCase().includes('schedule') ||
      benefit.toLowerCase().includes('campus') ||
      benefit.toLowerCase().includes('student')
    ))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-xl text-blue-600 mt-1">{job.company}</p>
            
            {/* Student-friendly badge */}
            {studentFriendly && (
              <div className="inline-flex items-center mt-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                Student-Friendly
              </div>
            )}
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
        <JobDetails job={job} isStudentFriendly={studentFriendly} />

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