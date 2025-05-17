// userService.js
// This service handles user profile data

/**
 * Get current user data
 * @returns {Object} User data object
 */
export const getCurrentUser = () => {
  const email = localStorage.getItem('userEmail') || '';
  const firstName = localStorage.getItem('userFirstName') || '';
  const lastName = localStorage.getItem('userLastName') || '';
  const role = localStorage.getItem('userRole') || '';
  
  return {
    email,
    firstName,
    lastName,
    fullName: firstName && lastName ? `${firstName} ${lastName}` : email.split('@')[0],
    role
  };
};

/**
 * Save user profile data
 * @param {Object} userData - User data to save
 * @returns {boolean} Success status
 */
export const saveUserProfile = (userData) => {
  try {
    if (userData.firstName) localStorage.setItem('userFirstName', userData.firstName);
    if (userData.lastName) localStorage.setItem('userLastName', userData.lastName);
    if (userData.email) localStorage.setItem('userEmail', userData.email);
    if (userData.role) localStorage.setItem('userRole', userData.role);
    if (userData.about) localStorage.setItem('userAbout', userData.about);
    
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

/**
 * Get user profile data
 * @returns {Object} User profile data
 */
export const getUserProfile = () => {
  return {
    firstName: localStorage.getItem('userFirstName') || '',
    lastName: localStorage.getItem('userLastName') || '',
    email: localStorage.getItem('userEmail') || '',
    role: localStorage.getItem('userRole') || '',
    about: localStorage.getItem('userAbout') || ''
  };
};

/**
 * Initialize user data for demo purposes
 */
export const initializeUserData = () => {
  const email = localStorage.getItem('userEmail');
  
  if (email === 'student@re.com') {
    // Initialize job seeker data
    if (!localStorage.getItem('userFirstName')) {
      localStorage.setItem('userFirstName', 'John');
      localStorage.setItem('userLastName', 'Student');
      localStorage.setItem('userRole', 'jobSeeker');
      localStorage.setItem('userAbout', 'I am a passionate job seeker looking for opportunities in software development.');
    }
  } else if (email === 'employer@re.com') {
    // Initialize employer data
    if (!localStorage.getItem('userFirstName')) {
      localStorage.setItem('userFirstName', 'Jane');
      localStorage.setItem('userLastName', 'Employer');
      localStorage.setItem('userRole', 'employer');
      localStorage.setItem('userAbout', 'HR Manager at Tech Innovations Inc. with 10+ years of experience in talent acquisition.');
    }
  }
};