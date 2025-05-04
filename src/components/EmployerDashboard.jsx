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
  LogOut
} from "lucide-react";
import { initializeSampleData } from "../data/sampleData";

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

  useEffect(() => {
    // Initialize sample data if it doesn't exist
    initializeSampleData();
    
    // Load employer data from localStorage
    const employerEmail = localStorage.getItem('userEmail') || 'employer@example.com';
    
    // Get posted jobs from localStorage or use empty array if none exist
    const allJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
    const employerJobs = allJobs.filter(job => job.employerEmail === employerEmail);
    
    // Get job applicants from localStorage or use empty array if none exist
    const allApplicants = JSON.parse(localStorage.getItem('jobApplicants') || '[]');
    const jobApplicants = allApplicants.filter(applicant => {
      const job = employerJobs.find(job => job.id === applicant.jobId);
      return job !== undefined;
    });

    // Get pending timesheets
    const allTimesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
    const pendingTimesheets = allTimesheets.filter(timesheet => 
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
  }, []);

  const handlePostNewJob = () => {
    navigate('/employer-job-posting');
  };

  const handleManageJobs = () => {
    navigate('/employer-job-management');
  };

  const handleViewApplicants = () => {
    navigate('/employer-applicants');
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
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Briefcase className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">Posted Jobs</p>
              <h3 className="text-2xl font-bold">{stats.postedJobs}</h3>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Briefcase className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm text-gray-500">Active Jobs</p>
              <h3 className="text-2xl font-bold">{stats.activeJobs}</h3>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <p className="text-sm text-gray-500">Total Applicants</p>
              <h3 className="text-2xl font-bold">{stats.totalApplicants}</h3>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CheckCircle className="h-8 w-8 text-yellow-500 mb-2" />
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <h3 className="text-2xl font-bold">{stats.pendingApprovals}</h3>
            </CardContent>
          </Card>
          
          <Card>
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
      </div>
    </div>
  );
}