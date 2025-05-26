import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

// Mock chart components - in a real app, you'd use a library like Chart.js, Recharts, or ApexCharts
const BarChart = ({ data, title, color }) => (
  <div className="w-full h-48">
    <div className="flex h-full items-end">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className={`w-full mx-1 ${color || 'bg-blue-500'}`} 
            style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
          ></div>
          <div className="text-xs mt-1 text-gray-600">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const LineChart = ({ data, title, color }) => (
  <div className="w-full h-48 relative">
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={data.map((item, index) => `${index * (100 / (data.length - 1))},${100 - item.value}`).join(' ')}
        fill="none"
        stroke={color || '#3b82f6'}
        strokeWidth="2"
      />
    </svg>
    <div className="flex justify-between mt-1">
      {data.map((item, index) => (
        <div key={index} className="text-xs text-gray-600">{item.label}</div>
      ))}
    </div>
  </div>
);

const DonutChart = ({ data, title }) => {
  let total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedPercentage = 0;
  
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = accumulatedPercentage;
            accumulatedPercentage += percentage;
            
            return (
              <circle 
                key={index}
                cx="18" cy="18" r="15.91549430918954" 
                fill="transparent" 
                stroke={item.color} 
                strokeWidth="3" 
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeDashoffset={100 - startAngle}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const JobListingsChart = () => {
  const jobData = [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 19 },
    { label: 'Mar', value: 15 },
    { label: 'Apr', value: 25 },
    { label: 'May', value: 32 },
    { label: 'Jun', value: 28 },
  ];

  const applicationData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 62 },
    { label: 'Mar', value: 58 },
    { label: 'Apr', value: 78 },
    { label: 'May', value: 92 },
    { label: 'Jun', value: 86 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Job Listings Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Job Postings</h3>
            <BarChart data={jobData} color="bg-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Applications Received</h3>
            <LineChart data={applicationData} color="#4f46e5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ApplicantFunnelChart = () => {
  const funnelData = [
    { label: 'Applied', value: 86, color: '#dbeafe' },
    { label: 'Screening', value: 24, color: '#fef3c7' },
    { label: 'Interview', value: 18, color: '#dbeafe' },
    { label: 'Hired', value: 12, color: '#d1fae5' },
    { label: 'Rejected', value: 32, color: '#fee2e2' },
  ];

  const timeToHireData = [
    { label: 'Jan', value: 22 },
    { label: 'Feb', value: 19 },
    { label: 'Mar', value: 18 },
    { label: 'Apr', value: 15 },
    { label: 'May', value: 17 },
    { label: 'Jun', value: 14 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Applicant Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Applicant Funnel</h3>
            <DonutChart data={funnelData} />
            <div className="grid grid-cols-3 gap-2 text-sm mt-4">
              {funnelData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Time to Hire (Days)</h3>
            <LineChart data={timeToHireData} color="#8b5cf6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TimesheetAnalyticsChart = () => {
  const hourlyData = [
    { label: 'Week 1', value: 320 },
    { label: 'Week 2', value: 290 },
    { label: 'Week 3', value: 310 },
    { label: 'Week 4', value: 328 },
  ];

  const costData = [
    { label: 'Week 1', value: 12800 },
    { label: 'Week 2', value: 11600 },
    { label: 'Week 3', value: 12400 },
    { label: 'Week 4', value: 13120 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Timesheet Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Hours Logged</h3>
            <BarChart data={hourlyData} color="bg-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Weekly Cost ($)</h3>
            <LineChart data={costData} color="#10b981" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DiversityChart = () => {
  const genderData = [
    { label: 'Male', value: 58, color: '#93c5fd' },
    { label: 'Female', value: 36, color: '#f9a8d4' },
    { label: 'Non-binary', value: 6, color: '#c4b5fd' },
  ];

  const ethnicityData = [
    { label: 'White', value: 45 },
    { label: 'Asian', value: 25 },
    { label: 'Black', value: 15 },
    { label: 'Hispanic', value: 10 },
    { label: 'Other', value: 5 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Diversity Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Gender Distribution</h3>
            <DonutChart data={genderData} />
            <div className="grid grid-cols-3 gap-2 text-sm mt-4">
              {genderData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.label}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Ethnicity Distribution</h3>
            <BarChart data={ethnicityData} color="bg-purple-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const BudgetChart = () => {
  const budgetData = [
    { label: 'Jan', value: 15000 },
    { label: 'Feb', value: 12000 },
    { label: 'Mar', value: 18000 },
    { label: 'Apr', value: 16000 },
    { label: 'May', value: 14000 },
    { label: 'Jun', value: 17000 },
  ];

  const actualData = [
    { label: 'Jan', value: 14200 },
    { label: 'Feb', value: 13500 },
    { label: 'Mar', value: 16800 },
    { label: 'Apr', value: 17200 },
    { label: 'May', value: 13100 },
    { label: 'Jun', value: 16500 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Budget Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Budget vs Actual ($)</h3>
            <div className="relative h-48">
              <BarChart data={budgetData} color="bg-blue-300" />
              <div className="absolute inset-0">
                <LineChart data={actualData} color="#ef4444" />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                <span className="text-xs">Budget</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs">Actual</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReferralChart = () => {
  const referralData = [
    { label: 'Team A', value: 12 },
    { label: 'Team B', value: 8 },
    { label: 'Team C', value: 15 },
    { label: 'Team D', value: 6 },
    { label: 'Team E', value: 10 },
  ];

  const conversionData = [
    { label: 'Referred', value: 51, color: '#dbeafe' },
    { label: 'Interviewed', value: 32, color: '#fef3c7' },
    { label: 'Hired', value: 17, color: '#d1fae5' },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Referral Program Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Referrals by Team</h3>
            <BarChart data={referralData} color="bg-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Referral Conversion</h3>
            <DonutChart data={conversionData} />
            <div className="grid grid-cols-3 gap-2 text-sm mt-4">
              {conversionData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};