// paycheckService.js
// This service handles paycheck-related operations

/**
 * Get all paychecks for the current user
 * @returns {Array} Array of paycheck objects
 */
export const getPaychecks = () => {
  const paychecks = JSON.parse(localStorage.getItem('userPaychecks') || '[]');
  return paychecks;
};

/**
 * Get timesheets from localStorage
 * @returns {Array} Array of timesheet objects
 */
const getTimesheets = () => {
  return JSON.parse(localStorage.getItem('timesheets') || '[]');
};

/**
 * Add a new paycheck
 * @param {Object} paycheck - The paycheck object to add
 * @returns {Object} The added paycheck with a generated ID
 */
export const addPaycheck = (paycheck) => {
  const paychecks = getPaychecks();
  
  // Generate a new ID
  const newId = paychecks.length > 0 
    ? Math.max(...paychecks.map(p => p.id)) + 1 
    : 1;
  
  const newPaycheck = {
    ...paycheck,
    id: newId,
    date: paycheck.date || new Date().toISOString().split('T')[0]
  };
  
  const updatedPaychecks = [...paychecks, newPaycheck];
  localStorage.setItem('userPaychecks', JSON.stringify(updatedPaychecks));
  
  return newPaycheck;
};

/**
 * Download a paycheck (mock implementation)
 * @param {number} paycheckId - The ID of the paycheck to download
 * @returns {Object} Object with success status and message
 */
export const downloadPaycheck = (paycheckId) => {
  const paychecks = getPaychecks();
  const paycheck = paychecks.find(p => p.id === paycheckId);
  
  if (!paycheck) {
    return { success: false, message: 'Paycheck not found' };
  }
  
  // In a real implementation, this would generate and download a PDF
  // For now, we'll just return a success message
  return { 
    success: true, 
    message: 'Paycheck downloaded successfully',
    paycheck
  };
};

/**
 * Calculate paycheck details including service charge and processing fee
 * @param {Object} paycheck - The paycheck object
 * @returns {Object} Detailed paycheck information with calculations
 */
export const calculatePaycheckDetails = (paycheck) => {
  if (!paycheck) return null;
  
  // Parse the gross amount
  const grossPay = parseFloat(paycheck.amount.replace('$', '').replace(',', ''));
  
  // Calculate service charge (5%)
  const serviceCharge = grossPay * 0.05;
  
  // Fixed processing fee
  const processingFee = 10.00;
  
  // Standard deductions
  const federalTax = 250.00;
  const stateTax = 125.00;
  const socialSecurity = 77.50;
  const medicare = 18.13;
  const healthInsurance = 85.00;
  const retirement = 62.50;
  
  // Calculate total deductions
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + 
                         healthInsurance + retirement + serviceCharge + processingFee;
  
  // Calculate net pay
  const netPay = grossPay - totalDeductions;
  
  return {
    grossPay,
    deductions: {
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      healthInsurance,
      retirement
    },
    fees: {
      serviceCharge,
      processingFee
    },
    totalDeductions,
    netPay
  };
};

/**
 * Generate a date range string for a week based on end date
 * @param {string} endDateStr - The end date of the week in ISO format
 * @returns {string} Formatted date range string
 */
const getWeekRangeFromEndDate = (endDateStr) => {
  const endDate = new Date(endDateStr);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6); // 7 days before end date
  
  const formatDate = (date) => {
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}, ${endDate.getFullYear()}`;
};

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDateToISO = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Generate paychecks based on approved timesheets
 * @returns {Array} Array of paycheck objects
 */
const generatePaychecksFromTimesheets = () => {
  const timesheets = getTimesheets();
  const approvedTimesheets = timesheets.filter(ts => ts.status === 'Approved');
  
  // Group timesheets by week ending date and job
  const groupedTimesheets = {};
  approvedTimesheets.forEach(ts => {
    const key = `${ts.weekEnding}-${ts.jobId}`;
    if (!groupedTimesheets[key]) {
      groupedTimesheets[key] = [];
    }
    groupedTimesheets[key].push(ts);
  });
  
  // Generate paychecks for each group
  const paychecks = [];
  let id = 1;
  
  Object.entries(groupedTimesheets).forEach(([key, timesheetGroup]) => {
    // Use the first timesheet in the group for job details
    const firstTimesheet = timesheetGroup[0];
    const weekEndingDate = new Date(firstTimesheet.weekEnding);
    const payDate = new Date(weekEndingDate);
    payDate.setDate(weekEndingDate.getDate() + 5); // Pay 5 days after week ending
    
    // Calculate total hours and amount
    const totalHours = timesheetGroup.reduce((sum, ts) => sum + (ts.totalHours || 40), 0);
    const hourlyRate = 25; // Assuming $25/hour
    const amount = totalHours * hourlyRate;
    
    // Find job details
    const job = firstTimesheet.jobTitle || 'Senior Software Engineer';
    
    paychecks.push({
      id: id++,
      period: getWeekRangeFromEndDate(firstTimesheet.weekEnding),
      amount: `$${amount.toFixed(2)}`,
      status: 'Paid',
      date: formatDateToISO(payDate),
      jobTitle: job,
      timesheetIds: timesheetGroup.map(ts => ts.id),
      weekEnding: firstTimesheet.weekEnding
    });
  });
  
  return paychecks;
};

// Sample data to initialize paychecks
export const initializeSamplePaychecks = () => {
  const existingPaychecks = getPaychecks();
  
  if (existingPaychecks.length > 0) {
    return existingPaychecks;
  }
  
  // Try to generate paychecks from timesheets
  const timesheetPaychecks = generatePaychecksFromTimesheets();
  if (timesheetPaychecks.length > 0) {
    localStorage.setItem('userPaychecks', JSON.stringify(timesheetPaychecks));
    return timesheetPaychecks;
  }
  
  // If no timesheets, use sample data
  const currentDate = new Date();
  const samplePaychecks = [];
  
  // Generate 5 weekly paychecks going backward from current date
  for (let i = 0; i < 5; i++) {
    const weekEndDate = new Date(currentDate);
    weekEndDate.setDate(currentDate.getDate() - (i * 7));
    
    const payDate = new Date(weekEndDate);
    payDate.setDate(weekEndDate.getDate() + 5); // Pay 5 days after week ending
    
    const weekStartDate = new Date(weekEndDate);
    weekStartDate.setDate(weekEndDate.getDate() - 6);
    
    samplePaychecks.push({
      id: 5 - i,
      period: getWeekRangeFromEndDate(formatDateToISO(weekEndDate)),
      amount: '$1,250.00',
      status: 'Paid',
      date: formatDateToISO(payDate),
      jobTitle: 'Senior Software Engineer',
      weekEnding: formatDateToISO(weekEndDate)
    });
  }
  
  localStorage.setItem('userPaychecks', JSON.stringify(samplePaychecks));
  return samplePaychecks;
};