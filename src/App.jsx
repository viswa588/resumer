import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import './App.css';
import Profile from './components/Profile';
import Jobs from './components/Jobs';
import VerifiedAccount from './components/VerifiedAccount';
import VerifyAccount from './components/VerifyAccount';
import HomePage from './components/Homepage';

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/verified-account" element={<VerifiedAccount />} />
          <Route path="/forgot-password" element={<div>Forgot Password</div>} />
          <Route path="/reset-password" element={<div>Reset Password</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="home" element={<HomePage />} />
        </Routes>
     
      </div>
     
    </Router>
  );
}

export default App
