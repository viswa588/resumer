# Authentication System Documentation

This document provides an overview of the authentication system implemented in this application. The system allows for user registration and login for both job seekers and employers, with data stored in localStorage.

## Features

- User registration with validation
- User login with validation
- Role-based access (Job Seeker vs Employer)
- Protected routes based on authentication status
- User session management
- Profile viewing

## Technical Implementation

### Authentication Service

The core of the authentication system is in `src/services/authService.js`. This service provides:

- `registerUser()`: Register new users with validation
- `loginUser()`: Authenticate users
- `getCurrentUser()`: Get the currently logged-in user
- `logoutUser()`: Log out the current user

### Data Storage

User data is stored in localStorage with two main keys:

- `users`: Array of registered users (with passwords)
- `currentUser`: Object containing the current logged-in user's session

### Components

1. **Registration Component** (`src/components/Registration.jsx`)
   - Form for user registration
   - User type selection (Job Seeker or Employer)
   - Form validation
   - Success/error handling

2. **Login Components**
   - General login (`src/components/Login.jsx`)
   - Employer-focused login (`src/components/EmployerLogin.jsx`)
   - Form validation
   - User type selection

3. **User Profile** (`src/components/UserProfile.jsx`)
   - Display user information
   - Logout functionality

### Authentication Context

The `AuthContext` (`src/context/AuthContext.jsx`) provides application-wide access to:

- Current user data
- Authentication status
- Logout functionality

### Protected Routes

Routes requiring authentication are wrapped in a `ProtectedRoute` component that redirects unauthenticated users to the login page.

## How to Use

### Registration

1. Navigate to `/register`
2. Select user type (Job Seeker or Employer)
3. Fill in required information
4. Submit the form
5. Upon successful registration, you'll be redirected to the login page

### Login

1. Navigate to `/login` or `/`
2. Enter your email and password
3. Select your user type
4. Click "LOG IN"
5. Upon successful login:
   - Job Seekers are redirected to `/home`
   - Employers are redirected to `/employer-dashboard`

### Viewing Profile

1. After logging in, navigate to `/user-profile`
2. View your account information
3. Use the logout button to end your session

### Protected Content

- Attempting to access protected routes while not logged in will redirect to the login page
- Employer-specific routes are only accessible to users registered as employers

## Testing

Tests for the authentication service are available in `src/services/authService.test.js`. Run them using:

```
npm test
```

## Security Notes

This implementation uses localStorage for simplicity and demonstration purposes. In a production environment:

1. **Never store passwords in localStorage**
2. Use secure HTTP-only cookies for session management
3. Implement proper password hashing
4. Use HTTPS for all communications
5. Consider implementing token-based authentication (JWT)
6. Add rate limiting for login attempts

## Future Improvements

- Password reset functionality
- Email verification
- Two-factor authentication
- Session timeout
- Account management (update profile, change password)