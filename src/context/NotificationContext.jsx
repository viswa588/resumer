import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [emails, setEmails] = useState([]);
  
  // Load notifications from localStorage on initial load
  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
    const savedEmails = JSON.parse(localStorage.getItem('userEmails') || '[]');
    
    setAlerts(savedAlerts);
    setEmails(savedEmails);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userAlerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('userEmails', JSON.stringify(emails));
  }, [emails]);

  // Add a new alert notification
  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...alert
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    return newAlert.id;
  };

  // Add a new email notification
  const addEmail = (email) => {
    const newEmail = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...email
    };
    setEmails(prevEmails => [newEmail, ...prevEmails]);
    return newEmail.id;
  };

  // Mark an alert as read
  const markAlertAsRead = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  // Mark an email as read
  const markEmailAsRead = (emailId) => {
    setEmails(prevEmails => 
      prevEmails.map(email => 
        email.id === emailId ? { ...email, read: true } : email
      )
    );
  };

  // Mark all alerts as read
  const markAllAlertsAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, read: true }))
    );
  };

  // Mark all emails as read
  const markAllEmailsAsRead = () => {
    setEmails(prevEmails => 
      prevEmails.map(email => ({ ...email, read: true }))
    );
  };

  // Delete an alert
  const deleteAlert = (alertId) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  // Delete an email
  const deleteEmail = (emailId) => {
    setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
  };

  // Get unread counts
  const getUnreadAlertCount = () => alerts.filter(alert => !alert.read).length;
  const getUnreadEmailCount = () => emails.filter(email => !email.read).length;

  // Add job application notification
  const addJobApplicationNotification = (jobTitle, company, jobId) => {
    // Add alert
    addAlert({
      type: 'job-application',
      title: 'Job Application Submitted',
      message: `You have successfully applied for the ${jobTitle} position at ${company}.`,
      jobId: jobId
    });
    
    // Add email
    addEmail({
      type: 'job-application',
      subject: `Job Application: ${jobTitle}`,
      from: `${company} <careers@${company.toLowerCase().replace(/\s+/g, '')}.com>`,
      message: `Thank you for applying to the ${jobTitle} position at ${company}. We will review your application and get back to you soon.`,
      jobId: jobId
    });
  };

  // Add job offer notification
  const addJobOfferNotification = (jobTitle, company, jobId) => {
    // Add alert
    addAlert({
      type: 'job-offer',
      title: 'Job Offer Received',
      message: `Congratulations! You've received a job offer for the ${jobTitle} position at ${company}.`,
      jobId: jobId
    });
    
    // Add email
    addEmail({
      type: 'job-offer',
      subject: `Job Offer: ${jobTitle}`,
      from: `${company} <hr@${company.toLowerCase().replace(/\s+/g, '')}.com>`,
      message: `Congratulations! We are pleased to offer you the ${jobTitle} position at ${company}. Please review the attached offer letter and respond at your earliest convenience.`,
      jobId: jobId
    });
  };

  // Add timesheet notification
  const addTimesheetNotification = (status, date, timesheetId) => {
    const formattedDate = new Date(date).toLocaleDateString();
    
    if (status === 'submitted') {
      // Add alert
      addAlert({
        type: 'timesheet-submitted',
        title: 'Timesheet Submitted',
        message: `Your timesheet for ${formattedDate} has been submitted successfully.`,
        timesheetId: timesheetId
      });
      
      // Add email
      addEmail({
        type: 'timesheet-submitted',
        subject: `Timesheet Submitted: ${formattedDate}`,
        from: 'Timesheet System <timesheet@company.com>',
        message: `Your timesheet for ${formattedDate} has been submitted and is pending approval.`,
        timesheetId: timesheetId
      });
    } else if (status === 'approved') {
      // Add alert
      addAlert({
        type: 'timesheet-approved',
        title: 'Timesheet Approved',
        message: `Your timesheet for ${formattedDate} has been approved.`,
        timesheetId: timesheetId
      });
      
      // Add email
      addEmail({
        type: 'timesheet-approved',
        subject: `Timesheet Approved: ${formattedDate}`,
        from: 'Timesheet System <timesheet@company.com>',
        message: `Your timesheet for ${formattedDate} has been approved. Payment will be processed according to the regular payment schedule.`,
        timesheetId: timesheetId
      });
    } else if (status === 'rejected') {
      // Add alert
      addAlert({
        type: 'timesheet-rejected',
        title: 'Timesheet Rejected',
        message: `Your timesheet for ${formattedDate} has been rejected. Please review and resubmit.`,
        timesheetId: timesheetId
      });
      
      // Add email
      addEmail({
        type: 'timesheet-rejected',
        subject: `Timesheet Rejected: ${formattedDate}`,
        from: 'Timesheet System <timesheet@company.com>',
        message: `Your timesheet for ${formattedDate} has been rejected. Please review the comments, make necessary corrections, and resubmit.`,
        timesheetId: timesheetId
      });
    }
  };

  // Context value
  const value = {
    alerts,
    emails,
    addAlert,
    addEmail,
    markAlertAsRead,
    markEmailAsRead,
    markAllAlertsAsRead,
    markAllEmailsAsRead,
    deleteAlert,
    deleteEmail,
    getUnreadAlertCount,
    getUnreadEmailCount,
    addJobApplicationNotification,
    addJobOfferNotification,
    addTimesheetNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;