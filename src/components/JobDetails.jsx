import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const JobDetails = ({ job, isStudentFriendly }) => {
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

  // Calculate if job is student-friendly if not explicitly provided
  const studentFriendly = isStudentFriendly !== undefined ? isStudentFriendly : (
    job.jobType === 'Part-time' || 
    job.experienceLevel === 'Entry' || 
    (job.hoursPerWeek && job.hoursPerWeek <= 20) ||
    (job.benefits && job.benefits.some(benefit => 
      benefit.toLowerCase().includes('flexible') || 
      benefit.toLowerCase().includes('schedule') ||
      benefit.toLowerCase().includes('campus') ||
      benefit.toLowerCase().includes('student')
    ))
  );

  // Extract student-friendly benefits
  const studentBenefits = job.benefits ? job.benefits.filter(benefit => 
    benefit.toLowerCase().includes('flexible') || 
    benefit.toLowerCase().includes('schedule') ||
    benefit.toLowerCase().includes('campus') ||
    benefit.toLowerCase().includes('student')
  ) : [];

  return (
    <div className="space-y-6">
      {/* Student-friendly badge */}
      {studentFriendly && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <span className="font-medium">Perfect for students!</span> This job offers flexible hours and is compatible with your class schedule.
              </p>
            </div>
          </div>
        </div>
      )}

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
              <span className={`${job.jobType === 'Part-time' ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                {job.jobType}
              </span>
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

      {/* Hours per week - Highlighted for students */}
      {job.hoursPerWeek && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">Hours Per Week</h3>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-blue-700 font-medium">{job.hoursPerWeek} hours/week</span>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            {job.hoursPerWeek <= 20 
              ? "This part-time position offers hours that can easily fit around your class schedule."
              : "Consider how these hours will fit with your academic commitments."}
          </p>
        </div>
      )}

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

      {/* Student-specific benefits section */}
      {studentBenefits.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800">Student Benefits</h3>
          <ul className="list-disc list-inside text-green-700 space-y-1">
            {studentBenefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* All benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">All Benefits</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {job.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Schedule information */}
      {(job.startDate || job.endDate) && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800">Schedule Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.startDate && (
              <div>
                <h4 className="text-sm font-medium text-yellow-700">Start Date</h4>
                <p className="text-gray-700">{new Date(job.startDate).toLocaleDateString()}</p>
              </div>
            )}
            {job.endDate && (
              <div>
                <h4 className="text-sm font-medium text-yellow-700">End Date</h4>
                <p className="text-gray-700">{new Date(job.endDate).toLocaleDateString()}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Perfect for semester planning - this position ends before the next semester starts!
                </p>
              </div>
            )}
          </div>
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