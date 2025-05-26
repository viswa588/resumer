import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { FaClock, FaCheckCircle, FaHourglass, FaTimes, FaDollarSign, FaFilter, FaExclamationTriangle } from 'react-icons/fa';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const TimesheetOverviewCard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Dummy data for timesheet overview
  const timesheetStats = {
    totalHours: 1248,
    approved: 968,
    pending: 280,
    rejected: 0,
    weeklyCost: '$48,960',
    hourlyAvg: '$39.25',
  };

  const recentTimesheets = [
    {
      id: 1,
      employee: 'Sarah Johnson',
      hours: 40,
      week: 'Nov 13 - Nov 19, 2023',
      status: 'approved',
      date: '2023-11-20',
      department: 'Engineering',
      project: 'Website Redesign',
      cost: '$1,600',
      overdue: false,
    },
    {
      id: 2,
      employee: 'Michael Chen',
      hours: 38,
      week: 'Nov 13 - Nov 19, 2023',
      status: 'approved',
      date: '2023-11-20',
      department: 'Design',
      project: 'Mobile App',
      cost: '$1,520',
      overdue: false,
    },
    {
      id: 3,
      employee: 'Emily Rodriguez',
      hours: 42,
      week: 'Nov 13 - Nov 19, 2023',
      status: 'pending',
      date: '2023-11-19',
      department: 'Engineering',
      project: 'API Development',
      cost: '$1,680',
      overdue: true,
    },
    {
      id: 4,
      employee: 'David Kim',
      hours: 35,
      week: 'Nov 13 - Nov 19, 2023',
      status: 'rejected',
      date: '2023-11-19',
      department: 'Marketing',
      project: 'Content Creation',
      cost: '$1,400',
      overdue: false,
    },
  ];

  // Status badge configuration
  const statusConfig = {
    approved: { 
      color: 'bg-green-100 text-green-800', 
      icon: <FaCheckCircle className="mr-1 h-3 w-3" /> 
    },
    pending: { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: <FaHourglass className="mr-1 h-3 w-3" /> 
    },
    rejected: { 
      color: 'bg-red-100 text-red-800', 
      icon: <FaTimes className="mr-1 h-3 w-3" /> 
    },
  };

  // Filter timesheets based on active filter
  const filteredTimesheets = activeFilter === 'all' 
    ? recentTimesheets 
    : recentTimesheets.filter(ts => ts.department.toLowerCase() === activeFilter || ts.status === activeFilter);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaClock className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Timesheet Overview</CardTitle>
          </div>
          <Link to="/timesheet/approval" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Hours</div>
            <div className="text-2xl font-bold">{timesheetStats.totalHours}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Weekly Cost</div>
            <div className="text-2xl font-bold">{timesheetStats.weeklyCost}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Avg. Hourly</div>
            <div className="text-2xl font-bold">{timesheetStats.hourlyAvg}</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-500">Recent Entries</h3>
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
                variant={activeFilter === 'engineering' ? 'default' : 'outline'} 
                size="sm" 
                className="text-xs"
                onClick={() => setActiveFilter('engineering')}
              >
                Engineering
              </Button>
              <Button 
                variant={activeFilter === 'design' ? 'default' : 'outline'} 
                size="sm" 
                className="text-xs"
                onClick={() => setActiveFilter('design')}
              >
                Design
              </Button>
              <Button 
                variant={activeFilter === 'pending' ? 'default' : 'outline'} 
                size="sm" 
                className="text-xs"
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredTimesheets.map((timesheet) => (
              <div key={timesheet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{timesheet.employee}</div>
                  <div className="text-xs text-gray-500">
                    {timesheet.hours} hours • {timesheet.week}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {timesheet.project} • {timesheet.department}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={statusConfig[timesheet.status].color}>
                    {statusConfig[timesheet.status].icon}
                    {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-700">
                    <FaDollarSign className="mr-1 h-3 w-3 text-green-600" />
                    {timesheet.cost}
                  </div>
                  {timesheet.overdue && (
                    <div className="flex items-center text-xs text-red-600">
                      <FaExclamationTriangle className="mr-1 h-3 w-3" />
                      Overdue
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

export default TimesheetOverviewCard;