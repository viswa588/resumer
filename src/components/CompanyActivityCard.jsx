import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { 
  FaHistory, 
  FaUserPlus, 
  FaBriefcase, 
  FaFileAlt, 
  FaCheckCircle, 
  FaBuilding,
  FaDollarSign,
  FaCommentAlt,
  FaFilter
} from 'react-icons/fa';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export const CompanyActivityCard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Dummy data for company activity
  const activities = [
    {
      id: 1,
      type: 'hiring',
      description: 'Sarah Johnson applied for Senior Frontend Developer',
      timestamp: '2023-11-20T14:30:00',
      icon: <FaUserPlus />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      mentions: ['@alex', '@maria'],
    },
    {
      id: 2,
      type: 'hiring',
      description: 'New job posted: UX/UI Designer',
      timestamp: '2023-11-19T10:15:00',
      icon: <FaBriefcase />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      mentions: [],
    },
    {
      id: 3,
      type: 'payroll',
      description: 'Michael Chen\'s timesheet was approved',
      timestamp: '2023-11-18T16:45:00',
      icon: <FaCheckCircle />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      mentions: ['@finance'],
    },
    {
      id: 4,
      type: 'payroll',
      description: 'Emily Rodriguez submitted a new timesheet',
      timestamp: '2023-11-18T09:20:00',
      icon: <FaFileAlt />,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      mentions: [],
      comments: [
        { user: 'Alex', text: 'Please review ASAP', timestamp: '2023-11-18T10:30:00' }
      ]
    },
    {
      id: 5,
      type: 'admin',
      description: 'Company information was updated',
      timestamp: '2023-11-17T11:30:00',
      icon: <FaBuilding />,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      mentions: ['@all'],
      comments: [
        { user: 'Maria', text: 'Updated company address and contact info', timestamp: '2023-11-17T12:15:00' }
      ]
    },
    {
      id: 6,
      type: 'payroll',
      description: 'Monthly payroll processed',
      timestamp: '2023-11-15T09:00:00',
      icon: <FaDollarSign />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      mentions: ['@finance', '@hr'],
    },
  ];

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter activities based on active filter
  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === activeFilter);

  // Type badge configuration
  const typeBadgeConfig = {
    hiring: 'bg-blue-100 text-blue-800',
    payroll: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800',
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FaHistory className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Company Activity</CardTitle>
          </div>
          <Link to="/employer-dashboard" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">Filter by:</div>
          <div className="flex space-x-1">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              className="text-xs"
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'hiring' ? 'default' : 'outline'} 
              size="sm" 
              className="text-xs"
              onClick={() => setActiveFilter('hiring')}
            >
              Hiring
            </Button>
            <Button 
              variant={activeFilter === 'payroll' ? 'default' : 'outline'} 
              size="sm" 
              className="text-xs"
              onClick={() => setActiveFilter('payroll')}
            >
              Payroll
            </Button>
            <Button 
              variant={activeFilter === 'admin' ? 'default' : 'outline'} 
              size="sm" 
              className="text-xs"
              onClick={() => setActiveFilter('admin')}
            >
              Admin
            </Button>
          </div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline items */}
          <div className="space-y-6">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="relative pl-10">
                {/* Timeline icon */}
                <div className={`absolute left-0 p-1.5 rounded-full ${activity.iconBg}`}>
                  <div className={`text-xs ${activity.iconColor}`}>
                    {activity.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <Badge className={typeBadgeConfig[activity.type]}>
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{formatRelativeTime(activity.timestamp)}</p>
                  
                  {/* Mentions */}
                  {activity.mentions && activity.mentions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activity.mentions.map((mention, idx) => (
                        <span key={idx} className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {mention}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Comments */}
                  {activity.comments && activity.comments.length > 0 && (
                    <div className="mt-2 pl-3 border-l-2 border-gray-200">
                      {activity.comments.map((comment, idx) => (
                        <div key={idx} className="text-xs mb-1">
                          <div className="flex items-center">
                            <FaCommentAlt className="h-2 w-2 text-gray-400 mr-1" />
                            <span className="font-medium text-gray-700">{comment.user}:</span>
                            <span className="ml-1 text-gray-600">{comment.text}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 ml-3">
                            {formatRelativeTime(comment.timestamp)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyActivityCard;