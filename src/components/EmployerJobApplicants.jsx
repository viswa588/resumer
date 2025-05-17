import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FaArrowLeft, FaCheck, FaTimes, FaFileAlt, FaUserCircle } from 'react-icons/fa';
import { getJobById } from '../services/jobService';
import { getJobApplications, approveJobApplication, rejectJobApplication } from '../services/applicationService';
import ApplicantDetailsModal from './ApplicantDetailsModal';

const EmployerJobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load job details
        let jobData;
        if (jobId === 'all') {
          // Show all applications across jobs
          jobData = { title: 'All Jobs', company: 'All Companies' };
        } else {
          // Show applications for a specific job
          jobData = getJobById(parseInt(jobId));
          if (!jobData) {
            setError('Job not found');
            setLoading(false);
            return;
          }
        }
        setJob(jobData);
        
        // Load applications
        const allApplications = getJobApplications();
        let filteredApplications;
        
        if (jobId === 'all') {
          // All applications
          filteredApplications = allApplications;
        } else {
          // Applications for this job
          filteredApplications = allApplications.filter(app => app.jobId === parseInt(jobId));
        }
        
        setApplications(filteredApplications);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    loadData();
  }, [jobId]);

  const handleApprove = (applicationId) => {
    const result = approveJobApplication(applicationId);
    if (result.success) {
      // Update application in the list
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: 'approved', approved: true } : app
      ));
    }
  };

  const handleReject = (applicationId) => {
    const result = rejectJobApplication(applicationId);
    if (result.success) {
      // Update application in the list
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: 'rejected', approved: false } : app
      ));
    }
  };

  const handleViewTimesheets = (userEmail) => {
    navigate(`/timesheet/approval?user=${userEmail}`);
  };

  const handleGoBack = () => {
    navigate('/employer-job-management');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p>Loading applicants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={handleGoBack}
              className="mt-4"
            >
              Back to Job Management
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={handleGoBack}
          >
            <FaArrowLeft className="mr-2" /> Back to Jobs
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Job Applicants</h1>
            {job && jobId !== 'all' && (
              <p className="text-gray-600 mt-1">
                {job.title} at {job.company}
              </p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    {jobId === 'all' ? 'All Applications' : `Applications for ${job.title}`}
                  </h2>
                  <p className="text-gray-500">
                    {applications.length} {applications.length === 1 ? 'applicant' : 'applicants'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    {applications.filter(app => app.status === 'approved').length} Approved
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {applications.filter(app => app.status === 'pending').length} Pending
                  </Badge>
                  <Badge className="bg-red-100 text-red-800">
                    {applications.filter(app => app.status === 'rejected').length} Rejected
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No applications found for this job.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map(application => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-lg">{application.userEmail}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedApplicant(application);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <FaUserCircle className="mr-1" /> View Details
                        </Button>
                      </div>
                      <p className="text-gray-600">
                        {jobId === 'all' ? application.jobTitle : 'Applied for this position'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Applied: {formatDate(application.appliedDate)}
                      </p>
                      {application.status === 'approved' && (
                        <p className="text-green-600 text-sm">
                          Approved: {formatDate(application.approvedDate)}
                        </p>
                      )}
                      {application.status === 'rejected' && (
                        <p className="text-red-600 text-sm">
                          Rejected: {formatDate(application.rejectedDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {application.status === 'pending' ? (
                        <>
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
                        </>
                      ) : application.status === 'approved' ? (
                        <Button 
                          onClick={() => handleViewTimesheets(application.userEmail)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <FaFileAlt className="mr-2" /> View Timesheets
                        </Button>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 px-3 py-1">
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Applicant Details Modal */}
      <ApplicantDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        application={selectedApplicant}
      />
    </div>
  );
};

export default EmployerJobApplicants;