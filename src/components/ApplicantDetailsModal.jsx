import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { FaFilePdf, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const ApplicantDetailsModal = ({ isOpen, onClose, application }) => {
  const [resume, setResume] = useState(null);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    about: ''
  });

  useEffect(() => {
    if (application && isOpen) {
      // Get user details from localStorage based on email
      const userEmail = application.userEmail;
      
      // Try to find user details in localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = allUsers.find(u => u.email === userEmail);
      
      if (user) {
        setUserDetails({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          about: user.about || ''
        });
      } else {
        // Set default values from application
        setUserDetails({
          firstName: application.name ? application.name.split(' ')[0] : '',
          lastName: application.name ? application.name.split(' ').slice(1).join(' ') : '',
          email: application.userEmail || '',
          phone: application.phone || '',
          about: ''
        });
      }
      
      // Try to get resume from localStorage
      const userResumes = JSON.parse(localStorage.getItem('userResumes') || '{}');
      if (userResumes[userEmail]) {
        setResume(userResumes[userEmail]);
      } else {
        setResume(null);
      }
    }
  }, [application, isOpen]);

  const handleViewResume = () => {
    if (resume) {
      const newWindow = window.open();
      newWindow.document.write(`
        <iframe src="${resume}" width="100%" height="100%" style="border: none;"></iframe>
      `);
    }
  };

  if (!application) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Applicant Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaUser className="text-blue-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userDetails.firstName} {userDetails.lastName}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaEnvelope className="text-blue-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userDetails.email}</p>
                </div>
              </div>
              
              {userDetails.phone && (
                <div className="flex items-start">
                  <FaPhone className="text-blue-500 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userDetails.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Applied Date</p>
                  <p className="font-medium">{new Date(application.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {userDetails.about && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{userDetails.about}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Application Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaFileAlt className="text-blue-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{application.jobTitle}</p>
                </div>
              </div>
              
              {application.coverLetter && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 p-3 rounded-md text-gray-700">
                    {application.coverLetter}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Resume</h4>
                {resume ? (
                  <div className="flex items-center">
                    <FaFilePdf className="text-red-500 mr-2" />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewResume}
                      className="text-blue-600"
                    >
                      View Resume
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No resume available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantDetailsModal;