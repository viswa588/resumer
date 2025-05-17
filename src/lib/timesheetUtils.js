/**
 * Formats timesheet data from localStorage to a standardized format
 * @returns {Array} Array of formatted timesheet objects
 */
export const getFormattedTimesheets = () => {
  const storedTimesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
    
  // Map the timesheets to match the expected format
  const formattedTimesheets = storedTimesheets.map(ts => ({
    id: ts.id,
    studentName: ts.userName,
    studentId: ts.userId,
    weekEnding: ts.weekEnding,
    totalHours: ts.totalHours,
    status: ts.status,
    department: ts.jobTitle,
    submittedDate: ts.submittedDate,
    date: ts.date || ts.submittedDate,
    jobId: ts.jobId,
    entries: ts.entries || [],
    jobTitle: ts.jobTitle
  }));
  
  return formattedTimesheets;
};

/**
 * Updates localStorage.timesheet with formatted timesheet values
 * @param {Object} timesheet - The timesheet object to store
 * @returns {void}
 */
export const updateTimesheetInLocalStorage = (timesheet) => {
  // Format the timesheet with the required fields
  const formattedTimesheet = {
    id: timesheet.id,
    studentName: timesheet.userName,
    studentId: timesheet.userId,
    weekEnding: timesheet.weekEnding,
    totalHours: timesheet.totalHours,
    status: timesheet.status,
    department: timesheet.jobTitle,
    submittedDate: timesheet.submittedDate,
    date: timesheet.date || timesheet.submittedDate,
    jobId: timesheet.jobId,
    entries: timesheet.entries || [],
    jobTitle: timesheet.jobTitle
  };
  
  // Store the formatted timesheet in localStorage
  localStorage.setItem('timesheet', JSON.stringify(formattedTimesheet));
};