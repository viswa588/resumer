/**
 * Tests for the authentication service
 * Focus on password reset functionality
 */

import { 
  registerUser, 
  loginUser, 
  requestPasswordReset, 
  validateResetToken, 
  resetPassword 
} from './authService';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    getStore: () => store
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Authentication Service - Password Reset', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // Test user registration
  test('should register a new user', () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      userType: 'jobseeker'
    };

    const result = registerUser(userData);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Registration successful');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  // Test password reset request
  test('should create a reset token for a registered user', () => {
    // Register a user first
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      userType: 'jobseeker'
    };
    registerUser(userData);

    // Request password reset
    const result = requestPasswordReset('john@example.com');
    expect(result.success).toBe(true);
    expect(result.message).toBe('If your email is registered, you will receive a password reset link.');
    expect(result.token).toBeDefined();
    expect(localStorage.setItem).toHaveBeenCalledWith('resetTokens', expect.any(String));
  });

  // Test password reset request for non-existent user
  test('should handle password reset request for non-existent user', () => {
    const result = requestPasswordReset('nonexistent@example.com');
    expect(result.success).toBe(true); // Still returns success for security reasons
    expect(result.message).toBe('If your email is registered, you will receive a password reset link.');
    expect(result.token).toBeUndefined();
  });

  // Test token validation
  test('should validate a valid token', () => {
    // Register a user first
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      userType: 'jobseeker'
    };
    registerUser(userData);

    // Request password reset and get token
    const resetResult = requestPasswordReset('john@example.com');
    const token = resetResult.token;

    // Validate token
    const validationResult = validateResetToken(token);
    expect(validationResult.success).toBe(true);
    expect(validationResult.email).toBe('john@example.com');
  });

  // Test invalid token validation
  test('should reject an invalid token', () => {
    const validationResult = validateResetToken('invalid-token');
    expect(validationResult.success).toBe(false);
    expect(validationResult.message).toBe('Invalid or expired reset token.');
  });

  // Test password reset
  test('should reset password with valid token', () => {
    // Register a user first
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      userType: 'jobseeker'
    };
    registerUser(userData);

    // Request password reset and get token
    const resetResult = requestPasswordReset('john@example.com');
    const token = resetResult.token;

    // Reset password
    const newPassword = 'newpassword456';
    const resetPasswordResult = resetPassword(token, newPassword);
    expect(resetPasswordResult.success).toBe(true);
    expect(resetPasswordResult.message).toBe('Password has been reset successfully.');

    // Try to login with new password
    const loginResult = loginUser({
      email: 'john@example.com',
      password: newPassword
    });
    expect(loginResult.success).toBe(true);
  });

  // Test password reset with invalid token
  test('should reject password reset with invalid token', () => {
    const resetPasswordResult = resetPassword('invalid-token', 'newpassword');
    expect(resetPasswordResult.success).toBe(false);
    expect(resetPasswordResult.message).toBe('Invalid or expired reset token.');
  });

  // Test token is removed after use
  test('should remove token after successful password reset', () => {
    // Register a user first
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      userType: 'jobseeker'
    };
    registerUser(userData);

    // Request password reset and get token
    const resetResult = requestPasswordReset('john@example.com');
    const token = resetResult.token;

    // Reset password
    resetPassword(token, 'newpassword456');

    // Try to use the token again
    const secondResetResult = resetPassword(token, 'anotherpassword');
    expect(secondResetResult.success).toBe(false);
    expect(secondResetResult.message).toBe('Invalid or expired reset token.');
  });
});