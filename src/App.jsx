import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import JobSeekerLogin from './components/JobSeekerLogin';
import JobSeekerRegistration from './components/JobSeekerRegistration';
import EmployerRegistration from './components/EmployerRegistration';
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



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<JobSeekerLogin />} />
      <Route path="/employer-login" element={<EmployerLogin />} />
      <Route path="/register" element={<JobSeekerRegistration />} />
      <Route path="/employer-registration" element={<EmployerRegistration />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
      <Route path="/verified-account" element={<VerifiedAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Job Seeker Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/welcome-job/:id" element={<WelcomeJobPage />} />
      <Route path="/roles-and-responsibilities/:id" element={<RolesAndResponsibilities />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profilePage" element={<ProfilePage />} />
      <Route path="/timesheet/new" element={<TimeSheetEntry />} />
      <Route path="/timesheet/new/:id" element={<TimeSheetEntry />} />
      <Route path="/timesheet/list" element={<TimeSheetList />} />
      <Route path="/timesheet/edit/:id" element={<TimeSheetEntry />} />
      <Route path="/timesheet/view/:id" element={<TimeSheetList />} />    
      <Route path="/notification-test" element={<NotificationTest />} />

      {/* Employer Routes */}
      <Route path="/employer-dashboard" element={<EmployerDashboard />} />
      <Route path="/employer-job-management" element={<EmployerJobManagement />} />
      <Route path="/employer-job-applicants/:jobId" element={<EmployerJobApplicants />} />
      <Route path="/employer-job-posting" element={<JobPostingPage />} />
      <Route path="/employer-job-edit/:id" element={<JobEditScreen />} />
      <Route path="/timesheet/approval" element={<TimeSheetApproval />} />
    </Routes>
  );
}

function App() {
  return (  
    <Router> 
      <AuthProvider>
        <NotificationProvider>
          <div className="App min-h-screen bg-gradient-to-r from-red-100 via-blue-100 to-white text-slate-800">
            <AppRoutes />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;