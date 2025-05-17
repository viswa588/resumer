import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { getEmployerJobs, deleteJob, initializeSampleJobs } from '../services/jobService';
import { getUserProfile } from '../services/userService';

const EmployerJobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    // Initialize sample jobs if needed
    initializeSampleJobs();
    
    // Load user profile
    const profile = getUserProfile();
    setUserProfile(profile);
    
    // Load employer's jobs
    const employerEmail = profile.email || localStorage.getItem('userEmail');
    if (employerEmail) {
      const employerJobs = getEmployerJobs(employerEmail);
      setJobs(employerJobs);
    }
  }, []);

  const handleCreateJob = () => {
    navigate('/employer-job-posting');
  };

  const handleEditJob = (jobId) => {
    navigate(`/employer-job-edit/${jobId}`);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      const result = deleteJob(jobId);
      if (result.success) {
        // Update jobs list
        setJobs(jobs.filter(job => job.id !== jobId));
      }
    }
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/employer-job-applicants/${jobId}`);
  };

  const handleGoBack = () => {
    navigate('/employer-dashboard');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4"
              onClick={handleGoBack}
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Job Management</h1>
          </div>
          <Button 
            onClick={handleCreateJob}
            className="bg-green-500 hover:bg-green-600"
          >
            <FaPlus className="mr-2" /> Post New Job
          </Button>
        </div>
        
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
              <Button 
                onClick={handleCreateJob}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <FaPlus className="mr-2" /> Create Your First Job Posting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {jobs.map(job => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold">{job.title}</h2>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-gray-500 text-sm">{job.location}</p>
                        <div className="mt-2 flex items-center">
                          <Badge className="bg-blue-100 text-blue-800 mr-2">
                            {job.salary}
                          </Badge>
                          <Badge className={`${
                            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status === 'active' ? 'Active' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                          Posted: {formatDate(job.postedDate)}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleViewApplicants(job.id)}
                        >
                          <FaUsers className="mr-2" /> 
                          <span>Applicants ({job.applicants || 0})</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleEditJob(job.id)}
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <FaTrash className="mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold">Description</h3>
                      <p className="text-gray-700 mt-1">{job.description}</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold">Requirements</h3>
                      <p className="text-gray-700 mt-1">{job.requirements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerJobManagement;