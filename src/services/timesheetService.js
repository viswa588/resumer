// timesheetService.js
// This service handles timesheet operations

/**
 * Get all timesheets
 * @returns {Array} Array of timesheet objects
 */
export const getTimesheets = () => {
  return JSON.parse(localStorage.getItem('timesheets') || '[]');
};

/**
 * Get timesheets for a specific job
 * @param {number} jobId - The job ID
 * @returns {Array} Array of timesheet objects for the job
 */
export const getTimesheetsByJob = (jobId) => {
  const timesheets = getTimesheets();
  return timesheets.filter(ts => ts.jobId === jobId);
};

/**
 * Get timesheets for a specific user
 * @param {string} userId - The user ID or email
 * @returns {Array} Array of timesheet objects for the user
 */
export const getTimesheetsByUser = (userId) => {
  const timesheets = getTimesheets();
  return timesheets.filter(ts => ts.userId === userId || ts.userEmail === userId);
};

/**
 * Get approved timesheets for a specific user
 * @param {string} userId - The user ID or email
 * @returns {Array} Array of approved timesheet objects for the user
 */
export const getApprovedTimesheetsByUser = (userId) => {
  const timesheets = getTimesheetsByUser(userId);
  return timesheets.filter(ts => ts.status === 'approved');
};

/**
 * Submit a timesheet
 * @param {Object} timesheet - The timesheet object
 * @returns {Object} The created timesheet
 */
export const submitTimesheet = (timesheet) => {
  const timesheets = getTimesheets();
  
  // Create new timesheet with pending status
  const newTimesheet = {
    ...timesheet,
    id: Date.now(),
    status: 'pending',
    submittedDate: new Date().toISOString(),
    approved: false
  };
  
  // Save to localStorage
  localStorage.setItem('timesheets', JSON.stringify([...timesheets, newTimesheet]));
  
  // Add notifications for timesheet submission
  const userEmail = timesheet.userEmail || timesheet.userId;
  const date = new Date().toLocaleDateString();
  
  // Add alert notification
  const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  alerts.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-submitted',
    title: 'Timesheet Submitted',
    message: `Your timesheet for ${date} has been submitted successfully.`,
    timesheetId: newTimesheet.id
  });
  localStorage.setItem('userAlerts', JSON.stringify(alerts));
  
  // Add email notification
  const emails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  emails.unshift({
    id: Date.now() + 1,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-submitted',
    subject: `Timesheet Submitted: ${date}`,
    from: 'Timesheet System <timesheet@company.com>',
    message: `Your timesheet for ${date} has been submitted and is pending approval.`,
    timesheetId: newTimesheet.id
  });
  localStorage.setItem('userEmails', JSON.stringify(emails));
  
  return { success: true, timesheet: newTimesheet };
};

/**
 * Approve a timesheet
 * @param {number} timesheetId - The timesheet ID
 * @returns {Object} Result of the operation
 */
export const approveTimesheet = (timesheetId) => {
  const timesheets = getTimesheets();
  const tsIndex = timesheets.findIndex(ts => ts.id === timesheetId);
  
  if (tsIndex === -1) {
    return { success: false, message: 'Timesheet not found' };
  }
  
  // Update timesheet status
  timesheets[tsIndex] = {
    ...timesheets[tsIndex],
    status: 'approved',
    approved: true,
    approvedDate: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem('timesheets', JSON.stringify(timesheets));
  
  // Add notifications for timesheet approval
  const userEmail = timesheets[tsIndex].userEmail || timesheets[tsIndex].userId;
  const date = new Date(timesheets[tsIndex].weekStartDate || timesheets[tsIndex].date).toLocaleDateString();
  
  // Add alert notification
  const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  alerts.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-approved',
    title: 'Timesheet Approved',
    message: `Your timesheet for ${date} has been approved.`,
    timesheetId: timesheetId
  });
  localStorage.setItem('userAlerts', JSON.stringify(alerts));
  
  // Add email notification
  const emails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  emails.unshift({
    id: Date.now() + 1,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-approved',
    subject: `Timesheet Approved: ${date}`,
    from: 'Timesheet System <timesheet@company.com>',
    message: `Your timesheet for ${date} has been approved. Payment will be processed according to the regular payment schedule.`,
    timesheetId: timesheetId
  });
  localStorage.setItem('userEmails', JSON.stringify(emails));
  
  return { success: true, timesheet: timesheets[tsIndex] };
};

/**
 * Reject a timesheet
 * @param {number} timesheetId - The timesheet ID
 * @returns {Object} Result of the operation
 */
