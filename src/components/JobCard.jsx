import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, onSelect, onApply, isApplied, offerStatus, isStudentFriendly }) => {
  // Determine button text and style based on application and offer status
  const getButtonConfig = () => {
    if (offerStatus === 'accepted') {
      return {
        text: 'Offer Accepted',
        className: 'bg-green-600 hover:bg-green-700 text-white',
        disabled: true
      };
    } else if (offerStatus === 'rejected') {
      return {
        text: 'Offer Rejected',
        className: 'bg-red-600 hover:bg-red-700 text-white',
        disabled: true
      };
    } else if (isApplied) {
      return {
        text: 'Applied',
        className: 'bg-green-500 hover:bg-green-600 text-white',
        disabled: true
      };
    } else {
      return {
        text: 'Apply Now',
        className: 'bg-blue-600 hover:bg-blue-700 text-white',
        disabled: false
      };
    }
  };

  const buttonConfig = getButtonConfig();

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

  return (
    <div className={`${studentFriendly ? 'border-l-4 border-green-500' : ''} bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100`}>
      {/* Student-friendly badge */}
      {studentFriendly && (
        <div className="flex items-center mb-3 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full w-fit">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          Student-Friendly
        </div>
      )}
      
      <div className="flex justify-between">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-blue-600 font-medium mb-1">{job.company}</p>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {job.location}
          </div>
        </div>
      </div>
      
      {/* Job highlights */}
      <div className="mb-4">
        {job.jobType && (
          <span className={`inline-block ${job.jobType === 'Part-time' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-1 rounded mr-2 mb-2`}>
            {job.jobType}
          </span>
        )}
        {job.experienceLevel && (
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2 mb-2">
            {job.experienceLevel}
          </span>
        )}
        {job.salary && (
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
            {job.salary}
          </span>
        )}
      </div>
      
      {/* Hours per week - Especially important for students */}
      {job.hoursPerWeek && (
        <div className="mb-3 flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-gray-600">{job.hoursPerWeek} hours/week</span>
        </div>
      )}
      
      {/* Brief description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>
      
      {/* Student benefits highlight */}
      {job.benefits && job.benefits.some(benefit => 
        benefit.toLowerCase().includes('flexible') || 
        benefit.toLowerCase().includes('schedule') ||
        benefit.toLowerCase().includes('campus') ||
        benefit.toLowerCase().includes('student')
      ) && (
        <div className="mb-4">
          <p className="text-sm text-green-600 font-medium">
            <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            Student Benefits: {job.benefits.filter(benefit => 
              benefit.toLowerCase().includes('flexible') || 
              benefit.toLowerCase().includes('schedule') ||
              benefit.toLowerCase().includes('campus') ||
              benefit.toLowerCase().includes('student')
            ).join(', ')}
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
        <div className="flex space-x-3">
          {/* Modal view button */}
          <button 
            onClick={() => onSelect(job)} 
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
          >
            Quick View
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
          
          {/* Full page view link */}
          <Link 
            to={`/jobs/${job.id}`}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
          >
            Full Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
        
        <button 
          onClick={() => !buttonConfig.disabled && onApply(job)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${buttonConfig.className}`}
          disabled={buttonConfig.disabled}
        >
          {buttonConfig.text}
        </button>
      </div>
    </div>
  );
};

export default JobCard;