// applicationService.js
// This service handles job applications and approvals

/**
 * Get all job applications
 * @returns {Array} Array of job applications
 */
export const getJobApplications = () => {
  return JSON.parse(localStorage.getItem('jobApplications') || '[]');
};

/**
 * Get job applications for a specific job
 * @param {number} jobId - The job ID
 * @returns {Array} Array of job applications for the job
 */
export const getJobApplicationsByJob = (jobId) => {
  const applications = getJobApplications();
  return applications.filter(app => app.jobId === jobId);
};

/**
 * Get job applications for a specific user
 * @param {string} userId - The user ID or email
 * @returns {Array} Array of job applications for the user
 */
export const getJobApplicationsByUser = (userId) => {
  const applications = getJobApplications();
  return applications.filter(app => app.userId === userId || app.userEmail === userId);
};

/**
 * Submit a job application
 * @param {Object} application - The application object
 * @returns {Object} The created application
 */
export const submitJobApplication = (application) => {
  const applications = getJobApplications();
  
  // Check if application already exists
  const existingApp = applications.find(
    app => app.jobId === application.jobId && 
           (app.userId === application.userId || app.userEmail === application.userEmail)
  );
  
  if (existingApp) {
    return { success: false, message: 'You have already applied for this job' };
  }
  
  // Create new application with pending status
  const newApplication = {
    ...application,
    id: Date.now(),
    status: 'pending',
    appliedDate: new Date().toISOString(),
    approved: false
  };
  
  // Save to localStorage
  localStorage.setItem('jobApplications', JSON.stringify([...applications, newApplication]));
  
  // Update applied jobs list
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  if (!appliedJobs.includes(application.jobId)) {
    localStorage.setItem('appliedJobs', JSON.stringify([...appliedJobs, application.jobId]));
  }
  
  return { success: true, application: newApplication };
};

/**
 * Approve a job application
 * @param {number} applicationId - The application ID
 * @returns {Object} Result of the operation
 */
export const approveJobApplication = (applicationId) => {
  const applications = getJobApplications();
  const appIndex = applications.findIndex(app => app.id === applicationId);
  
  if (appIndex === -1) {
    return { success: false, message: 'Application not found' };
  }
  
  // Update application status
  applications[appIndex] = {
    ...applications[appIndex],
    status: 'approved',
    approved: true,
    approvedDate: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem('jobApplications', JSON.stringify(applications));
  
  // Update job offer statuses
  const jobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
  jobOfferStatuses[applications[appIndex].jobId] = 'accepted';
  localStorage.setItem('jobOfferStatuses', JSON.stringify(jobOfferStatuses));
  
  // Add notifications directly to localStorage
  const userEmail = applications[appIndex].userEmail;
  const jobTitle = applications[appIndex].jobTitle;
  const company = applications[appIndex].companyName;
  
  // Add alert notification
  const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  alerts.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'job-offer',
    title: 'Job Application Approved',
    message: `Congratulations! Your application for ${jobTitle} at ${company} has been approved.`,
    jobId: applications[appIndex].jobId
  });
  localStorage.setItem('userAlerts', JSON.stringify(alerts));
  
  // Add email notification
  const emails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  emails.unshift({
    id: Date.now() + 1,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'job-offer',
    subject: `Job Application Approved: ${jobTitle}`,
    from: `${company} <hr@${company.toLowerCase().replace(/\s+/g, '')}.com>`,
    message: `Congratulations! Your application for the ${jobTitle} position at ${company} has been approved. You can now submit timesheets for this position.`,
    jobId: applications[appIndex].jobId
  });
  localStorage.setItem('userEmails', JSON.stringify(emails));
  
  return { success: true, application: applications[appIndex] };
};

/**
 * Reject a job application
 * @param {number} applicationId - The application ID
 * @returns {Object} Result of the operation
 */
export const rejectJobApplication = (applicationId) => {
  const applications = getJobApplications();
  const appIndex = applications.findIndex(app => app.id === applicationId);
  
  if (appIndex === -1) {
    return { success: false, message: 'Application not found' };
  }
  
  // Update application status
  applications[appIndex] = {
    ...applications[appIndex],
    status: 'rejected',
    approved: false,
    rejectedDate: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem('jobApplications', JSON.stringify(applications));
  
  // Add notifications directly to localStorage
  const userEmail = applications[appIndex].userEmail;
  const jobTitle = applications[appIndex].jobTitle;
  const company = applications[appIndex].companyName;
  
  // Add alert notification
  const alerts = JSON.parse(localStorage.getItem('userAlerts') || '[]');
  alerts.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    type: 'job-rejection',
    title: 'Job Application Rejected',
    message: `We're sorry, but your application for ${jobTitle} at ${company} has been rejected.`,
    jobId: applications[appIndex].jobId
  });
  localStorage.setItem('userAlerts', JSON.stringify(alerts));
  
  // Add email notification
  const emails = JSON.parse(localStorage.getItem('userEmails') || '[]');
  emails.unshift({
    id: Date.now() + 1,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'job-rejection',
    subject: `Job Application Status: ${jobTitle}`,
    from: `${company} <hr@${company.toLowerCase().replace(/\s+/g, '')}.com>`,
    message: `Thank you for your interest in the ${jobTitle} position at ${company}. After careful consideration, we have decided to pursue other candidates whose qualifications better match our current needs.`,
    jobId: applications[appIndex].jobId
  });
  localStorage.setItem('userEmails', JSON.stringify(emails));
  
  return { success: true, application: applications[appIndex] };
};

/**
 * Check if a user has any approved job applications
 * @param {string} userId - The user ID or email
 * @returns {boolean} True if user has approved applications
 */
export const hasApprovedApplications = (userId) => {
  const applications = getJobApplicationsByUser(userId);
  return applications.some(app => app.approved === true);
};

/**
 * Get all approved jobs for a user
 * @param {string} userId - The user ID or email
 * @returns {Array} Array of approved job IDs
 */
export const getApprovedJobIds = (userId) => {
  const applications = getJobApplicationsByUser(userId);
  return applications
    .filter(app => app.approved === true)
    .map(app => app.jobId);
};