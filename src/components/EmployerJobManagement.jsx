import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Search, Plus, Edit, Trash2, Eye, Users, ArrowLeft } from "lucide-react";

export default function EmployerJobManagement() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [employerEmail, setEmployerEmail] = useState("");

  useEffect(() => {
    // Get employer email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setEmployerEmail(email);
    }

    // Load jobs from localStorage
    const allJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
    
    // Filter jobs by employer email
    const employerJobs = allJobs.filter(job => job.employerEmail === email);
    
    setJobs(employerJobs);
    setFilteredJobs(employerJobs);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or status filter changes
    let filtered = [...jobs];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  const handleCreateJob = () => {
    navigate('/employer-job-posting');
  };

  const handleEditJob = (jobId) => {
    navigate(`/employer-job-edit/${jobId}`);
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/employer-job-applicants/${jobId}`);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      // Get all jobs from localStorage
      const allJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
      
      // Filter out the job to delete
      const updatedJobs = allJobs.filter(job => job.id !== jobId);
      
      // Update localStorage
      localStorage.setItem('employerJobs', JSON.stringify(updatedJobs));
      
      // Update state
      const updatedEmployerJobs = jobs.filter(job => job.id !== jobId);
      setJobs(updatedEmployerJobs);
    }
  };

  const handleToggleJobStatus = (jobId) => {
    // Get all jobs from localStorage
    const allJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
    
    // Find the job to update
    const updatedJobs = allJobs.map(job => {
      if (job.id === jobId) {
        // Toggle status between active and closed
        return {
          ...job,
          status: job.status === 'active' ? 'closed' : 'active'
        };
      }
      return job;
    });
    
    // Update localStorage
    localStorage.setItem('employerJobs', JSON.stringify(updatedJobs));
    
    // Update state
    const updatedEmployerJobs = jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: job.status === 'active' ? 'closed' : 'active'
        };
      }
      return job;
    });
    
    setJobs(updatedEmployerJobs);
  };

  const getApplicantCount = (jobId) => {
    // Get all applicants from localStorage
    const allApplicants = JSON.parse(localStorage.getItem('jobApplicants') || '[]');
    
    // Count applicants for this job
    return allApplicants.filter(applicant => applicant.jobId === jobId).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate('/employer-dashboard')}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600">Manage your job postings and view applicants</p>
          </div>
          <Button 
            onClick={handleCreateJob}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Plus size={16} />
            Post New Job
          </Button>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
            <CardDescription>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{formatDate(job.postedDate)}</TableCell>
                        <TableCell>{formatDate(job.applicationDeadline)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {getApplicantCount(job.id)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              job.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                              job.status === 'closed' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                              'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }
                          >
                            {job.status === 'active' ? 'Active' : 
                             job.status === 'closed' ? 'Closed' : 
                             'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewApplicants(job.id)}
                              className="flex items-center gap-1"
                            >
                              <Users className="h-3 w-3" />
                              Applicants
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleJobStatus(job.id)}
                              className={
                                job.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' :
                                'text-green-600 border-green-200 hover:bg-green-50'
                              }
                            >
                              {job.status === 'active' ? 'Close' : 'Activate'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditJob(job.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No jobs found</p>
                <Button 
                  onClick={handleCreateJob}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Post Your First Job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}