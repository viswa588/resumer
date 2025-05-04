import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Search, ArrowLeft, Download, Mail, Check, X, Eye } from "lucide-react";
import { initializeSampleData } from "../data/sampleData";

export default function EmployerJobApplicants() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);

  useEffect(() => {
    // Initialize sample data if it doesn't exist
    initializeSampleData();
    
    // Load job details
    const allJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
    const jobDetails = allJobs.find(j => j.id.toString() === jobId);
    
    if (jobDetails) {
      setJob(jobDetails);
    } else {
      // Job not found, redirect back to job management
      navigate('/employer-job-management');
      return;
    }
    
    // Load applicants for this job
    const allApplicants = JSON.parse(localStorage.getItem('jobApplicants') || '[]');
    const jobApplicants = allApplicants.filter(applicant => applicant.jobId.toString() === jobId);
    
    setApplicants(jobApplicants);
    setFilteredApplicants(jobApplicants);
    setIsLoading(false);
  }, [jobId, navigate]);

  useEffect(() => {
    // Apply filters whenever search term or status filter changes
    let filtered = [...applicants];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(applicant => 
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(applicant => applicant.status === statusFilter);
    }
    
    setFilteredApplicants(filtered);
  }, [searchTerm, statusFilter, applicants]);

  const handleApproveApplicant = (applicantId) => {
    // Get all applicants from localStorage
    const allApplicants = JSON.parse(localStorage.getItem('jobApplicants') || '[]');
    
    // Update the applicant status
    const updatedApplicants = allApplicants.map(applicant => {
      if (applicant.id === applicantId) {
        return {
          ...applicant,
          status: 'approved',
          approvedDate: new Date().toISOString()
        };
      }
      return applicant;
    });
    
    // Save back to localStorage
    localStorage.setItem('jobApplicants', JSON.stringify(updatedApplicants));
    
    // Update state
    const updatedJobApplicants = applicants.map(applicant => {
      if (applicant.id === applicantId) {
        return {
          ...applicant,
          status: 'approved',
          approvedDate: new Date().toISOString()
        };
      }
      return applicant;
    });
    
    setApplicants(updatedJobApplicants);
    
    // If viewing applicant details, update selected applicant
    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant({
        ...selectedApplicant,
        status: 'approved',
        approvedDate: new Date().toISOString()
      });
    }
  };

  const handleRejectApplicant = (applicantId) => {
    // Get all applicants from localStorage
    const allApplicants = JSON.parse(localStorage.getItem('jobApplicants') || '[]');
    
    // Update the applicant status
    const updatedApplicants = allApplicants.map(applicant => {
      if (applicant.id === applicantId) {
        return {
          ...applicant,
          status: 'rejected',
          rejectedDate: new Date().toISOString()
        };
      }
      return applicant;
    });
    
    // Save back to localStorage
    localStorage.setItem('jobApplicants', JSON.stringify(updatedApplicants));
    
    // Update state
    const updatedJobApplicants = applicants.map(applicant => {
      if (applicant.id === applicantId) {
        return {
          ...applicant,
          status: 'rejected',
          rejectedDate: new Date().toISOString()
        };
      }
      return applicant;
    });
    
    setApplicants(updatedJobApplicants);
    
    // If viewing applicant details, update selected applicant
    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant({
        ...selectedApplicant,
        status: 'rejected',
        rejectedDate: new Date().toISOString()
      });
    }
  };

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantDetails(true);
  };

  const handleCloseApplicantDetails = () => {
    setShowApplicantDetails(false);
    setSelectedApplicant(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  // Render applicant details modal
  const renderApplicantDetails = () => {
    if (!selectedApplicant) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-3xl mx-4 overflow-y-auto max-h-[90vh]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Applicant Details</CardTitle>
                <CardDescription>Review applicant information</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseApplicantDetails}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Applicant Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedApplicant.name}</h3>
                  <p className="text-gray-500">{selectedApplicant.email}</p>
                  <p className="text-gray-500">{selectedApplicant.phone || "No phone provided"}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div>{getStatusBadge(selectedApplicant.status)}</div>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied on: {formatDate(selectedApplicant.appliedDate)}
                  </p>
                  {selectedApplicant.status === 'approved' && (
                    <p className="text-sm text-gray-500">
                      Approved on: {formatDate(selectedApplicant.approvedDate)}
                    </p>
                  )}
                  {selectedApplicant.status === 'rejected' && (
                    <p className="text-sm text-gray-500">
                      Rejected on: {formatDate(selectedApplicant.rejectedDate)}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Resume */}
              <div>
                <h4 className="font-medium mb-2">Resume</h4>
                <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedApplicant.resumeFileName || "resume.pdf"}</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              
              {/* Cover Letter */}
              <div>
                <h4 className="font-medium mb-2">Cover Letter</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedApplicant.coverLetter || "No cover letter provided."}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => window.location.href = `mailto:${selectedApplicant.email}`}
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
                
                {selectedApplicant.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                      onClick={() => handleRejectApplicant(selectedApplicant.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApproveApplicant(selectedApplicant.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate('/employer-job-management')}
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Applicants</h1>
            {job && (
              <p className="text-gray-600">
                Viewing applicants for: <span className="font-medium">{job.title}</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Applicants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applicants</CardTitle>
            <CardDescription>
              {filteredApplicants.length} {filteredApplicants.length === 1 ? 'applicant' : 'applicants'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredApplicants.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="font-medium">{applicant.name}</TableCell>
                        <TableCell>{applicant.email}</TableCell>
                        <TableCell>{formatDate(applicant.appliedDate)}</TableCell>
                        <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewApplicant(applicant)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            
                            {applicant.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRejectApplicant(applicant.id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Reject
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleApproveApplicant(applicant.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No applicants found for this job</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Applicant Details Modal */}
      {showApplicantDetails && renderApplicantDetails()}
    </div>
  );
}