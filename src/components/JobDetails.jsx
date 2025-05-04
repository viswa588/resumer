import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const JobDetails = ({ job }) => {
  if (!job) return null;

  // Format the posted date to show as "X days ago"
  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6">
      {/* Job highlights */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="text-gray-700">{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-700">{job.salary}</span>
            </div>
          )}
          {job.jobType && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="text-gray-700">{job.jobType}</span>
            </div>
          )}
          {job.experienceLevel && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span className="text-gray-700">{job.experienceLevel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Job description */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Job Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
      </div>

      {/* Requirements */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Requirements</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Benefits</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {job.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {job.postedDate && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Posted</h4>
            <p className="text-gray-700">{formatPostedDate(job.postedDate)}</p>
          </div>
        )}
        {job.applicationDeadline && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Application Deadline</h4>
            <p className="text-gray-700">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
          </div>
        )}
        {job.contactEmail && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Contact</h4>
            <p className="text-gray-700">{job.contactEmail}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;