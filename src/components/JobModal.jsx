import React from 'react';

const JobModal = ({ job, onClose, onApply, isApplied }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          <p className="text-xl text-gray-700 mb-2">{job.company}</p>
          <p className="text-gray-600">{job.location}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Job Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Requirements</h3>
          <ul className="list-disc list-inside text-gray-700">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex space-x-4">
          <button 
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            onClick={() => onApply(job)}
            className={`w-full ${
              isApplied 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white py-2 rounded`}
            disabled={isApplied}
          >
            {isApplied ? 'Applied' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;