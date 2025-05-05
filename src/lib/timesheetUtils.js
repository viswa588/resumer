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
    submittedDate: ts.submittedDate
  }));
  
  return formattedTimesheets;
};

export const getFormattedTimesheetsData = () => {
  const storedTimesheets = JSON.parse(localStorage.getItem('timesheets-app') || '[]');
    
  
  
  return storedTimesheets;
};