import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs } from '../data/jobs';

const RolesAndResponsibilities = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const jobId = parseInt(id);
    const foundJob = jobs.find(j => j.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
      
      // Load job details from localStorage if available
      const jobDetails = JSON.parse(localStorage.getItem(`jobDetails_${jobId}`) || '{}');
      
      // Set initial values from job data or localStorage
      setHoursPerWeek(jobDetails.hoursPerWeek || foundJob.hoursPerWeek || '');
      setStartDate(jobDetails.startDate || foundJob.startDate || '');
      setEndDate(jobDetails.endDate || foundJob.endDate || '');
    }
    
    setLoading(false);
  }, [id]);

  const handleGoBack = () => {
    navigate('/profile');
  };

  const handleSave = () => {
    if (!job) return;
    
    // Save job details to localStorage
    const jobDetails = {
      hoursPerWeek,
      startDate,
      endDate
    };
    
    localStorage.setItem(`jobDetails_${job.id}`, JSON.stringify(jobDetails));
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-lg font-semibold">Job Not Found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={handleGoBack}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // Sample roles and responsibilities based on job title
  const getRolesAndResponsibilities = (jobTitle) => {
    const title = jobTitle.toLowerCase();
    
    if (title.includes('frontend') || title.includes('ui') || title.includes('ux')) {
      return [
        "Develop and maintain responsive user interfaces using modern frameworks",
        "Collaborate with designers to implement visual elements and interactions",
        "Optimize applications for maximum speed and scalability",
        "Ensure cross-browser compatibility and responsive design",
        "Implement state management and data flow architecture",
        "Write clean, maintainable, and reusable code",
        "Participate in code reviews and provide constructive feedback",
        "Stay updated with emerging frontend technologies and best practices"
      ];
    } else if (title.includes('backend') || title.includes('server')) {
      return [
        "Design and implement server-side applications and APIs",
        "Optimize database queries and data storage solutions",
        "Ensure high performance and responsiveness of applications",
        "Implement security and data protection measures",
        "Collaborate with frontend developers to integrate user-facing elements",
        "Write clean, maintainable, and well-documented code",
        "Troubleshoot and debug issues in production environments",
        "Stay updated with backend development best practices and security patterns"
      ];
    } else if (title.includes('full stack') || title.includes('fullstack')) {
      return [
        "Develop both frontend and backend components of applications",
        "Design and implement database schemas and data models",
        "Build reusable code and libraries for future use",
        "Implement security and data protection measures",
        "Optimize applications for maximum speed and scalability",
        "Collaborate with cross-functional teams to define and implement new features",
        "Ensure the technical feasibility of UI/UX designs",
        "Stay updated with emerging technologies and industry trends"
      ];
    } else if (title.includes('data') || title.includes('analyst')) {
      return [
        "Collect, process, and analyze large datasets",
        "Develop data models and algorithms to extract insights",
        "Create visualizations and reports to communicate findings",
        "Collaborate with stakeholders to understand business requirements",
        "Identify trends and patterns in complex data sets",
        "Develop and maintain databases and data systems",
        "Ensure data quality and integrity",
        "Stay updated with emerging data science techniques and tools"
      ];
    } else if (title.includes('devops') || title.includes('cloud')) {
      return [
        "Build and maintain CI/CD pipelines",
        "Implement and manage cloud infrastructure",
        "Automate deployment processes and system configurations",
        "Monitor system performance and troubleshoot issues",
        "Implement security best practices and ensure compliance",
        "Collaborate with development teams to improve deployment workflows",
        "Optimize system resources and costs",
        "Stay updated with cloud technologies and DevOps practices"
      ];
    } else {
      return [
        "Collaborate with team members to achieve project goals",
        "Participate in planning and estimation sessions",
        "Implement features according to specifications",
        "Write clean, maintainable, and well-documented code",
        "Troubleshoot and debug issues as they arise",
        "Participate in code reviews and provide constructive feedback",
        "Stay updated with industry trends and best practices",
        "Communicate effectively with stakeholders and team members"
      ];
    }
  };

  const roles = getRolesAndResponsibilities(job.title);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <button 
              onClick={handleGoBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Profile
            </button>
          </div>
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Roles and Responsibilities</h1>
            <p className="text-xl text-blue-600 mt-1">{job.title} at {job.company}</p>
          </div>
          
          {/* Job Overview */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Overview</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            <p className="text-gray-700 mb-4">{job.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-900">{job.location}</p>
              </div>
              {job.jobType && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Job Type</p>
                  <p className="text-gray-900">{job.jobType}</p>
                </div>
              )}
              {job.experienceLevel && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Experience Level</p>
                  <p className="text-gray-900">{job.experienceLevel}</p>
                </div>
              )}
              {job.salary && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Salary</p>
                  <p className="text-gray-900">{job.salary}</p>
                </div>
              )}
              
              {/* Hours Per Week */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Hours Per Week</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    min="1"
                    max="80"
                  />
                ) : (
                  <p className="text-gray-900">{hoursPerWeek || 'Not specified'}</p>
                )}
              </div>
              
              {/* Start Date */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{startDate || 'Not specified'}</p>
                )}
              </div>
              
              {/* End Date */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-500">End Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{endDate || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Roles and Responsibilities */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Roles and Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {roles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          </div>
          
          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Contact Information */}
          {job.contactEmail && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions?</h3>
              <p className="text-gray-700">
                If you have any questions about your role or responsibilities, please contact:
                <a href={`mailto:${job.contactEmail}`} className="text-blue-600 ml-1 hover:underline">
                  {job.contactEmail}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesAndResponsibilities;