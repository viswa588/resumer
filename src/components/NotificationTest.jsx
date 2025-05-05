import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Button } from './ui/button';

const NotificationTest = () => {
  const { 
    addAlert, 
    addEmail, 
    addJobApplicationNotification, 
    addJobOfferNotification, 
    addTimesheetNotification,
    getUnreadAlertCount,
    getUnreadEmailCount
  } = useNotification();

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Notification Test Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Alert Notifications</h2>
          <p className="mb-2">Current unread alerts: <span className="font-bold">{getUnreadAlertCount()}</span></p>
          <div className="space-y-2">
            <Button 
              onClick={() => addAlert({
                title: 'Test Alert',
                message: 'This is a test alert notification.',
              })}
              className="w-full"
            >
              Add Test Alert
            </Button>
          </div>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>
          <p className="mb-2">Current unread emails: <span className="font-bold">{getUnreadEmailCount()}</span></p>
          <div className="space-y-2">
            <Button 
              onClick={() => addEmail({
                subject: 'Test Email',
                from: 'test@example.com',
                message: 'This is a test email notification.',
              })}
              className="w-full"
            >
              Add Test Email
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Scenario-based Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => addJobApplicationNotification('Software Engineer', 'Tech Company', 1)}
            className="w-full"
          >
            Job Application
          </Button>
          
          <Button 
            onClick={() => addJobOfferNotification('Software Engineer', 'Tech Company', 1)}
            className="w-full"
          >
            Job Offer
          </Button>
          
          <Button 
            onClick={() => addTimesheetNotification('submitted', new Date().toISOString(), Date.now())}
            className="w-full"
          >
            Timesheet Submitted
          </Button>
          
          <Button 
            onClick={() => addTimesheetNotification('approved', new Date().toISOString(), Date.now())}
            className="w-full"
          >
            Timesheet Approved
          </Button>
          
          <Button 
            onClick={() => addTimesheetNotification('rejected', new Date().toISOString(), Date.now())}
            className="w-full"
          >
            Timesheet Rejected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;