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
    const hours = entry.hours.split(':');
    return sum + parseInt(hours[0]) + (parseInt(hours[1]) / 60);
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
  
  return { success: true, paycheck };
};