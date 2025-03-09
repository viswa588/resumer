import React from 'react';

const HistoryModal = ({ isOpen, onClose, appliedJobs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Applied Jobs History</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          {appliedJobs.map((job) => (
            <div key={job.id} className="border-b pb-4">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>
          ))}
        </div>
        {appliedJobs.length === 0 && (
          <p className="text-gray-500 text-center py-4">No jobs applied yet</p>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;