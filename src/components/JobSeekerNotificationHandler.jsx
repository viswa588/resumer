import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Component that handles loading job seeker notifications
 * This component doesn't render anything visible, it just handles the notification loading logic
 */
const JobSeekerNotificationHandler = () => {
  const { currentUser } = useAuth() || {};
  
  useEffect(() => {
    // Function to load notifications from global storage to user-specific storage
    const loadUserNotifications = () => {
      // Get user email from context or localStorage
      const userEmail = currentUser?.email || localStorage.getItem('userEmail');
      if (!userEmail) return;
      
      // Check if user already has user-specific notifications
      const userAlertsKey = `userAlerts_${userEmail}`;
      const userEmailsKey = `userEmails_${userEmail}`;
      
      // Get global notifications
      const globalAlerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
      const globalEmails = JSON.parse(localStorage.getItem('userEmails') || '[]');
      
      // Filter notifications for this user
      const userAlerts = globalAlerts.filter(alert => 
        alert.userEmail === userEmail || !alert.userEmail
      );
      
      const userEmails = globalEmails.filter(email => 
        email.userEmail === userEmail || !email.userEmail
      );
      
      // Save to user-specific storage
      if (userAlerts.length > 0) {
        localStorage.setItem(userAlertsKey, JSON.stringify(userAlerts));
      }
      
      if (userEmails.length > 0) {
        localStorage.setItem(userEmailsKey, JSON.stringify(userEmails));
      }
    };
    
    // Check for job application status changes
    const checkApplicationStatus = () => {
      const userEmail = currentUser?.email || localStorage.getItem('userEmail');
      if (!userEmail) return;
      
      // Get all job applications
      const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      
      // Filter for this user's applications
      const userApplications = applications.filter(app => 
        app.userEmail === userEmail || app.userId === userEmail
      );
      
      // Check for approved applications that need notifications
      userApplications.forEach(app => {
        if (app.status === 'approved' && !app.notificationSent) {
          // Mark as notification sent
          const updatedApplications = applications.map(a => 
            a.id === app.id ? { ...a, notificationSent: true } : a
          );
          localStorage.setItem('jobApplications', JSON.stringify(updatedApplications));
          
          // Add notification
          const userAlertsKey = `userAlerts_${userEmail}`;
          const userAlerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
          
          userAlerts.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            type: 'job-offer',
            title: 'Job Application Approved',
            message: `Congratulations! Your application for ${app.jobTitle} at ${app.companyName} has been approved.`,
            jobId: app.jobId
          });
          
          localStorage.setItem(userAlertsKey, JSON.stringify(userAlerts));
          
          // Add email notification
          const userEmailsKey = `userEmails_${userEmail}`;
          const userEmails = JSON.parse(localStorage.getItem(userEmailsKey) || '[]');
          
          userEmails.unshift({
            id: Date.now() + 1,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'job-offer',
            subject: `Job Application Approved: ${app.jobTitle}`,
            from: `${app.companyName} <hr@${app.companyName.toLowerCase().replace(/\s+/g, '')}.com>`,
            message: `Congratulations! Your application for the ${app.jobTitle} position at ${app.companyName} has been approved. You can now submit timesheets for this position.`,
            jobId: app.jobId
          });
          
          localStorage.setItem(userEmailsKey, JSON.stringify(userEmails));
        }
      });
      
      // Check for timesheet approvals
      const timesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
      const userTimesheets = timesheets.filter(ts => 
        ts.userEmail === userEmail || ts.userId === userEmail
      );
      
      userTimesheets.forEach(timesheet => {
        if (timesheet.status === 'approved' && !timesheet.notificationSent) {
          // Mark as notification sent
          const updatedTimesheets = timesheets.map(ts => 
            ts.id === timesheet.id ? { ...ts, notificationSent: true } : ts
          );
          localStorage.setItem('timesheets', JSON.stringify(updatedTimesheets));
          
          // Add notification
          const userAlertsKey = `userAlerts_${userEmail}`;
          const userAlerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
          
          userAlerts.unshift({
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            read: false,
            type: 'timesheet-approved',
            title: 'Timesheet Approved',
            message: `Your timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been approved.`,
            timesheetId: timesheet.id
          });
          
          localStorage.setItem(userAlertsKey, JSON.stringify(userAlerts));
          
          // Add email notification
          const userEmailsKey = `userEmails_${userEmail}`;
          const userEmails = JSON.parse(localStorage.getItem(userEmailsKey) || '[]');
          
          userEmails.unshift({
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            read: false,
            type: 'timesheet-approved',
            subject: `Timesheet Approved: ${new Date(timesheet.weekEnding).toLocaleDateString()}`,
            from: 'Timesheet System <timesheet@company.com>',
            message: `Your timesheet for ${new Date(timesheet.weekEnding).toLocaleDateString()} has been approved. Payment will be processed according to the regular payment schedule.`,
            timesheetId: timesheet.id
          });
          
          localStorage.setItem(userEmailsKey, JSON.stringify(userEmails));
        }
      });
      
      // Check for payments
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      const userPayments = payments.filter(payment => 
        payment.userEmail === userEmail || payment.userId === userEmail
      );
      
      userPayments.forEach(payment => {
        if (payment.status === 'processed' && !payment.notificationSent) {
          // Mark as notification sent
          const updatedPayments = payments.map(p => 
            p.id === payment.id ? { ...p, notificationSent: true } : p
          );
          localStorage.setItem('payments', JSON.stringify(updatedPayments));
          
          // Add notification
          const userAlertsKey = `userAlerts_${userEmail}`;
          const userAlerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
          
          userAlerts.unshift({
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            read: false,
            type: 'payment-processed',
            title: 'Payment Processed',
            message: `Your payment of $${payment.amount.toFixed(2)} has been processed.`,
            paymentId: payment.id
          });
          
          localStorage.setItem(userAlertsKey, JSON.stringify(userAlerts));
          
          // Add email notification
          const userEmailsKey = `userEmails_${userEmail}`;
          const userEmails = JSON.parse(localStorage.getItem(userEmailsKey) || '[]');
          
          userEmails.unshift({
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            read: false,
            type: 'payment-processed',
            subject: `Payment Processed: $${payment.amount.toFixed(2)}`,
            from: 'Payroll System <payroll@company.com>',
            message: `Your payment of $${payment.amount.toFixed(2)} for the period ending ${new Date(payment.periodEnd).toLocaleDateString()} has been processed. The funds should appear in your account within 1-2 business days.`,
            paymentId: payment.id
          });
          
          localStorage.setItem(userEmailsKey, JSON.stringify(userEmails));
        }
      });
    };
    
    // Load notifications immediately
    loadUserNotifications();
    
    // Check status immediately and then periodically
    checkApplicationStatus();
    const intervalId = setInterval(() => {
      loadUserNotifications();
      checkApplicationStatus();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  // This component doesn't render anything
  return null;
};

export default JobSeekerNotificationHandler;