import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import NotificationDetailModal from './NotificationDetailModal';

const NotificationDropdown = ({ type, onClose }) => {
  const navigate = useNavigate();
  const { 
    alerts, 
    emails, 
    markAlertAsRead, 
    markEmailAsRead, 
    markAllAlertsAsRead, 
    markAllEmailsAsRead,
    deleteAlert,
    deleteEmail
  } = useNotification();
  
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const items = type === 'alerts' ? alerts : emails;
  const markAsRead = type === 'alerts' ? markAlertAsRead : markEmailAsRead;
  const markAllAsRead = type === 'alerts' ? markAllAlertsAsRead : markAllEmailsAsRead;
  const deleteItem = type === 'alerts' ? deleteAlert : deleteEmail;
  
  const filteredItems = activeTab === 'all' 
    ? items 
    : activeTab === 'unread' 
      ? items.filter(item => !item.read) 
      : items.filter(item => item.read);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const handleItemClick = (item) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    // Set the selected item and show the detail modal
    setSelectedItem(item);
    setShowDetailModal(true);
  };
  
  const handleViewAll = () => {
    // Navigate to a dedicated notifications/messages page
    // For now, we'll just close the dropdown and show a notification test page
    onClose();
    navigate('/notification-test');
  };
  
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };
  
  return (
    <>
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold text-gray-700">
            {type === 'alerts' ? 'Notifications' : 'Messages'}
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={markAllAsRead}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
              title="Mark all as read"
            >
              <FaCheck className="mr-1" />
              <span>Mark all read</span>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="flex border-b">
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'unread' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'read' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('read')}
          >
            Read
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No {activeTab === 'unread' ? 'unread ' : activeTab === 'read' ? 'read ' : ''}
              {type === 'alerts' ? 'notifications' : 'messages'} to display
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!item.read ? 'bg-blue-50' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {type === 'alerts' ? (
                      <>
                        <div className="font-medium text-gray-800">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.message}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium text-gray-800">{item.subject}</div>
                        <div className="text-xs text-gray-500">From: {item.from}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.message}</div>
                      </>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{formatDate(item.timestamp)}</div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-500 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {filteredItems.length > 0 && (
          <div className="p-2 text-center border-t">
            <button 
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={handleViewAll}
            >
              View all {type === 'alerts' ? 'notifications' : 'messages'}
            </button>
          </div>
        )}
      </div>
      
      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <NotificationDetailModal 
          item={selectedItem} 
          type={type} 
          onClose={handleCloseDetailModal} 
        />
      )}
    </>
  );
};

export default NotificationDropdown;