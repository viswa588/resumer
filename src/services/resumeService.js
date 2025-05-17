/**
 * Save resume data for a user
 * @param {string} userEmail - User's email
 * @param {string} resumeData - Base64 encoded resume data
 * @param {string} fileName - Resume file name
 */
export const saveResume = (userEmail, resumeData, fileName) => {
  try {
    // Save to user-specific storage
    localStorage.setItem('userResume', resumeData);
    localStorage.setItem('userResumeFileName', fileName);
    
    // Also save to central storage for employer access
    const userResumes = JSON.parse(localStorage.getItem('userResumes') || '{}');
    userResumes[userEmail] = resumeData;
    localStorage.setItem('userResumes', JSON.stringify(userResumes));
    
    // Save file name
    const resumeFileNames = JSON.parse(localStorage.getItem('resumeFileNames') || '{}');
    resumeFileNames[userEmail] = fileName;
    localStorage.setItem('resumeFileNames', JSON.stringify(resumeFileNames));
    
    return true;
  } catch (error) {
    console.error('Error saving resume:', error);
    return false;
  }
};

/**
 * Get resume data for a user
 * @param {string} userEmail - User's email
 * @returns {Object} Resume data and file name
 */
export const getResume = (userEmail) => {
  try {
    // Try to get from central storage first
    const userResumes = JSON.parse(localStorage.getItem('userResumes') || '{}');
    const resumeFileNames = JSON.parse(localStorage.getItem('resumeFileNames') || '{}');
    
    if (userResumes[userEmail]) {
      return {
        resumeData: userResumes[userEmail],
        fileName: resumeFileNames[userEmail] || 'resume.pdf'
      };
    }
    
    // Fall back to user-specific storage
    return {
      resumeData: localStorage.getItem('userResume'),
      fileName: localStorage.getItem('userResumeFileName') || 'resume.pdf'
    };
  } catch (error) {
    console.error('Error getting resume:', error);
    return { resumeData: null, fileName: null };
  }
};

/**
 * Delete resume data for a user
 * @param {string} userEmail - User's email
 */
export const deleteResume = (userEmail) => {
  try {
    // Remove from user-specific storage
    localStorage.removeItem('userResume');
    localStorage.removeItem('userResumeFileName');
    
    // Remove from central storage
    const userResumes = JSON.parse(localStorage.getItem('userResumes') || '{}');
    const resumeFileNames = JSON.parse(localStorage.getItem('resumeFileNames') || '{}');
    
    delete userResumes[userEmail];
    delete resumeFileNames[userEmail];
    
    localStorage.setItem('userResumes', JSON.stringify(userResumes));
    localStorage.setItem('resumeFileNames', JSON.stringify(resumeFileNames));
    
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
};