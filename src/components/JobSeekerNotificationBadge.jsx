import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';

const JobSeekerNotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth() || {};
  
  useEffect(() => {
    // Function to check for notifications
    const checkNotifications = () => {
      if (currentUser && currentUser.email) {
        // Try user-specific notifications first
        const userAlertsKey = `userAlerts_${currentUser.email}`;
        const userAlerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
        
        if (userAlerts.length > 0) {
          // Count unread user-specific notifications
          const unreadUserAlerts = userAlerts.filter(alert => !alert.read);
          setUnreadCount(unreadUserAlerts.length);
        } else {
          // Fall back to global notifications and filter by user
          const allAlerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
          const userAlerts = allAlerts.filter(alert => 
            alert.userEmail === currentUser.email || !alert.userEmail
          );
          const unreadAlerts = userAlerts.filter(alert => !alert.read);
          setUnreadCount(unreadAlerts.length);
        }
      } else {
        // If no user is logged in, show no notifications
        setUnreadCount(0);
      }
    };
    
    // Check notifications immediately
    checkNotifications();
    
    // Set up interval to check periodically
    const intervalId = setInterval(checkNotifications, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  return (
    <div className="relative">
      <FaBell className="text-gray-600 h-5 w-5" />
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </div>
  );
};

export default JobSeekerNotificationBadge;