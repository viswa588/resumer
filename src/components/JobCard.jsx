import React from 'react';

const JobCard = ({ job, onSelect, onApply, isApplied }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="text-sm text-gray-500 mb-2">{job.location}</p>
      <div className="flex justify-between items-center">
        <button 
          onClick={() => onSelect(job)} 
          className="text-blue-500 hover:text-blue-700"
        >
          View Details
        </button>
        <button 
          onClick={() => onApply(job)}
          className={`px-4 py-2 rounded ${
            isApplied 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          disabled={isApplied}
        >
          {isApplied ? 'Applied' : 'Apply'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;