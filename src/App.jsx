import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import './App.css';
import Profile from './components/Profile';
import Jobs from './components/Jobs';
import VerifiedAccount from './components/VerifiedAccount';
import VerifyAccount from './components/VerifyAccount';
import HomePage from './components/Homepage';
import ProfilePage from './components/Profile1';
import JobPostingPage from './components/JobPostingScreen'; 
import JobEditScreen from './components/JobEditScreen';
import TimeSheetEntry from "./components/TimeSheetEntry";
import TimeSheetList from "./components/TimeSheetList";
import TimeSheetApproval from "./components/TimeSheetApproval";
import JobDetailsPage from './components/JobDetailsPage';
import WelcomeJobPage from './components/WelcomeJobPage';
import RolesAndResponsibilities from './components/RolesAndResponsibilities';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import NotificationTest from './components/NotificationTest';

// Employer components
import EmployerLogin from './components/EmployerLogin';
import EmployerDashboard from './components/EmployerDashboard';
import EmployerJobManagement from './components/EmployerJobManagement';
import EmployerJobApplicants from './components/EmployerJobApplicants';

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Notification Context
import { NotificationProvider } from './context/NotificationContext';

// Protected Route Component
const ProtectedRoute = ({ element, requiredUserType }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If a specific user type is required, check it
  if (requiredUserType && currentUser.userType !== requiredUserType) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EmployerLogin />} />
      <Route path="/login" element={<EmployerLogin />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
      <Route path="/verified-account" element={<VerifiedAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/user-profile" element={<ProtectedRoute element={<UserProfile />} />} />
      <Route path="/jobs" element={<ProtectedRoute element={<Jobs />} />} />
      <Route path="/jobs/:id" element={<ProtectedRoute element={<JobDetailsPage />} />} />
      <Route path="/welcome-job/:id" element={<ProtectedRoute element={<WelcomeJobPage />} />} />
      <Route path="/roles-and-responsibilities/:id" element={<ProtectedRoute element={<RolesAndResponsibilities />} />} />
      <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="/profilePage" element={<ProtectedRoute element={<ProfilePage />} />} />
      <Route path="/jobPostingPage" element={<ProtectedRoute element={<JobPostingPage />} />} />
      <Route path="/timesheet/new" element={<ProtectedRoute element={<TimeSheetEntry />} />} />
      <Route path="/timesheet/new/:id" element={<ProtectedRoute element={<TimeSheetEntry />} />} />
      <Route path="/timesheet/list" element={<ProtectedRoute element={<TimeSheetList />} />} />
      <Route path="/timesheet/edit/:id" element={<ProtectedRoute element={<TimeSheetEntry />} />} />
      <Route path="/timesheet/view/:id" element={<ProtectedRoute element={<TimeSheetList />} />} />    
      <Route path="/timesheet/approval" element={<ProtectedRoute element={<TimeSheetApproval />} />} />
      <Route path="/notification-test" element={<ProtectedRoute element={<NotificationTest />} />} />

      {/* Employer Routes */}
      <Route path="/employer-dashboard" element={<ProtectedRoute element={<EmployerDashboard />} requiredUserType="employer" />} />
      <Route path="/employer-job-management" element={<ProtectedRoute element={<EmployerJobManagement />} requiredUserType="employer" />} />
      <Route path="/employer-job-applicants/:jobId" element={<ProtectedRoute element={<EmployerJobApplicants />} requiredUserType="employer" />} />
      <Route path="/employer-job-posting" element={<ProtectedRoute element={<JobPostingPage />} requiredUserType="employer" />} />
      <Route path="/employer-job-edit/:id" element={<ProtectedRoute element={<JobEditScreen />} requiredUserType="employer" />} />
    </Routes>
  );
}

function App() {
  return (  
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div  className="App min-h-screen bg-gradient-to-r from-red-100 via-blue-100 to-white text-slate-800">
            <AppRoutes />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;