import React, { useState } from 'react';
import JobCard from './JobCard';
import JobModal from './JobModal';
import { jobs } from '../data/jobs';

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleJobClose = () => {
    setSelectedJob(null);
  };

  const handleJobApply = (job) => {
    setAppliedJobs(new Set([...appliedJobs, job.id]));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Positions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onSelect={handleJobSelect}
            onApply={handleJobApply}
            isApplied={appliedJobs.has(job.id)}
          />
        ))}
      </div>
      <JobModal
        job={selectedJob}
        onClose={handleJobClose}
        onApply={handleJobApply}
        isApplied={selectedJob ? appliedJobs.has(selectedJob.id) : false}
      />
    </div>
  );
};

export default Jobs;