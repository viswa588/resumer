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
  const [filterType, setFilterType] = useState('');
  const [showAppliedJobsModal, setShowAppliedJobsModal] = useState(false);

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

  // Filter jobs based on search term and job type filter
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === '' || 
      (job.jobType && job.jobType.toLowerCase() === filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Positions</h1>
            <p className="text-gray-600 mt-2">Find your next career opportunity</p>
          </div>
          <div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Profile Page
          </button>
          </div>
          <button
            onClick={handleShowAppliedJobs}
            className="bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Applied Jobs
          </button>
        </div>

        {/* Search and filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search jobs by title, company, or location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
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