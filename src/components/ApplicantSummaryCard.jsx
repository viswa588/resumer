import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { FaUsers, FaCheckCircle, FaClock, FaTimes, FaHourglass, FaSmile } from 'react-icons/fa';
import { Badge } from './ui/badge';

export const ApplicantSummaryCard = () => {
  // Dummy data for applicant summary
  const applicantStats = {
    total: 86,
    screening: 24,
    interviewing: 18,
    hired: 12,
    rejected: 32,
    timeToHire: '18 days',
  };

  const stageDurations = {
    screening: '3.2 days',
    interviewing: '5.8 days',
    decision: '2.5 days',
  };

  const recentApplicants = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      appliedDate: '2023-11-18',
      status: 'screening',
      sentiment: 92,
      daysInStage: 2,
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'UX/UI Designer',
      appliedDate: '2023-11-17',
      status: 'interviewing',
      sentiment: 85,
      daysInStage: 4,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'DevOps Engineer',
      appliedDate: '2023-11-15',
      status: 'hired',
      sentiment: 95,
      daysInStage: 1,
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Product Manager',
      appliedDate: '2023-11-14',
      status: 'rejected',
      sentiment: 65,
      daysInStage: 3,
    },
  ];

  // Status badge color mapping
  const statusConfig = {
    screening: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="mr-1 h-3 w-3" /> },
    interviewing: { color: 'bg-blue-100 text-blue-800', icon: <FaUsers className="mr-1 h-3 w-3" /> },
    hired: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1 h-3 w-3" /> },
    rejected: { color: 'bg-red-100 text-red-800', icon: <FaTimes className="mr-1 h-3 w-3" /> },
  };

  // Sentiment score color
  const getSentimentColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaUsers className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Applicant Summary</CardTitle>
          </div>
          <Link to="/employer-job-applicants/all" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Metrics row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Time to Hire</div>
            <div className="text-2xl font-bold">{applicantStats.timeToHire}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Avg. Stage Duration</div>
            <div className="flex flex-col text-xs space-y-1 mt-1">
              <div className="flex justify-between">
                <span>Screening:</span>
                <span className="font-medium">{stageDurations.screening}</span>
              </div>
              <div className="flex justify-between">
                <span>Interviewing:</span>
                <span className="font-medium">{stageDurations.interviewing}</span>
              </div>
              <div className="flex justify-between">
                <span>Decision:</span>
                <span className="font-medium">{stageDurations.decision}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Donut chart representation */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              {/* This is a simplified donut chart representation */}
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="3"></circle>
                <circle 
                  cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                  stroke="#fef3c7" strokeWidth="3" strokeDasharray={`${(applicantStats.screening / applicantStats.total) * 100} 100`}
                  strokeDashoffset="25"
                ></circle>
                <circle 
                  cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                  stroke="#dbeafe" strokeWidth="3" strokeDasharray={`${(applicantStats.interviewing / applicantStats.total) * 100} 100`}
                  strokeDashoffset={100 - ((applicantStats.screening / applicantStats.total) * 100) + 25}
                ></circle>
                <circle 
                  cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                  stroke="#d1fae5" strokeWidth="3" strokeDasharray={`${(applicantStats.hired / applicantStats.total) * 100} 100`}
                  strokeDashoffset={100 - ((applicantStats.screening / applicantStats.total) * 100) - ((applicantStats.interviewing / applicantStats.total) * 100) + 25}
                ></circle>
                <circle 
                  cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                  stroke="#fee2e2" strokeWidth="3" strokeDasharray={`${(applicantStats.rejected / applicantStats.total) * 100} 100`}
                  strokeDashoffset={100 - ((applicantStats.screening / applicantStats.total) * 100) - ((applicantStats.interviewing / applicantStats.total) * 100) - ((applicantStats.hired / applicantStats.total) * 100) + 25}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{applicantStats.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-200 mr-2"></div>
              <span>Screening: {applicantStats.screening}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-200 mr-2"></div>
              <span>Interviewing: {applicantStats.interviewing}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
              <span>Hired: {applicantStats.hired}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-200 mr-2"></div>
              <span>Rejected: {applicantStats.rejected}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Applicants</h3>
          <div className="space-y-3">
            {recentApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{applicant.name}</div>
                  <div className="text-xs text-gray-500">{applicant.position}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <FaHourglass className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-gray-500">{applicant.daysInStage} days in stage</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={statusConfig[applicant.status].color}>
                    {statusConfig[applicant.status].icon}
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </Badge>
                  <div className={`flex items-center text-xs ${getSentimentColor(applicant.sentiment)}`}>
                    <FaSmile className="mr-1 h-3 w-3" />
                    <span>Sentiment: {applicant.sentiment}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantSummaryCard;