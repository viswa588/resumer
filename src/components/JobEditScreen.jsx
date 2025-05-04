import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Save } from "lucide-react";

export default function JobEditScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "",
    description: "",
    requirements: "",
    applicationDeadline: "",
    experienceLevel: "",
    contactEmail: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [originalJob, setOriginalJob] = useState(null);

  // Load job data on component mount
  useEffect(() => {
    const loadJob = () => {
      try {
        // Get all jobs from localStorage
        const allJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
        
        // Find the job with the matching ID
        const jobId = parseInt(id);
        const job = allJobs.find(job => job.id === jobId);
        
        if (job) {
          setOriginalJob(job);
          
          // Format requirements if it's an array
          const requirements = Array.isArray(job.requirements) 
            ? job.requirements.join('\n') 
            : job.requirements || '';
          
          // Format application deadline if it exists
          const applicationDeadline = job.applicationDeadline 
            ? job.applicationDeadline.split('T')[0] // Extract just the date part
            : '';
          
          setFormData({
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            salary: job.salary || "",
            jobType: job.jobType || "",
            description: job.description || "",
            requirements: requirements,
            applicationDeadline: applicationDeadline,
            experienceLevel: job.experienceLevel || "",
            contactEmail: job.contactEmail || ""
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error loading job:", error);
        setNotFound(true);
      }
    };
    
    loadJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ""
      });
    }
  };

  const handleSelectChange = (value, field) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user selects a value
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.jobType) newErrors.jobType = "Job type is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process requirements - convert from string to array if needed
      const processedRequirements = formData.requirements.trim() 
        ? formData.requirements.split('\n').filter(req => req.trim() !== '')
        : [];
      
      // Create updated job object
      const updatedJob = {
        ...originalJob,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        jobType: formData.jobType,
        description: formData.description,
        requirements: processedRequirements,
        applicationDeadline: formData.applicationDeadline,
        experienceLevel: formData.experienceLevel,
        contactEmail: formData.contactEmail,
        updatedDate: new Date().toISOString()
      };
      
      // Get all jobs from localStorage
      const allJobs = JSON.parse(localStorage.getItem('employerJobs') || '[]');
      
      // Find the index of the job to update
      const jobIndex = allJobs.findIndex(job => job.id === parseInt(id));
      
      if (jobIndex !== -1) {
        // Update the job
        allJobs[jobIndex] = updatedJob;
        
        // Save back to localStorage
        localStorage.setItem('employerJobs', JSON.stringify(allJobs));
        
        setSubmitSuccess(true);
        
        // Navigate to job management page after short delay
        setTimeout(() => {
          navigate('/employer-job-management');
        }, 1500);
      } else {
        throw new Error("Job not found");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setErrors({
        submit: "Failed to update job. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Job not found. The job may have been deleted or you don't have permission to edit it.
          </div>
          <Button 
            onClick={() => navigate('/employer-job-management')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Job Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate('/employer-job-management')}
        >
          <ArrowLeft size={16} />
          Back to Job Management
        </Button>
        
        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Job updated successfully! Redirecting to job management...
          </div>
        )}
        
        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.submit}
          </div>
        )}
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Job Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Job</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter job title" 
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    id="company" 
                    placeholder="Enter company name" 
                    value={formData.company}
                    onChange={handleInputChange}
                    className={errors.company ? "border-red-500" : ""}
                  />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter job location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
                
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input 
                    id="salary" 
                    placeholder="Enter salary details" 
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select 
                    value={formData.jobType} 
                    onValueChange={(value) => handleSelectChange(value, "jobType")}
                  >
                    <SelectTrigger id="jobType" className={errors.jobType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
                </div>
                
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select 
                    value={formData.experienceLevel} 
                    onValueChange={(value) => handleSelectChange(value, "experienceLevel")}
                  >
                    <SelectTrigger id="experienceLevel">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry-level">Entry-level</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input 
                    id="applicationDeadline" 
                    type="date" 
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter job description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    className={errors.description ? "border-red-500" : ""}
                    rows={5}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Enter job requirements (one per line)" 
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                  />
                  <p className="text-gray-500 text-sm mt-1">Enter each requirement on a new line</p>
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    placeholder="Enter contact email" 
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Updating Job...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}