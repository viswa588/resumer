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