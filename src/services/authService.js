/**
 * Authentication Service
 * Handles user registration, login, password reset, and session management using localStorage
 */

// User types
const USER_TYPES = {
  JOB_SEEKER: 'jobseeker',
  EMPLOYER: 'employer'
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.userType - Type of user (jobseeker or employer)
 * @returns {Object} - Registration result with success status and message
 */
export const registerUser = (userData) => {
  try {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(user => user.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Create new user object (excluding password for security)
    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      userType: userData.userType,
      createdAt: new Date().toISOString()
    };
    
    // Store user data
    users.push({...newUser, password: userData.password});
    localStorage.setItem('users', JSON.stringify(users));
    
    return { 
      success: true, 
      message: 'Registration successful', 
      user: newUser 
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Object} - Login result with success status and user data
 */
export const loginUser = (credentials) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      user => user.email === credentials.email && user.password === credentials.password
    );
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Create session
    const session = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      loggedInAt: new Date().toISOString()
    };
    
    // Store session in localStorage
    localStorage.setItem('currentUser', JSON.stringify(session));
    
    // Store individual fields for easier access
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userFirstName', user.firstName);
    localStorage.setItem('userLastName', user.lastName);
    localStorage.setItem('userRole', user.userType);
    
    return { 
      success: true, 
      message: 'Login successful', 
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

/**
 * Get the current logged in user
 * @returns {Object|null} - Current user data or null if not logged in
 */
export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    
    // Ensure individual fields are set
    if (user) {
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userFirstName', user.firstName || '');
      localStorage.setItem('userLastName', user.lastName || '');
      localStorage.setItem('userRole', user.userType || '');
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userRole');
};

/**
 * Request a password reset for a user
 * @param {string} email - User's email address
 * @returns {Object} - Result with success status, message, and token (if successful)
 */
export const requestPasswordReset = (email) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.email === email);
    
    if (!user) {
      // For security reasons, don't reveal if the email exists or not
      return { 
        success: true, 
        message: 'If your email is registered, you will receive a password reset link.' 
      };
    }
    
    // Generate a reset token (in a real app, this would be a secure random token)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Set token expiration (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Store the reset token
    const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
    resetTokens[token] = {
      userId: user.id,
      email: user.email,
      expiresAt: expiresAt.toISOString()
    };
    localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
    
    // In a real app, we would send an email here
    // For demo purposes, we'll return the token
    return { 
      success: true, 
      message: 'If your email is registered, you will receive a password reset link.',
      token: token // Only for demo purposes
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, message: 'Password reset request failed. Please try again.' };
  }
};

/**
 * Validate a password reset token
 * @param {string} token - The reset token to validate
 * @returns {Object} - Result with success status, message, and user email (if successful)
 */
export const validateResetToken = (token) => {
  try {
    const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
    const tokenData = resetTokens[token];
    
    if (!tokenData) {
      return { success: false, message: 'Invalid or expired reset token.' };
    }
    
    // Check if token is expired
    const expiresAt = new Date(tokenData.expiresAt);
    if (expiresAt < new Date()) {
      // Remove expired token
      delete resetTokens[token];
      localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
      return { success: false, message: 'Reset token has expired. Please request a new one.' };
    }
    
    return { 
      success: true, 
      message: 'Token is valid.',
      email: tokenData.email
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { success: false, message: 'Token validation failed. Please try again.' };
  }
};

/**
 * Reset a user's password using a valid token
 * @param {string} token - The reset token
 * @param {string} newPassword - The new password
 * @returns {Object} - Result with success status and message
 */
export const resetPassword = (token, newPassword) => {
  try {
    // Validate the token first
    const validation = validateResetToken(token);
    if (!validation.success) {
      return validation;
    }
    
    // Get the user data
    const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
    const tokenData = resetTokens[token];
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.email === tokenData.email);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found.' };
    }
    
    // Update the password
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Remove the used token
    delete resetTokens[token];
    localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
    
    return { success: true, message: 'Password has been reset successfully.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: 'Password reset failed. Please try again.' };
  }
};

export { USER_TYPES };