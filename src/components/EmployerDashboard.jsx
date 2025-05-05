import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Users, 
  Clock, 
  CreditCard, 
  Plus, 
  FileText, 
  CheckCircle, 
  XCircle,
  LogOut,
  X,
  Eye,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";
import { initializeSampleData } from "../data/sampleData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    postedJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    pendingApprovals: 0,
    pendingTimesheets: 0
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  
  // State for modal visibility
  const [activeModal, setActiveModal] = useState(null); // 'postedJobs', 'activeJobs', 'totalApplicants', 'pendingApprovals', 'pendingTimesheets'
  
  // State for modal data
  const [allJobs, setAllJobs] = useState([]);
  const [activeJobsList, setActiveJobsList] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [pendingApprovalsList, setPendingApprovalsList] = useState([]);
  const [pendingTimesheetsList, setPendingTimesheetsList] = useState([]);

  useEffect(() => {
    // Initialize sample data if it doesn't exist
    initializeSampleData();
    
    // Load employer data from localStorage
    const employerEmail = localStorage.getItem('userEmail') || 'employer@example.com';
    
    // Get posted jobs from localStorage or use empty array if none exist
    const allJobsData = JSON.parse(localStorage.getItem('employerJobs') || '[]');
    const employerJobs = allJobsData.filter(job => job.employerEmail === employerEmail);
    
    // Get job applicants from localStorage or use empty array if none exist
    const allApplicantsData = JSON.parse(localStorage.getItem('jobApplicants') || '[]');
    const jobApplicants = allApplicantsData.filter(applicant => {
      const job = employerJobs.find(job => job.id === applicant.jobId);
      return job !== undefined;
    });

    // Get pending timesheets
    const allTimesheetsData = JSON.parse(localStorage.getItem('timesheets') || '[]');
    const pendingTimesheets = allTimesheetsData.filter(timesheet => 
      timesheet.status === 'Pending' && 
      employerJobs.some(job => job.id === timesheet.jobId)
    );

    // Update stats
    setStats({
      postedJobs: employerJobs.length,
      activeJobs: employerJobs.filter(job => job.status === 'active').length,
      totalApplicants: jobApplicants.length,
      pendingApprovals: jobApplicants.filter(app => app.status === 'pending').length,
      pendingTimesheets: pendingTimesheets.length
    });

    // Set recent jobs (up to 3)
    setRecentJobs(employerJobs.slice(0, 3));

    // Set recent applicants (up to 5)
    setRecentApplicants(jobApplicants.slice(0, 5));
    
    // Set data for modals
    setAllJobs(employerJobs);
    setActiveJobsList(employerJobs.filter(job => job.status === 'active'));
    setAllApplicants(jobApplicants);
    setPendingApprovalsList(jobApplicants.filter(app => app.status === 'pending'));
    setPendingTimesheetsList(pendingTimesheets);
  }, []);

  const handlePostNewJob = () => {
    navigate('/employer-job-posting');
  };

  const handleManageJobs = () => {
    navigate('/employer-job-management');
  };

  const handleViewApplicants = () => {
    navigate('/employer-job-management');
  };

  const handleTimesheetApproval = () => {
    navigate('/timesheet/approval');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Redirect to login page
    navigate('/login');
  };
  
  // Modal handlers
  const openModal = (modalType) => {
    setActiveModal(modalType);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600">Manage your jobs, applicants, and timesheets</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
            <Button 
              onClick={handlePostNewJob}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Plus size={16} />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
            onClick={() => openModal('postedJobs')}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Briefcase className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">Posted Jobs</p>
              <h3 className="text-2xl font-bold">{stats.postedJobs}</h3>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer hover:bg-green-50"
            onClick={() => openModal('activeJobs')}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Briefcase className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm text-gray-500">Active Jobs</p>
              <h3 className="text-2xl font-bold">{stats.activeJobs}</h3>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer hover:bg-purple-50"
            onClick={() => openModal('totalApplicants')}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <p className="text-sm text-gray-500">Total Applicants</p>
              <h3 className="text-2xl font-bold">{stats.totalApplicants}</h3>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer hover:bg-yellow-50"
            onClick={() => openModal('pendingApprovals')}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CheckCircle className="h-8 w-8 text-yellow-500 mb-2" />
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <h3 className="text-2xl font-bold">{stats.pendingApprovals}</h3>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer hover:bg-red-50"
            onClick={() => openModal('pendingTimesheets')}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Clock className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-gray-500">Pending Timesheets</p>
              <h3 className="text-2xl font-bold">{stats.pendingTimesheets}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleManageJobs}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Manage Jobs</h3>
                <p className="text-sm text-gray-500">View, edit, and delete your job postings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewApplicants}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">View Applicants</h3>
                <p className="text-sm text-gray-500">Review and manage job applications</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleTimesheetApproval}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Timesheet Approval</h3>
                <p className="text-sm text-gray-500">Review and approve employee timesheets</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs and Applicants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Postings</CardTitle>
              <CardDescription>Your most recently posted jobs</CardDescription>
            </CardHeader>
            <CardContent>
              {recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-500">
                          Posted: {new Date(job.postedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' : 
                        job.status === 'closed' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status === 'active' ? 'Active' : 
                         job.status === 'closed' ? 'Closed' : 
                         'Draft'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p>No jobs posted yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={handlePostNewJob}
                  >
                    Post Your First Job
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applicants */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applicants</CardTitle>
              <CardDescription>Latest applications to your job postings</CardDescription>
            </CardHeader>
            <CardContent>
              {recentApplicants.length > 0 ? (
                <div className="space-y-4">
                  {recentApplicants.map((applicant) => (
                    <div key={applicant.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{applicant.name}</h4>
                        <p className="text-sm text-gray-500">
                          Applied for: {applicant.jobTitle}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        applicant.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        applicant.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {applicant.status === 'approved' ? 'Approved' : 
                         applicant.status === 'rejected' ? 'Rejected' : 
                         'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p>No applicants yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Modal for Posted Jobs */}
        {activeModal === 'postedJobs' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Posted Jobs</CardTitle>
                    <CardDescription>All jobs you have posted</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {allJobs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Posted Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applicants</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{formatDate(job.postedDate)}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                                  job.status === 'closed' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {job.status === 'active' ? 'Active' : 
                                 job.status === 'closed' ? 'Closed' : 
                                 'Draft'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {allApplicants.filter(app => app.jobId === job.id).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No jobs posted yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          closeModal();
                          handlePostNewJob();
                        }}
                      >
                        Post Your First Job
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Modal for Active Jobs */}
        {activeModal === 'activeJobs' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Active Jobs</CardTitle>
                    <CardDescription>Currently active job postings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {activeJobsList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Posted Date</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Applicants</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeJobsList.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{formatDate(job.postedDate)}</TableCell>
                            <TableCell>{formatDate(job.applicationDeadline)}</TableCell>
                            <TableCell>
                              {allApplicants.filter(app => app.jobId === job.id).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No active jobs found</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          closeModal();
                          handlePostNewJob();
                        }}
                      >
                        Post a New Job
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Modal for Total Applicants */}
        {activeModal === 'totalApplicants' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>All Applicants</CardTitle>
                    <CardDescription>All applicants for your job postings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {allApplicants.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Applied For</TableHead>
                          <TableHead>Applied Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allApplicants.map((applicant) => (
                          <TableRow key={applicant.id}>
                            <TableCell className="font-medium">{applicant.name}</TableCell>
                            <TableCell>{applicant.email}</TableCell>
                            <TableCell>{applicant.jobTitle}</TableCell>
                            <TableCell>{formatDate(applicant.appliedDate)}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  applicant.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {applicant.status === 'approved' ? 'Approved' : 
                                 applicant.status === 'rejected' ? 'Rejected' : 
                                 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No applicants yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Modal for Pending Approvals */}
        {activeModal === 'pendingApprovals' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Applicants waiting for your approval</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {pendingApprovalsList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Applied For</TableHead>
                          <TableHead>Applied Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingApprovalsList.map((applicant) => (
                          <TableRow key={applicant.id}>
                            <TableCell className="font-medium">{applicant.name}</TableCell>
                            <TableCell>{applicant.email}</TableCell>
                            <TableCell>{applicant.jobTitle}</TableCell>
                            <TableCell>{formatDate(applicant.appliedDate)}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  closeModal();
                                  navigate(`/employer-job-applicants/${applicant.jobId}`);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No pending approvals</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Modal for Pending Timesheets */}
        {activeModal === 'pendingTimesheets' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pending Timesheets</CardTitle>
                    <CardDescription>Timesheets waiting for your approval</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {pendingTimesheetsList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Week Ending</TableHead>
                          <TableHead>Total Hours</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingTimesheetsList.map((timesheet) => (
                          <TableRow key={timesheet.id}>
                            <TableCell className="font-medium">{timesheet.studentName}</TableCell>
                            <TableCell>{timesheet.weekEnding}</TableCell>
                            <TableCell>{timesheet.totalHours}</TableCell>
                            <TableCell>{timesheet.department}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  closeModal();
                                  handleTimesheetApproval();
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No pending timesheets</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