export const rejectTimesheet = (timesheetId) => {
  const timesheets = getTimesheets();
  const tsIndex = timesheets.findIndex(ts => ts.id === timesheetId);
  
  if (tsIndex === -1) {
    return { success: false, message: 'Timesheet not found' };
  }
  
  // Update timesheet status
  timesheets[tsIndex] = {
    ...timesheets[tsIndex],
    status: 'rejected',
    approved: false,
    rejectedDate: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem('timesheets', JSON.stringify(timesheets));
  
  // Add notifications for timesheet rejection
  const userEmail = timesheets[tsIndex].userEmail || timesheets[tsIndex].userId;
  const date = new Date(timesheets[tsIndex].weekStartDate || timesheets[tsIndex].date).toLocaleDateString();
  
  // Add alert notification
  const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  alerts.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-rejected',
    title: 'Timesheet Rejected',
    message: `Your timesheet for ${date} has been rejected. Please review and resubmit.`,
    timesheetId: timesheetId
  });
  localStorage.setItem('userAlerts', JSON.stringify(alerts));
  
  // Add email notification
  const emails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  emails.unshift({
    id: Date.now() + 1,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'timesheet-rejected',
    subject: `Timesheet Rejected: ${date}`,
    from: 'Timesheet System <timesheet@company.com>',
    message: `Your timesheet for ${date} has been rejected. Please review the comments, make necessary corrections, and resubmit.`,
    timesheetId: timesheetId
  });
  localStorage.setItem('userEmails', JSON.stringify(emails));
  
  return { success: true, timesheet: timesheets[tsIndex] };
};

/**
 * Check if a user has any approved timesheets
 * @param {string} userId - The user ID or email
 * @returns {boolean} True if user has approved timesheets
 */
export const hasApprovedTimesheets = (userId) => {
  const timesheets = getTimesheetsByUser(userId);
  return timesheets.some(ts => ts.approved === true);
};

/**
 * Generate a paycheck for an approved timesheet
 * @param {number} timesheetId - The timesheet ID
 * @returns {Object} The generated paycheck
 */
export const generatePaycheck = (timesheetId) => {
  const timesheets = getTimesheets();
  const timesheet = timesheets.find(ts => ts.id === timesheetId);
  
  if (!timesheet) {
    return { success: false, message: 'Timesheet not found' };
  }
  
  if (timesheet.status !== 'approved') {
    return { success: false, message: 'Cannot generate paycheck for unapproved timesheet' };
  }
  
  // Calculate total hours
  const totalHours = timesheet.entries.reduce((sum, entry) => {
    if (typeof entry.hours === 'string' && entry.hours.includes(':')) {
      const hours = entry.hours.split(':');
      return sum + parseInt(hours[0]) + (parseInt(hours[1]) / 60);
    } else {
      return sum + parseFloat(entry.hours || 0);
    }
  }, 0);
  
  // Calculate amount (assuming $25/hour)
  const hourlyRate = 25;
  const amount = totalHours * hourlyRate;
  
  // Create paycheck
  const paycheck = {
    id: Date.now(),
    timesheetId: timesheet.id,
    userId: timesheet.userId || timesheet.userEmail,
    jobId: timesheet.jobId,
    period: `${new Date(timesheet.weekStartDate).toLocaleDateString()} - ${new Date(timesheet.weekEndDate).toLocaleDateString()}`,
    amount: `$${amount.toFixed(2)}`,
    status: 'Paid',
    date: new Date().toISOString().split('T')[0],
    jobTitle: timesheet.jobTitle,
    weekEnding: timesheet.weekEndDate
  };
  
  // Save to localStorage
  const paychecks = JSON.parse(localStorage.getItem('userPaychecks') || '[]');
  localStorage.setItem('userPaychecks', JSON.stringify([...paychecks, paycheck]));
  
  // Add notifications for paycheck generation
  const userEmail = timesheet.userEmail || timesheet.userId;
  
  // Add alert notification
  const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  alerts.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'paycheck-generated',
    title: 'Paycheck Generated',
    message: `A paycheck for $${amount.toFixed(2)} has been generated for your approved timesheet.`,
    paycheckId: paycheck.id
  });
  localStorage.setItem('userAlerts', JSON.stringify(alerts));
  
  // Add email notification
  const emails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  emails.unshift({
    id: Date.now() + 1,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'paycheck-generated',
    subject: `Paycheck Generated: $${amount.toFixed(2)}`,
    from: 'Payroll System <payroll@company.com>',
    message: `A paycheck for $${amount.toFixed(2)} has been generated for your approved timesheet for the period ${paycheck.period}. You can view and download your paycheck from your profile.`,
    paycheckId: paycheck.id
  });
  localStorage.setItem('userEmails', JSON.stringify(emails));
  
  return { success: true, paycheck };
};