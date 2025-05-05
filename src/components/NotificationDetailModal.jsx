import React from 'react';
import { FaTimes, FaCheck, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const NotificationDetailModal = ({ item, type, onClose }) => {
  const navigate = useNavigate();
  const { markAlertAsRead, markEmailAsRead } = useNotification();
  
  // Mark as read when opened
  React.useEffect(() => {
    if (item && !item.read) {
      if (type === 'alerts') {
        markAlertAsRead(item.id);
      } else {
        markEmailAsRead(item.id);
      }
    }
  }, [item, type, markAlertAsRead, markEmailAsRead]);

  if (!item) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleActionClick = (actionType) => {
    // Handle different actions based on notification type
    if (item.type === 'job-offer' && actionType === 'accept') {
      // Logic to accept job offer
      const jobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
      jobOfferStatuses[item.jobId] = 'accepted';
      localStorage.setItem('jobOfferStatuses', JSON.stringify(jobOfferStatuses));
      onClose();
      // Redirect to job details or confirmation page
      navigate(`/welcome-job/${item.jobId}`);
    } else if (item.type === 'job-offer' && actionType === 'reject') {
      // Logic to reject job offer
      const jobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
      jobOfferStatuses[item.jobId] = 'rejected';
      localStorage.setItem('jobOfferStatuses', JSON.stringify(jobOfferStatuses));
      onClose();
    } else if (item.type === 'timesheet-submitted' || item.type === 'timesheet-approved' || item.type === 'timesheet-rejected') {
      // Navigate to timesheet details
      if (item.timesheetId) {
        navigate(`/timesheet/view/${item.timesheetId}`);
      } else {
        navigate('/timesheet/list');
      }
      onClose();
    } else if (item.type === 'job-application') {
      // Navigate to job application details
      if (item.jobId) {
        navigate(`/jobs/${item.jobId}`);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg text-gray-800">
            {type === 'alerts' ? item.title : item.subject}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4">
          {type === 'emails' && (
            <div className="mb-3 text-sm text-gray-600">
              <p><strong>From:</strong> {item.from}</p>
              <p><strong>Date:</strong> {formatDate(item.timestamp)}</p>
            </div>
          )}
          
          <div className="text-gray-700 mb-4">
            {item.message}
          </div>
          
          {/* Action buttons based on notification type */}
          {item.type === 'job-offer' && (
            <div className="flex space-x-3 mt-4">
              <button 
                onClick={() => handleActionClick('accept')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
              >
                <FaCheck className="mr-2" /> Accept Offer
              </button>
              <button 
                onClick={() => handleActionClick('reject')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Reject Offer
              </button>
            </div>
          )}
          
          {(item.type === 'timesheet-submitted' || item.type === 'timesheet-approved' || item.type === 'timesheet-rejected') && (
            <button 
              onClick={() => handleActionClick('view-timesheet')}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
            >
              <FaFileAlt className="mr-2" /> View Timesheet
            </button>
          )}
          
          {item.type === 'job-application' && (
            <button 
              onClick={() => handleActionClick('view-application')}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
            >
              <FaFileAlt className="mr-2" /> View Job Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;