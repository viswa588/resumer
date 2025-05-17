import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { FaSearch, FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { getAllJobs, initializeSampleJobs } from '../services/jobService';
import { getUserProfile } from '../services/userService';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [userProfile, setUserProfile] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    // Initialize sample jobs if needed
    initializeSampleJobs();
    
    // Load all jobs from localStorage
    const allJobs = getAllJobs();
    setJobs(allJobs);
    setFilteredJobs(allJobs);
    
    // Load user profile
    const profile = getUserProfile();
    setUserProfile(profile);
    
    // Load applied jobs
    const userEmail = profile.email || localStorage.getItem('userEmail');
    if (userEmail) {
      const userAppliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${userEmail}`) || '[]');
      setAppliedJobs(userAppliedJobs);
    }
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredJobs(jobs);
      return;
    }
    
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term)
    );
    
    setFilteredJobs(filtered);
  };

  const handleApply = (jobId) => {
    // Check if already applied
    if (appliedJobs.includes(jobId)) {
      alert('You have already applied for this job.');
      return;
    }
    
    // Navigate to job details page
    navigate(`/jobs/${jobId}`);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleGoBack = () => {
    navigate('/profile');
  };

  const refreshJobs = () => {
    // Reload jobs from localStorage
    const allJobs = getAllJobs();
    setJobs(allJobs);
    setFilteredJobs(allJobs);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4"
              onClick={handleGoBack}
            >
              <FaArrowLeft className="mr-2" /> Back to Profile
            </Button>
            <h1 className="text-3xl font-bold">Available Jobs</h1>
          </div>
          <Button 
            onClick={refreshJobs}
            variant="outline"
            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            Refresh Jobs
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 py-3"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No jobs found matching your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredJobs
              .filter(job => job.status === 'active')
              .map(job => (
                <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-blue-700 hover:text-blue-800 cursor-pointer" onClick={() => handleViewDetails(job.id)}>
                          {job.title}
                        </h2>
                        <p className="text-gray-700 flex items-center mt-1">
                          <FaBriefcase className="mr-2 text-gray-500" /> {job.company}
                        </p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <FaMapMarkerAlt className="mr-2 text-gray-500" /> {job.location}
                        </p>
                        {job.salary && (
                          <p className="text-gray-600 flex items-center mt-1">
                            <FaDollarSign className="mr-2 text-gray-500" /> {job.salary}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm flex items-center mt-2">
                          <FaCalendarAlt className="mr-2" /> Posted {formatDate(job.postedDate)}
                        </p>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleApply(job.id)}
                          className={`${
                            appliedJobs.includes(job.id)
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          {appliedJobs.includes(job.id) ? 'Applied' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-700 line-clamp-3">{job.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {job.applicants} {job.applicants === 1 ? 'applicant' : 'applicants'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewDetails(job.id)}
                      >
                        View Details
                      </Button>
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

export default Jobs;