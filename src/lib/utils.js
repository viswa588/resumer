import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Create a sample timesheet approval notification
 * @param {string} userEmail - The user's email
 */
export function createTimesheetApprovalNotification(userEmail) {
  if (!userEmail) return;
  
  const userAlertsKey = `userAlerts_${userEmail}`;
  const userEmailsKey = `userEmails_${userEmail}`;
  
  // Get existing notifications
  const alerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
  const emails = JSON.parse(localStorage.getItem(userEmailsKey) || '[]');
  
  // Create timesheet approval notification
  const timesheetApprovalAlert = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-approved',
    title: 'Timesheet Approved',
    message: 'Your timesheet for the week ending June 30, 2023 has been approved.',
    timesheetId: Math.floor(Math.random() * 1000),
    userEmail
  };
  
  const timesheetApprovalEmail = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-approved',
    subject: 'Timesheet Approved: Week of June 30, 2023',
    from: 'Timesheet System <timesheet@company.com>',
    message: 'Your timesheet for the week ending June 30, 2023 has been approved. Payment will be processed according to the regular payment schedule.',
    timesheetId: Math.floor(Math.random() * 1000),
    userEmail
  };
  
  // Add to existing notifications
  alerts.unshift(timesheetApprovalAlert);
  emails.unshift(timesheetApprovalEmail);
  
  // Save back to localStorage
  localStorage.setItem(userAlertsKey, JSON.stringify(alerts));
  localStorage.setItem(userEmailsKey, JSON.stringify(emails));
  
  // Also update global notifications
  const globalAlerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  const globalEmails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  
  globalAlerts.unshift(timesheetApprovalAlert);
  globalEmails.unshift(timesheetApprovalEmail);
  
  localStorage.setItem('userAlerts', JSON.stringify(globalAlerts));
  localStorage.setItem('userEmails', JSON.stringify(globalEmails));
}

/**
 * Create a sample payment notification
 * @param {string} userEmail - The user's email
 */
export function createPaymentNotification(userEmail) {
  if (!userEmail) return;
  
  const userAlertsKey = `userAlerts_${userEmail}`;
  const userEmailsKey = `userEmails_${userEmail}`;
  
  // Get existing notifications
  const alerts = JSON.parse(localStorage.getItem(userAlertsKey) || '[]');
  const emails = JSON.parse(localStorage.getItem(userEmailsKey) || '[]');
  
  // Create payment notification
  const paymentAlert = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'payment-processed',
    title: 'Payment Processed',
    message: 'Your payment of $1,500.00 has been processed.',
    paymentId: Math.floor(Math.random() * 1000),
    userEmail
  };
  
  const paymentEmail = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'payment-processed',
    subject: 'Payment Processed: $1,500.00',
    from: 'Payroll System <payroll@company.com>',
    message: 'Your payment of $1,500.00 for the period ending June 30, 2023 has been processed. The funds should appear in your account within 1-2 business days.',
    paymentId: Math.floor(Math.random() * 1000),
    userEmail
  };
  
  // Add to existing notifications
  alerts.unshift(paymentAlert);
  emails.unshift(paymentEmail);
  
  // Save back to localStorage
  localStorage.setItem(userAlertsKey, JSON.stringify(alerts));
  localStorage.setItem(userEmailsKey, JSON.stringify(emails));
  
  // Also update global notifications
  const globalAlerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  const globalEmails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  
  globalAlerts.unshift(paymentAlert);
  globalEmails.unshift(paymentEmail);
  
  localStorage.setItem('userAlerts', JSON.stringify(globalAlerts));
  localStorage.setItem('userEmails', JSON.stringify(globalEmails));
}