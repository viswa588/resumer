// notificationService.js
// This service handles notifications for job seekers

/**
 * Create sample notifications for a job seeker
 * @param {string} userEmail - The job seeker's email
 */
export const createSampleNotifications = (userEmail) => {
  if (!userEmail) return;
  
  // Create user-specific keys
  const userAlertsKey = `userAlerts_${userEmail}`;
  const userEmailsKey = `userEmails_${userEmail}`;
  
  // Sample job application approval notification
  const jobApprovalAlert = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'job-offer',
    title: 'Job Application Approved',
    message: 'Congratulations! Your application for Frontend Developer at Tech Innovations Inc. has been approved.',
    jobId: 1,
    userEmail
  };
  
  const jobApprovalEmail = {
    id: Date.now() + 1,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'job-offer',
    subject: 'Job Application Approved: Frontend Developer',
    from: 'Tech Innovations Inc. <hr@techinnovations.com>',
    message: 'Congratulations! Your application for the Frontend Developer position at Tech Innovations Inc. has been approved. You can now submit timesheets for this position.',
    jobId: 1,
    userEmail
  };
  
  // Sample timesheet approval notification
  const timesheetApprovalAlert = {
    id: Date.now() + 2,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: false,
    type: 'timesheet-approved',
    title: 'Timesheet Approved',
    message: 'Your timesheet for the week ending June 15, 2023 has been approved.',
    timesheetId: 1,
    userEmail
  };
  
  const timesheetApprovalEmail = {
    id: Date.now() + 3,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    type: 'timesheet-approved',
    subject: 'Timesheet Approved: Week of June 15, 2023',
    from: 'Timesheet System <timesheet@techinnovations.com>',
    message: 'Your timesheet for the week ending June 15, 2023 has been approved. Payment will be processed according to the regular payment schedule.',
    timesheetId: 1,
    userEmail
  };
  
  // Sample payment notification
  const paymentAlert = {
    id: Date.now() + 4,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: false,
    type: 'payment-processed',
    title: 'Payment Processed',
    message: 'Your payment of $1,200.00 has been processed.',
    paymentId: 1,
    userEmail
  };
  
  const paymentEmail = {
    id: Date.now() + 5,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: false,
    type: 'payment-processed',
    subject: 'Payment Processed: $1,200.00',
    from: 'Payroll System <payroll@techinnovations.com>',
    message: 'Your payment of $1,200.00 for the period ending June 15, 2023 has been processed. The funds should appear in your account within 1-2 business days.',
    paymentId: 1,
    userEmail
  };
  
  // Save alerts to user-specific storage
  const alerts = [jobApprovalAlert, timesheetApprovalAlert, paymentAlert];
  localStorage.setItem(userAlertsKey, JSON.stringify(alerts));
  
  // Save emails to user-specific storage
  const emails = [jobApprovalEmail, timesheetApprovalEmail, paymentEmail];
  localStorage.setItem(userEmailsKey, JSON.stringify(emails));
  
  // Also update global storage for backward compatibility
  localStorage.setItem('userAlerts', JSON.stringify(alerts));
  localStorage.setItem('userEmails', JSON.stringify(emails));
  
  return { alerts, emails };
};

/**
 * Add a notification for a specific user
 * @param {string} userEmail - The user's email
 * @param {Object} notification - The notification object
 * @param {string} type - Type of notification ('alert' or 'email')
 */
export const addUserNotification = (userEmail, notification, type = 'alert') => {
  if (!userEmail) return;
  
  const storageKey = type === 'alert' ? `userAlerts_${userEmail}` : `userEmails_${userEmail}`;
  const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const newNotification = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    read: false,
    ...notification,
    userEmail
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem(storageKey, JSON.stringify(notifications));
  
  // Also update global notifications for backward compatibility
  const globalKey = type === 'alert' ? 'userAlerts' : 'userEmails';
  const globalNotifications = JSON.parse(localStorage.getItem(globalKey) || '[]');
  globalNotifications.unshift(newNotification);
  localStorage.setItem(globalKey, JSON.stringify(globalNotifications));
  
  return newNotification.id;
};

/**
 * Get notifications for a specific user
 * @param {string} userEmail - The user's email
 * @param {string} type - Type of notification ('alert' or 'email')
 * @returns {Array} Array of notifications
 */
export const getUserNotifications = (userEmail, type = 'alert') => {
  if (!userEmail) return [];
  
  const storageKey = type === 'alert' ? `userAlerts_${userEmail}` : `userEmails_${userEmail}`;
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
};

/**
 * Mark a notification as read
 * @param {string} userEmail - The user's email
 * @param {number} notificationId - The notification ID
 * @param {string} type - Type of notification ('alert' or 'email')
 */
export const markNotificationAsRead = (userEmail, notificationId, type = 'alert') => {
  if (!userEmail) return;
  
  const storageKey = type === 'alert' ? `userAlerts_${userEmail}` : `userEmails_${userEmail}`;
  const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  
  localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
  
  // Also update global notifications
  const globalKey = type === 'alert' ? 'userAlerts' : 'userEmails';
  const globalNotifications = JSON.parse(localStorage.getItem(globalKey) || '[]');
  
  const updatedGlobalNotifications = globalNotifications.map(notification => 
    notification.id === notificationId ? { ...notification, read: true } : notification
  );
  
  localStorage.setItem(globalKey, JSON.stringify(updatedGlobalNotifications));
};