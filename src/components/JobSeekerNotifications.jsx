import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FaBell, FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';

const JobSeekerNotifications = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState([]);
  const [emails, setEmails] = useState([]);
  
  useEffect(() => {
    // Get current user email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    
    // Function to load notifications
    const loadNotifications = () => {
      // Try user-specific storage first
      const userAlertsKey = `userAlerts_${userEmail}`;
      const userEmailsKey = `userEmails_${userEmail}`;
      
      const userAlerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
      const userEmails = JSON.parse(localStorage.getItem(userEmailsKey) || '[]');
      
      if (userAlerts.length > 0 || userEmails.length > 0) {
        // Use user-specific notifications
        setAlerts(userAlerts);
        setEmails(userEmails);
      } else {
        // Fall back to global notifications and filter by user
        const allAlerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
        const allEmails = JSON.parse(localStorage.getItem('userEmails') || '[]');
        
        const filteredAlerts = allAlerts.filter(alert => 
          alert.userEmail === userEmail || !alert.userEmail
        );
        
        const filteredEmails = allEmails.filter(email => 
          email.userEmail === userEmail || !email.userEmail
        );
        
        // Save to user-specific storage for future use
        if (filteredAlerts.length > 0) {
          localStorage.setItem(userAlertsKey, JSON.stringify(filteredAlerts));
        }
        
        if (filteredEmails.length > 0) {
          localStorage.setItem(userEmailsKey, JSON.stringify(filteredEmails));
        }
        
        setAlerts(filteredAlerts);
        setEmails(filteredEmails);
      }
    };
    
    // Load notifications immediately
    loadNotifications();
    
    // Set up interval to refresh periodically
    const intervalId = setInterval(loadNotifications, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const markAlertAsRead = (alertId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    );
    setAlerts(updatedAlerts);
    
    // Update in localStorage
    const userAlertsKey = `userAlerts_${userEmail}`;
    localStorage.setItem(userAlertsKey, JSON.stringify(updatedAlerts));
  };
  
  const markEmailAsRead = (emailId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    
    const updatedEmails = emails.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    );
    setEmails(updatedEmails);
    
    // Update in localStorage
    const userEmailsKey = `userEmails_${userEmail}`;
    localStorage.setItem(userEmailsKey, JSON.stringify(updatedEmails));
  };
  
  const markAllAsRead = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    
    if (activeTab === 'alerts') {
      const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
      setAlerts(updatedAlerts);
      
      // Update in localStorage
      const userAlertsKey = `userAlerts_${userEmail}`;
      localStorage.setItem(userAlertsKey, JSON.stringify(updatedAlerts));
    } else {
      const updatedEmails = emails.map(email => ({ ...email, read: true }));
      setEmails(updatedEmails);
      
      // Update in localStorage
      const userEmailsKey = `userEmails_${userEmail}`;
      localStorage.setItem(userEmailsKey, JSON.stringify(updatedEmails));
    }
  };
  
  const deleteNotification = (id) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    
    if (activeTab === 'alerts') {
      const updatedAlerts = alerts.filter(alert => alert.id !== id);
      setAlerts(updatedAlerts);
      
      // Update in localStorage
      const userAlertsKey = `userAlerts_${userEmail}`;
      localStorage.setItem(userAlertsKey, JSON.stringify(updatedAlerts));
    } else {
      const updatedEmails = emails.filter(email => email.id !== id);
      setEmails(updatedEmails);
      
      // Update in localStorage
      const userEmailsKey = `userEmails_${userEmail}`;
      localStorage.setItem(userEmailsKey, JSON.stringify(updatedEmails));
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'alerts' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('alerts')}
              className="flex items-center"
            >
              <FaBell className="mr-1" /> Alerts
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {alerts.filter(a => !a.read).length}
                </span>
              )}
            </Button>
            <Button 
              variant={activeTab === 'emails' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('emails')}
              className="flex items-center"
            >
              <FaEnvelope className="mr-1" /> Emails
              {emails.filter(e => !e.read).length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {emails.filter(e => !e.read).length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
        
        {activeTab === 'alerts' ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No notifications</div>
            ) : (
              alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 border rounded-lg flex justify-between items-start ${!alert.read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                >
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm text-gray-600">{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(alert.timestamp)}</div>
                  </div>
                  <div className="flex space-x-1">
                    {!alert.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAlertAsRead(alert.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteNotification(alert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {emails.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No emails</div>
            ) : (
              emails.map(email => (
                <div 
                  key={email.id} 
                  className={`p-3 border rounded-lg ${!email.read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{email.subject}</div>
                      <div className="text-xs text-gray-500">From: {email.from}</div>
                    </div>
                    <div className="flex space-x-1">
                      {!email.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markEmailAsRead(email.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteNotification(email.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">{email.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatDate(email.timestamp)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobSeekerNotifications;