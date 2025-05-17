// jobService.js
// This service handles job posting and application tracking

/**
 * Get all jobs
 * @returns {Array} Array of job objects
 */
export const getAllJobs = () => {
  return JSON.parse(localStorage.getItem('jobs') || '[]');
};

/**
 * Get jobs posted by a specific employer
 * @param {string} employerEmail - The employer's email
 * @returns {Array} Array of job objects
 */
export const getEmployerJobs = (employerEmail) => {
  const jobs = getAllJobs();
  return jobs.filter(job => job.employerEmail === employerEmail);
};

/**
 * Get job by ID
 * @param {number} jobId - The job ID
 * @returns {Object|null} Job object or null if not found
 */
export const getJobById = (jobId) => {
  const jobs = getAllJobs();
  return jobs.find(job => job.id === jobId) || null;
};

/**
 * Create a new job posting
 * @param {Object} jobData - The job data
 * @returns {Object} The created job
 */
export const createJob = (jobData) => {
  const jobs = getAllJobs();
  
  // Create new job with ID and default values
  const newJob = {
    ...jobData,
    id: Date.now(),
    postedDate: new Date().toISOString(),
    status: 'active',
    applicants: 0
  };
  
  // Save to localStorage
  localStorage.setItem('jobs', JSON.stringify([...jobs, newJob]));
  
  return newJob;
};

/**
 * Update an existing job
 * @param {number} jobId - The job ID
 * @param {Object} jobData - The updated job data
 * @returns {Object} Result of the operation
 */
export const updateJob = (jobId, jobData) => {
  const jobs = getAllJobs();
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    return { success: false, message: 'Job not found' };
  }
  
  // Update job
  jobs[jobIndex] = { ...jobs[jobIndex], ...jobData };
  
  // Save to localStorage
  localStorage.setItem('jobs', JSON.stringify(jobs));
  
  return { success: true, job: jobs[jobIndex] };
};

/**
 * Delete a job
 * @param {number} jobId - The job ID
 * @returns {Object} Result of the operation
 */
export const deleteJob = (jobId) => {
  const jobs = getAllJobs();
  const updatedJobs = jobs.filter(job => job.id !== jobId);
  
  if (updatedJobs.length === jobs.length) {
    return { success: false, message: 'Job not found' };
  }
  
  // Save to localStorage
  localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  
  return { success: true };
};

/**
 * Apply for a job
 * @param {number} jobId - The job ID
 * @param {string} userEmail - The applicant's email
 * @returns {Object} Result of the operation
 */
export const applyForJob = (jobId, userEmail) => {
  const jobs = getAllJobs();
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex === -1) {
    return { success: false, message: 'Job not found' };
  }
  
  // Increment applicant count
  jobs[jobIndex].applicants = (jobs[jobIndex].applicants || 0) + 1;
  
  // Save to localStorage
  localStorage.setItem('jobs', JSON.stringify(jobs));
  
  // Add to applied jobs for the user
  const appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${userEmail}`) || '[]');
  if (!appliedJobs.includes(jobId)) {
    localStorage.setItem(`appliedJobs_${userEmail}`, JSON.stringify([...appliedJobs, jobId]));
  }
  
  return { success: true, job: jobs[jobIndex] };
};

/**
 * Get application count for a job
 * @param {number} jobId - The job ID
 * @returns {number} Number of applications
 */
export const getApplicationCount = (jobId) => {
  const job = getJobById(jobId);
  return job ? job.applicants || 0 : 0;
};

/**
 * Initialize sample jobs data
 */
export const initializeSampleJobs = () => {
  const existingJobs = getAllJobs();
  
  if (existingJobs.length === 0) {
    const sampleJobs = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Innovations Inc.",
        location: "San Francisco, CA",
        employerEmail: "employer@re.com",
        description: "We are looking for a skilled Frontend Developer to join our team.",
        requirements: "3+ years of experience with React, JavaScript, and modern frontend frameworks.",
        salary: "$90,000 - $120,000",
        postedDate: new Date().toISOString(),
        status: "active",
        applicants: 3
      },
      {
        id: 2,
        title: "Backend Developer",
        company: "Tech Innovations Inc.",
        location: "San Francisco, CA",
        employerEmail: "employer@re.com",
        description: "Seeking an experienced Backend Developer to build robust server-side applications.",
        requirements: "Experience with Node.js, Express, and database management systems.",
        salary: "$95,000 - $125,000",
        postedDate: new Date().toISOString(),
        status: "active",
        applicants: 2
      },
      {
        id: 3,
        title: "UX Designer",
        company: "Tech Innovations Inc.",
        location: "Remote",
        employerEmail: "employer@re.com",
        description: "Join our design team to create intuitive and engaging user experiences.",
        requirements: "Portfolio demonstrating UX design skills and experience with design tools.",
        salary: "$85,000 - $110,000",
        postedDate: new Date().toISOString(),
        status: "active",
        applicants: 5
      }
    ];
    
    localStorage.setItem('jobs', JSON.stringify(sampleJobs));
    return sampleJobs;
  }
  
  return existingJobs;
};