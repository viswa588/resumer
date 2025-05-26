import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FaBriefcase, FaFileAlt, FaBell, FaEnvelope, FaDollarSign, FaUser } from 'react-icons/fa';
import { getJobApplications } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import JobSeekerNotifications from './JobSeekerNotifications';
import { createTimesheetApprovalNotification, createPaymentNotification } from '../lib/utils';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth() || {};
  const [applications, setApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get user email from context or localStorage
    const userEmail = currentUser?.email || localStorage.getItem('userEmail');
    
    if (!userEmail) {
      navigate('/login');
      return;
    }

    // Function to load applications and notifications
    const loadData = () => {
      // Load job applications for this user
      const allApplications = getJobApplications();
      const userApplications = allApplications.filter(app => 
        app.userEmail === userEmail || app.userId === userEmail
      );
      
      setApplications(userApplications);
      
      // Filter applications by status
      setPendingApplications(userApplications.filter(app => app.status === 'pending'));
      setApprovedApplications(userApplications.filter(app => app.status === 'approved'));
      setRejectedApplications(userApplications.filter(app => app.status === 'rejected'));
      
      // Check for unread notifications
      const userAlertsKey = `userAlerts_${userEmail}`;
      const userAlerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
      const unreadAlerts = userAlerts.filter(alert => !alert.read);
      setUnreadCount(unreadAlerts.length);
    };
    
    // Load data immediately
    loadData();
    
    // Set up interval to refresh data periodically
    const intervalId = setInterval(loadData, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [currentUser, navigate]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  // Function to generate sample notifications for demo purposes
  const generateSampleNotifications = () => {
    const userEmail = currentUser?.email || localStorage.getItem('userEmail');
    if (!userEmail) return;
    
    // Create sample timesheet approval notification
    createTimesheetApprovalNotification(userEmail);
    
    // Create sample payment notification
    createPaymentNotification(userEmail);
    
    // Refresh unread count
    const userAlertsKey = `userAlerts_${userEmail}`;
    const userAlerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
    const unreadAlerts = userAlerts.filter(alert => !alert.read);
    setUnreadCount(unreadAlerts.length);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="relative"
              onClick={toggleNotifications}
            >
              <FaBell className="text-gray-600 h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/profile')}
            >
              <FaUser /> Profile
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/jobs')}
            >
              <FaBriefcase /> Browse Jobs
            </Button>
          </div>
        </div>
        
        {/* Notifications Panel */}
        {showNotifications && (
          <div className="mb-6">
            <JobSeekerNotifications />
          </div>
        )}
        
        {/* Demo Controls - Only for testing */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Demo Controls</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Use these buttons to generate sample notifications for testing purposes.
          </p>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateSampleNotifications}
              className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              Generate Sample Notifications
            </Button>
          </div>
        </div>
        
        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-blue-100 p-4 rounded-full mr-4">
                <FaBriefcase className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <h3 className="text-2xl font-bold">{applications.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <FaFileAlt className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <h3 className="text-2xl font-bold">{approvedApplications.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-purple-100 p-4 rounded-full mr-4">
                <FaDollarSign className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Payments</p>
                <h3 className="text-2xl font-bold">2</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Applications */}
        <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
        <div className="mb-8">
          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <p>You haven't applied to any jobs yet.</p>
                  <Button 
                    onClick={() => navigate('/jobs')}
                    className="mt-4 bg-blue-500 hover:bg-blue-600"
                  >
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 p-4">
                {applications.map(application => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
                          <p className="text-gray-600">{application.companyName}</p>
                          <p className="text-gray-500 text-sm">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          {application.status === 'pending' && (
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                              Pending
                            </div>
                          )}
                          {application.status === 'approved' && (
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              Approved
                            </div>
                          )}
                          {application.status === 'rejected' && (
                            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                              Rejected
                            </div>
                          )}
                          <Button 
                            onClick={() => navigate(`/jobs/${application.jobId}`)}
                            variant="outline"
                            size="sm"
                          >
                            View Job
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;