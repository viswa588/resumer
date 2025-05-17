import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { FaBuilding, FaUsers, FaFileAlt, FaClipboardList, FaCheck, FaTimes, FaSignOutAlt, FaUserTie, FaRegClock, FaCamera, FaEdit, FaSave } from 'react-icons/fa';
import { getJobApplications, approveJobApplication, rejectJobApplication } from '../services/applicationService';
import { getUserProfile, saveUserProfile } from '../services/userService';
import logo from '../assets/icon.png'; // Default logo

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    about: ''
  });
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Tech Innovations Inc.',
    industry: 'Information Technology',
    location: 'San Francisco, CA',
    employees: '50-200',
    founded: '2015',
    about: 'Tech Innovations Inc. is a leading technology company specializing in innovative software solutions for businesses of all sizes. Our mission is to transform how companies operate through cutting-edge technology and exceptional service. Founded in 2015, we have grown to become a trusted partner for over 500 businesses worldwide, with a team of dedicated professionals committed to delivering excellence.'
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    about: ''
  });
  const [editedCompany, setEditedCompany] = useState({
    name: '',
    industry: '',
    location: '',
    employees: '',
    founded: '',
    about: ''
  });

  useEffect(() => {
    // Load user profile
    const profile = getUserProfile();
    setUserProfile(profile);
    setEditedProfile(profile);
    
    // Load company info from localStorage if it exists
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      const parsedCompanyInfo = JSON.parse(savedCompanyInfo);
      setCompanyInfo(parsedCompanyInfo);
      setEditedCompany(parsedCompanyInfo);
    } else {
      setEditedCompany(companyInfo);
    }
    
    // Load company logo from localStorage if it exists
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
    
    // Load job applications
    const allApplications = getJobApplications();
    setApplications(allApplications);
    
    // Filter applications by status
    setPendingApplications(allApplications.filter(app => app.status === 'pending'));
    setApprovedApplications(allApplications.filter(app => app.status === 'approved'));
    setRejectedApplications(allApplications.filter(app => app.status === 'rejected'));
  }, []);

  const handleApprove = (applicationId) => {
    const result = approveJobApplication(applicationId);
    if (result.success) {
      // Update application lists
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: 'approved', approved: true } : app
      );
      setApplications(updatedApplications);
      setPendingApplications(updatedApplications.filter(app => app.status === 'pending'));
      setApprovedApplications(updatedApplications.filter(app => app.status === 'approved'));
      
      alert('Application approved successfully. The job seeker can now submit timesheets.');
    }
  };

  const handleReject = (applicationId) => {
    const result = rejectJobApplication(applicationId);
    if (result.success) {
      // Update application lists
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: 'rejected', approved: false } : app
      );
      setApplications(updatedApplications);
      setPendingApplications(updatedApplications.filter(app => app.status === 'pending'));
      setRejectedApplications(updatedApplications.filter(app => app.status === 'rejected'));
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const logoData = reader.result;
      setCompanyLogo(logoData);
      localStorage.setItem('companyLogo', logoData);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleSaveProfile = () => {
    // Save user profile
    saveUserProfile(editedProfile);
    setUserProfile(editedProfile);
    setEditingProfile(false);
  };

  const handleEditCompany = () => {
    setEditingCompany(true);
  };

  const handleSaveCompany = () => {
    // Save company info
    setCompanyInfo(editedCompany);
    localStorage.setItem('companyInfo', JSON.stringify(editedCompany));
    setEditingCompany(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userAbout');
    
    // Redirect to login page
    navigate('/employer-login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </Button>
        </div>
        
        {/* Employer and Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-4 rounded-full mr-4">
                    <FaUserTie className="text-blue-600 text-2xl" />
                  </div>
                  <h2 className="text-xl font-semibold">Employer Details</h2>
                </div>
                {!editingProfile ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={handleEditProfile}
                  >
                    <FaEdit className="mr-1" /> Edit
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-500 hover:text-green-700"
                    onClick={handleSaveProfile}
                  >
                    <FaSave className="mr-1" /> Save
                  </Button>
                )}
              </div>
              
              {!editingProfile ? (
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600 font-medium">Name:</p>
                  <p>{userProfile.firstName} {userProfile.lastName}</p>
                  
                  <p className="text-gray-600 font-medium">Email:</p>
                  <p>{userProfile.email}</p>
                  
                  <p className="text-gray-600 font-medium">Role:</p>
                  <p>HR Manager</p>
                  
                  <p className="text-gray-600 font-medium">About:</p>
                  <p className="col-span-2 mt-2">{userProfile.about}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">First Name</label>
                      <Input 
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Last Name</label>
                      <Input 
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Email</label>
                    <Input 
                      name="email"
                      value={editedProfile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">About</label>
                    <Textarea 
                      name="about"
                      value={editedProfile.about}
                      onChange={handleProfileChange}
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-4 rounded-full mr-4">
                    <FaBuilding className="text-green-600 text-2xl" />
                  </div>
                  <h2 className="text-xl font-semibold">Company Details</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {companyLogo ? (
                        <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
                      ) : (
                        <img src={logo} alt="Default Logo" className="w-10 h-10" />
                      )}
                    </div>
                    <label htmlFor="company-logo" className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600">
                      <FaCamera className="text-white text-xs" />
                      <input
                        type="file"
                        id="company-logo"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>
                  {!editingCompany ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-500 hover:text-blue-700"
                      onClick={handleEditCompany}
                    >
                      <FaEdit className="mr-1" /> Edit
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-500 hover:text-green-700"
                      onClick={handleSaveCompany}
                    >
                      <FaSave className="mr-1" /> Save
                    </Button>
                  )}
                </div>
              </div>
              
              {!editingCompany ? (
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600 font-medium">Company Name:</p>
                  <p>{companyInfo.name}</p>
                  
                  <p className="text-gray-600 font-medium">Industry:</p>
                  <p>{companyInfo.industry}</p>
                  
                  <p className="text-gray-600 font-medium">Location:</p>
                  <p>{companyInfo.location}</p>
                  
                  <p className="text-gray-600 font-medium">Employees:</p>
                  <p>{companyInfo.employees}</p>
                  
                  <p className="text-gray-600 font-medium">Founded:</p>
                  <p>{companyInfo.founded}</p>
                  
                  <p className="text-gray-600 font-medium col-span-2 mt-2">About Company:</p>
                  <p className="col-span-2 text-sm">{companyInfo.about}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 font-medium">Company Name</label>
                    <Input 
                      name="name"
                      value={editedCompany.name}
                      onChange={handleCompanyChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Industry</label>
                      <Input 
                        name="industry"
                        value={editedCompany.industry}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Location</label>
                      <Input 
                        name="location"
                        value={editedCompany.location}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Employees</label>
                      <Input 
                        name="employees"
                        value={editedCompany.employees}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Founded</label>
                      <Input 
                        name="founded"
                        value={editedCompany.founded}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">About Company</label>
                    <Textarea 
                      name="about"
                      value={editedCompany.about}
                      onChange={handleCompanyChange}
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-blue-100 p-4 rounded-full mr-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <h3 className="text-2xl font-bold">{applications.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <FaCheck className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <h3 className="text-2xl font-bold">{approvedApplications.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-yellow-100 p-4 rounded-full mr-4">
                <FaClipboardList className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <h3 className="text-2xl font-bold">{pendingApplications.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button 
            onClick={() => navigate('/employer-job-management')}
            className="bg-blue-500 hover:bg-blue-600 h-auto py-4"
          >
            <FaBuilding className="mr-2 text-xl" /> 
            <div>
              <div className="font-semibold">Manage Jobs</div>
              <div className="text-xs opacity-80">Post and edit job listings</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate('/timesheet/approval')}
            className="bg-green-500 hover:bg-green-600 h-auto py-4"
          >
            <FaRegClock className="mr-2 text-xl" /> 
            <div>
              <div className="font-semibold">Timesheet Approval</div>
              <div className="text-xs opacity-80">Review and approve timesheets</div>
            </div>
          </Button>
          
          <Button 
            onClick={() => navigate('/employer-job-applicants/all')}
            className="bg-purple-500 hover:bg-purple-600 h-auto py-4"
          >
            <FaUsers className="mr-2 text-xl" /> 
            <div>
              <div className="font-semibold">View All Applicants</div>
              <div className="text-xs opacity-80">Review all job applications</div>
            </div>
          </Button>
        </div>
        
        {/* Pending Applications */}
        <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
        <div className="mb-8">
          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No pending applications
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 p-4">
                {pendingApplications.map(application => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
                          <p className="text-gray-600">{application.companyName}</p>
                          <p className="text-gray-500 text-sm">Applicant: {application.userEmail}</p>
                          <p className="text-gray-500 text-sm">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleApprove(application.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <FaCheck className="mr-2" /> Approve
                          </Button>
                          <Button 
                            onClick={() => handleReject(application.id)}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <FaTimes className="mr-2" /> Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Approved Applications */}
        <h2 className="text-xl font-semibold mb-4">Approved Applications</h2>
        <div className="mb-8">
          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            {approvedApplications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No approved applications
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 p-4">
                {approvedApplications.map(application => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
                          <p className="text-gray-600">{application.companyName}</p>
                          <p className="text-gray-500 text-sm">Applicant: {application.userEmail}</p>
                          <p className="text-gray-500 text-sm">Approved: {new Date(application.approvedDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Approved
                          </div>
                          <Button 
                            onClick={() => navigate(`/timesheet/approval?user=${application.userEmail}`)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <FaFileAlt className="mr-2" /> View Timesheets
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;