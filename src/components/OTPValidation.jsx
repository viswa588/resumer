import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OTPValidation = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Replace this with your actual OTP validation API call
      const response = await validateOTP(otp);
      
      if (response.success) {
        // Navigate to profile page after successful OTP validation
        navigate('/profile');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP validation error:', error);
      alert('Error validating OTP. Please try again.');
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
        <form onSubmit={handleOtpSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
              maxLength="6"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

// Mock function for OTP validation - replace with actual API call
const validateOTP = async (otp) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // For testing, consider OTP "123456" as valid
      resolve({ success: otp === "123456" });
    }, 1000);
  });
};

export default OTPValidation;