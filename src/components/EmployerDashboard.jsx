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
  DollarSign,
  BarChart,
  PieChart,
  TrendingUp,
  Filter,
  AlertCircle,
  Award,
  Percent
} from "lucide-react";
import { initializeSampleData } from "../data/sampleData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select } from "./ui/select";
import logo from '../assets/icon.png';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    postedJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    pendingApprovals: 0,
    pendingTimesheets: 0,
    // New metrics
    totalRevenue: 0,
    averageSalary: 0,
    applicationConversionRate: 0,
    approvalRate: 0,
    averageTimeToHire: 0
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  
  // State for modal visibility
  const [activeModal, setActiveModal] = useState(null); // 'postedJobs', 'activeJobs', 'totalApplicants', 'pendingApprovals', 'pendingTimesheets', 'jobPerformance', 'financialInsights'
  
  // State for modal data
  const [allJobs, setAllJobs] = useState([]);
  const [activeJobsList, setActiveJobsList] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [pendingApprovalsList, setPendingApprovalsList] = useState([]);
  const [pendingTimesheetsList, setPendingTimesheetsList] = useState([]);
  
  // New state for enhanced features
  const [jobPerformanceData, setJobPerformanceData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all'); // 'week', 'month', 'quarter', 'year', 'all'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'applicants', 'performance'
  const [topPerformingJobs, setTopPerformingJobs] = useState([]);
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalCost: 0,
    profit: 0,
    revenueByJob: []
  });

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

    // Calculate new metrics
    // 1. Calculate average salary from job postings
    const salaries = employerJobs.map(job => {
      const salaryString = job.salary || '';
      const salaryMatch = salaryString.match(/\$([0-9,]+)\s*-\s*\$([0-9,]+)/);
      if (salaryMatch) {
        const min = parseInt(salaryMatch[1].replace(/,/g, ''));
        const max = parseInt(salaryMatch[2].replace(/,/g, ''));
        return (min + max) / 2;
      }
      return 0;
    });
    
    const averageSalary = salaries.length > 0 
      ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length 
      : 0;

    // 2. Calculate application conversion rate (applicants per job)
    const applicationConversionRate = employerJobs.length > 0 
      ? jobApplicants.length / employerJobs.length 
      : 0;

    // 3. Calculate approval rate
    const approvedApplicants = jobApplicants.filter(app => app.status === 'approved');
    const approvalRate = jobApplicants.length > 0 
      ? (approvedApplicants.length / jobApplicants.length) * 100 
      : 0;

    // 4. Calculate average time to hire (in days)
    let totalHireDays = 0;
    let hireCount = 0;
    
    approvedApplicants.forEach(app => {
      if (app.appliedDate && app.approvedDate) {
        const appliedDate = new Date(app.appliedDate);
        const approvedDate = new Date(app.approvedDate);
        const daysDiff = (approvedDate - appliedDate) / (1000 * 60 * 60 * 24);
        totalHireDays += daysDiff;
        hireCount++;
      }
    });
    
    const averageTimeToHire = hireCount > 0 ? totalHireDays / hireCount : 0;

    // 5. Calculate total revenue (estimated from approved applicants and average salary)
    const totalRevenue1 = approvedApplicants.length * averageSalary * 0.15; // Assuming 15% placement fee

    // Update stats
    setStats({
      postedJobs: employerJobs.length,
      activeJobs: employerJobs.filter(job => job.status === 'active').length,
      totalApplicants: jobApplicants.length,
      pendingApprovals: jobApplicants.filter(app => app.status === 'pending').length,
      pendingTimesheets: pendingTimesheets.length,
      // New metrics
      totalRevenue: totalRevenue1,
      averageSalary,
      applicationConversionRate,
      approvalRate,
      averageTimeToHire
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

    // Calculate job performance data
    const jobPerformance = employerJobs.map(job => {
      const jobApplicantCount = jobApplicants.filter(app => app.jobId === job.id).length;
      const jobApprovedCount = jobApplicants.filter(app => app.jobId === job.id && app.status === 'approved').length;
      const conversionRate = jobApplicantCount > 0 ? (jobApprovedCount / jobApplicantCount) * 100 : 0;
      
      // Calculate days since posting
      const postedDate = new Date(job.postedDate);
      const currentDate = new Date();
      const daysSincePosting = (currentDate - postedDate) / (1000 * 60 * 60 * 24);
      
      // Calculate applicants per day
      const applicantsPerDay = daysSincePosting > 0 ? jobApplicantCount / daysSincePosting : 0;
      
      // Calculate performance score (weighted average of different metrics)
      const performanceScore = (
        (conversionRate * 0.4) + 
        (applicantsPerDay * 10 * 0.4) + 
        (jobApprovedCount * 5 * 0.2)
      );
      
      return {
        ...job,
        applicantCount: jobApplicantCount,
        approvedCount: jobApprovedCount,
        conversionRate,
        applicantsPerDay,
        performanceScore: Math.round(performanceScore * 10) / 10
      };
    });
    
    // Sort by performance score
    const sortedPerformance = [...jobPerformance].sort((a, b) => b.performanceScore - a.performanceScore);
    setJobPerformanceData(jobPerformance);
    setTopPerformingJobs(sortedPerformance.slice(0, 3));

    // Calculate financial data
    const jobRevenues = employerJobs.map(job => {
      const jobApprovedCount = jobApplicants.filter(app => app.jobId === job.id && app.status === 'approved').length;
      
      // Extract salary range
      const salaryString = job.salary || '';
      const salaryMatch = salaryString.match(/\$([0-9,]+)\s*-\s*\$([0-9,]+)/);
      let avgSalary = 0;
      
      if (salaryMatch) {
        const min = parseInt(salaryMatch[1].replace(/,/g, ''));
        const max = parseInt(salaryMatch[2].replace(/,/g, ''));
        avgSalary = (min + max) / 2;
      }
      
      // Calculate revenue (15% of salary for each approved applicant)
      const revenue = jobApprovedCount * avgSalary * 0.15;
      
      // Calculate cost (fixed cost per job posting + variable cost per applicant)
      const fixedCost = 500; // Assuming $500 per job posting
      const variableCost = jobApplicants.filter(app => app.jobId === job.id).length * 50; // Assuming $50 per applicant
      const totalCost = fixedCost + variableCost;
      
      // Calculate profit
      const profit = revenue - totalCost;
      
      return {
        jobId: job.id,
        jobTitle: job.title,
        revenue,
        cost: totalCost,
        profit,
        roi: totalCost > 0 ? (profit / totalCost) * 100 : 0
      };
    });
    
    // Calculate totals
    const totalRevenue = jobRevenues.reduce((sum, job) => sum + job.revenue, 0);
    const totalCost = jobRevenues.reduce((sum, job) => sum + job.cost, 0);
    const totalProfit = totalRevenue - totalCost;
    
    setFinancialData({
      totalRevenue,
      totalCost,
      profit: totalProfit,
      revenueByJob: jobRevenues
    });
  }, [timeFilter]);

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

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle time filter change
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Resume Logo" className="h-15 w-12" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-gray-600">Manage your jobs, applicants, and timesheets</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="timeFilter" className="text-sm font-medium text-gray-700">Time Period:</label>
              <select 
                id="timeFilter" 
                value={timeFilter} 
                onChange={handleTimeFilterChange}
                className="rounded-md border-gray-300 shadow-sm text-sm"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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

        {/* New Performance Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow hover:bg-indigo-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Percent className="h-8 w-8 text-indigo-500 mb-2" />
                <p className="text-sm text-gray-500">Approval Rate</p>
                <h3 className="text-2xl font-bold">{stats.approvalRate.toFixed(1)}%</h3>
                <p className="text-xs text-gray-500">of applicants approved</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow hover:bg-teal-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Users className="h-8 w-8 text-teal-500 mb-2" />
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold">{stats.applicationConversionRate.toFixed(1)}</h3>
                <p className="text-xs text-gray-500">applicants per job</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow hover:bg-amber-50">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Clock className="h-8 w-8 text-amber-500 mb-2" />
                <p className="text-sm text-gray-500">Time to Hire</p>
                <h3 className="text-2xl font-bold">{stats.averageTimeToHire.toFixed(1)}</h3>
                <p className="text-xs text-gray-500">days average</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer hover:bg-emerald-50"
              onClick={() => openModal('financialInsights')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <DollarSign className="h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-sm text-gray-500">Est. Revenue</p>
                <h3 className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</h3>
                <p className="text-xs text-gray-500">from placements</p>
              </CardContent>
            </Card>
          </div>
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

        {/* Top Performing Jobs */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Performing Jobs</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openModal('jobPerformance')}
              className="flex items-center gap-1"
            >
              <BarChart className="h-4 w-4" />
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformingJobs.length > 0 ? (
              topPerformingJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        Score: {job.performanceScore}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Applicants</span>
                        <span className="font-medium">{job.applicantCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Conversion</span>
                        <span className="font-medium">{job.conversionRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Daily Rate</span>
                        <span className="font-medium">{job.applicantsPerDay.toFixed(1)}/day</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Hired</span>
                        <span className="font-medium">{job.approvedCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 bg-gray-50 rounded-lg">
                <Award className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No job performance data available yet</p>
              </div>
            )}
          </div>
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

        {/* Modal for Job Performance */}
        {activeModal === 'jobPerformance' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-5xl mx-4 overflow-y-auto max-h-[90vh]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Job Performance Analysis</CardTitle>
                    <CardDescription>Detailed performance metrics for all your job postings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Sort by:</label>
                      <select 
                        id="sortBy" 
                        value={sortBy} 
                        onChange={handleSortChange}
                        className="rounded-md border-gray-300 shadow-sm text-sm"
                      >
                        <option value="performance">Performance Score</option>
                        <option value="applicants">Applicant Count</option>
                        <option value="conversion">Conversion Rate</option>
                        <option value="recent">Recently Posted</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Performance Score</span> is calculated based on applicant count, conversion rate, and daily application rate
                    </div>
                  </div>
                  
                  {jobPerformanceData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Applicants</TableHead>
                          <TableHead>Conversion Rate</TableHead>
                          <TableHead>Daily Rate</TableHead>
                          <TableHead>Performance Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobPerformanceData
                          .sort((a, b) => {
                            if (sortBy === 'performance') return b.performanceScore - a.performanceScore;
                            if (sortBy === 'applicants') return b.applicantCount - a.applicantCount;
                            if (sortBy === 'conversion') return b.conversionRate - a.conversionRate;
                            // Default to recent
                            return new Date(b.postedDate) - new Date(a.postedDate);
                          })
                          .map((job) => (
                            <TableRow key={job.id}>
                              <TableCell className="font-medium">{job.title}</TableCell>
                              <TableCell>{job.location}</TableCell>
                              <TableCell>{job.applicantCount} ({job.approvedCount} hired)</TableCell>
                              <TableCell>{job.conversionRate.toFixed(1)}%</TableCell>
                              <TableCell>{job.applicantsPerDay.toFixed(2)}/day</TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    job.performanceScore > 20 ? 'bg-green-100 text-green-800' :
                                    job.performanceScore > 10 ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {job.performanceScore}
                                </Badge>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No job performance data available yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Modal for Financial Insights */}
        {activeModal === 'financialInsights' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Financial Insights</CardTitle>
                    <CardDescription>Revenue, costs, and profit analysis for your job postings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <DollarSign className="h-8 w-8 text-blue-500 mb-2" />
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold">{formatCurrency(financialData.totalRevenue)}</h3>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-red-50">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <CreditCard className="h-8 w-8 text-red-500 mb-2" />
                        <p className="text-sm text-gray-500">Total Cost</p>
                        <h3 className="text-2xl font-bold">{formatCurrency(financialData.totalCost)}</h3>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                        <p className="text-sm text-gray-500">Net Profit</p>
                        <h3 className="text-2xl font-bold">{formatCurrency(financialData.profit)}</h3>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">Revenue by Job</h3>
                  
                  {financialData.revenueByJob.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Profit</TableHead>
                          <TableHead>ROI</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {financialData.revenueByJob
                          .sort((a, b) => b.profit - a.profit)
                          .map((job) => (
                            <TableRow key={job.jobId}>
                              <TableCell className="font-medium">{job.jobTitle}</TableCell>
                              <TableCell>{formatCurrency(job.revenue)}</TableCell>
                              <TableCell>{formatCurrency(job.cost)}</TableCell>
                              <TableCell className={job.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatCurrency(job.profit)}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    job.roi > 50 ? 'bg-green-100 text-green-800' :
                                    job.roi > 0 ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  }
                                >
                                  {job.roi.toFixed(1)}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p>No financial data available yet</p>
                    </div>
                  )}
                  
                  <div className="mt-4 p-4 bg-yellow-50 rounded-md text-sm text-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Note about financial calculations:</p>
                        <p>Revenue is estimated based on a 15% placement fee of the average salary for each hired applicant. Costs include a fixed cost per job posting ($500) and a variable cost per applicant ($50). These are estimates and may not reflect actual financial performance.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
