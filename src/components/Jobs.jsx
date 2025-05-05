import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from './JobCard';
import JobModal from './JobModal';
import AppliedJobsModal from './AppliedJobsModal';
import { jobs } from '../data/jobs';

const Jobs = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [jobOfferStatuses, setJobOfferStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Part-time'); // Default to Part-time for students
  const [filterHours, setFilterHours] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showAppliedJobsModal, setShowAppliedJobsModal] = useState(false);
  const [showStudentFriendlyOnly, setShowStudentFriendlyOnly] = useState(false);

  // Load applied jobs and offer statuses from localStorage on component mount
  useEffect(() => {
    const savedAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setAppliedJobs(new Set(savedAppliedJobs));

    const savedJobOfferStatuses = JSON.parse(localStorage.getItem('jobOfferStatuses') || '{}');
    setJobOfferStatuses(savedJobOfferStatuses);
  }, []);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleJobClose = () => {
    setSelectedJob(null);
  };

  const handleJobApply = (job) => {
    const updatedAppliedJobs = new Set([...appliedJobs, job.id]);
    setAppliedJobs(updatedAppliedJobs);
    
    // Save to localStorage
    localStorage.setItem('appliedJobs', JSON.stringify([...updatedAppliedJobs]));
  };

  const handleShowAppliedJobs = () => {
    setShowAppliedJobsModal(true);
  };

  const handleCloseAppliedJobs = () => {
    setShowAppliedJobsModal(false);
  };

  const handleAcceptOffer = (job) => {
    // Update job offer status
    const updatedStatuses = {
      ...jobOfferStatuses,
      [job.id]: 'accepted'
    };
    setJobOfferStatuses(updatedStatuses);
    
    // Save to localStorage
    localStorage.setItem('jobOfferStatuses', JSON.stringify(updatedStatuses));
    
    // Close the modal
    setShowAppliedJobsModal(false);
    
    // Navigate to welcome page
    navigate(`/welcome-job/${job.id}`);
  };

  const handleRejectOffer = (job) => {
    // Update job offer status
    const updatedStatuses = {
      ...jobOfferStatuses,
      [job.id]: 'rejected'
    };
    setJobOfferStatuses(updatedStatuses);
    
    // Save to localStorage
    localStorage.setItem('jobOfferStatuses', JSON.stringify(updatedStatuses));
    
    // Close the modal
    setShowAppliedJobsModal(false);
  };

  // Helper function to determine if a job is student-friendly
  const isStudentFriendly = (job) => {
    // Consider part-time jobs and jobs with flexible hours as student-friendly
    return job.jobType === 'Part-time' || 
           job.experienceLevel === 'Entry' || 
           (job.hoursPerWeek && job.hoursPerWeek <= 20) ||
           (job.benefits && job.benefits.some(benefit => 
             benefit.toLowerCase().includes('flexible') || 
             benefit.toLowerCase().includes('schedule') ||
             benefit.toLowerCase().includes('campus') ||
             benefit.toLowerCase().includes('student')
           ));
  };

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJobType = filterType === '' || 
      (job.jobType && job.jobType.toLowerCase() === filterType.toLowerCase());
    
    const matchesHours = filterHours === '' || 
      (job.hoursPerWeek && 
        ((filterHours === 'under15' && job.hoursPerWeek < 15) ||
         (filterHours === '15to20' && job.hoursPerWeek >= 15 && job.hoursPerWeek <= 20) ||
         (filterHours === 'over20' && job.hoursPerWeek > 20)));
    
    const matchesLocation = filterLocation === '' ||
      (job.location && job.location.toLowerCase().includes(filterLocation.toLowerCase()));
    
    const matchesStudentFriendly = !showStudentFriendlyOnly || isStudentFriendly(job);
    
    return matchesSearch && matchesJobType && matchesHours && matchesLocation && matchesStudentFriendly;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Job Board</h1>
            <p className="text-gray-600 mt-2">Find flexible part-time positions that fit your class schedule</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Profile
            </button>
            <button
              onClick={handleShowAppliedJobs}
              className="bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Applied Jobs
            </button>
          </div>
        </div>

        {/* Student-friendly jobs banner */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                We've highlighted jobs that are perfect for students with flexible hours and campus-friendly locations.
              </p>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="mb-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search jobs by title, company, or location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            {/* Hours Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours Per Week</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterHours}
                onChange={(e) => setFilterHours(e.target.value)}
              >
                <option value="">Any Hours</option>
                <option value="under15">Under 15 hours</option>
                <option value="15to20">15-20 hours</option>
                <option value="over20">Over 20 hours</option>
              </select>
            </div>
            
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="">Any Location</option>
                <option value="campus">On Campus</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            
            {/* Student-Friendly Toggle */}
            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={showStudentFriendlyOnly}
                    onChange={() => setShowStudentFriendlyOnly(!showStudentFriendlyOnly)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${showStudentFriendlyOnly ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showStudentFriendlyOnly ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-medium text-gray-700">
                  Student-Friendly Jobs Only
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
        </div>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={handleJobSelect}
                onApply={handleJobApply}
                isApplied={appliedJobs.has(job.id)}
                offerStatus={jobOfferStatuses[job.id]}
                isStudentFriendly={isStudentFriendly(job)}
              />
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-gray-500">
              No jobs found matching your criteria. Try adjusting your search.
            </div>
          )}
        </div>
      </div>

      {/* Job details modal */}
      <JobModal
        job={selectedJob}
        onClose={handleJobClose}
        onApply={handleJobApply}
        isApplied={selectedJob ? appliedJobs.has(selectedJob.id) : false}
        isStudentFriendly={selectedJob ? isStudentFriendly(selectedJob) : false}
      />

      {/* Applied jobs modal */}
      {showAppliedJobsModal && (
        <AppliedJobsModal
          appliedJobs={appliedJobs}
          jobs={jobs}
          onClose={handleCloseAppliedJobs}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
        />
      )}
    </div>
  );
};

export default Jobs;