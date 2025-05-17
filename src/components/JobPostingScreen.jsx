import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { createJob } from '../services/jobService';
import { getUserProfile } from '../services/userService';

const JobPostingScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get employer email
      const profile = getUserProfile();
      const employerEmail = profile.email || localStorage.getItem('userEmail');
      
      if (!employerEmail) {
        setError('User information not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }
      
      // Create job
      const jobData = {
        ...formData,
        employerEmail
      };
      
      const newJob = createJob(jobData);
      
      // Navigate back to job management
      navigate('/employer-job-management');
    } catch (err) {
      setError('Failed to create job posting. Please try again.');
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/employer-job-management');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={handleGoBack}
          >
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Post a New Job</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-gray-700 font-medium">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company" className="text-gray-700 font-medium">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Tech Innovations Inc."
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-gray-700 font-medium">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="salary" className="text-gray-700 font-medium">Salary Range</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. $80,000 - $100,000"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-gray-700 font-medium">Job Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the job role, responsibilities, and expectations..."
                  className="mt-1"
                  rows={5}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="requirements" className="text-gray-700 font-medium">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="List the skills, qualifications, and experience required..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-4"
                  onClick={handleGoBack}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobPostingScreen;