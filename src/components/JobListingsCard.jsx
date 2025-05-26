import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { FaBriefcase, FaEye, FaCheckCircle, FaCopy, FaChartLine, FaUserCheck } from 'react-icons/fa';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const JobListingsCard = () => {
  // Dummy data for job listings
  const jobStats = {
    totalJobs: 24,
    activeListings: 18,
  };

  const recentJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      location: 'Remote',
      postedDate: '2023-11-15',
      status: 'active',
      applicants: 12,
      views: 245,
      clicks: 68,
      matchScore: 92,
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      location: 'New York, NY',
      postedDate: '2023-11-10',
      status: 'active',
      applicants: 8,
      views: 187,
      clicks: 42,
      matchScore: 85,
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      location: 'San Francisco, CA',
      postedDate: '2023-11-05',
      status: 'closed',
      applicants: 15,
      views: 320,
      clicks: 95,
      matchScore: 78,
    },
    {
      id: 4,
      title: 'Product Manager',
      location: 'Austin, TX',
      postedDate: '2023-11-01',
      status: 'active',
      applicants: 6,
      views: 156,
      clicks: 34,
      matchScore: 88,
    },
  ];

  const handleDuplicate = (jobId) => {
    console.log(`Duplicating job ${jobId}`);
    // Implementation would go here
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaBriefcase className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Job Listings</CardTitle>
          </div>
          <Link to="/employer-job-management" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Jobs</div>
            <div className="text-2xl font-bold">{jobStats.totalJobs}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Active Listings</div>
            <div className="text-2xl font-bold">{jobStats.activeListings}</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Recent Job Posts</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                <FaChartLine className="mr-1 h-3 w-3" /> Analytics
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2 font-medium">Job Title</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-center">Match %</th>
                  <th className="pb-2 font-medium text-center">Views</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="font-medium">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.location}</div>
                    </td>
                    <td className="py-3">
                      <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                        {job.status === 'active' ? (
                          <FaCheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <FaEye className="mr-1 h-3 w-3" />
                        )}
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50">
                        <FaUserCheck className="mr-1 h-3 w-3 text-blue-500" />
                        <span className="text-blue-700 font-medium">{job.matchScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{job.views}</span> views<br />
                        <span className="font-medium">{job.clicks}</span> clicks
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-blue-600"
                        onClick={() => handleDuplicate(job.id)}
                      >
                        <FaCopy className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobListingsCard;