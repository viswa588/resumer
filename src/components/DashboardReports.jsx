import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  JobListingsChart, 
  ApplicantFunnelChart, 
  TimesheetAnalyticsChart, 
  DiversityChart, 
  BudgetChart,
  ReferralChart
} from './DashboardCharts';

export const DashboardReports = () => {
  const [activeReport, setActiveReport] = useState('jobs');

  const reports = {
    jobs: <JobListingsChart />,
    applicants: <ApplicantFunnelChart />,
    timesheets: <TimesheetAnalyticsChart />,
    diversity: <DiversityChart />,
    budget: <BudgetChart />,
    referrals: <ReferralChart />
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Dashboard Reports</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={activeReport === 'jobs' ? 'default' : 'outline'} 
              onClick={() => setActiveReport('jobs')}
              size="sm"
            >
              Job Listings
            </Button>
            <Button 
              variant={activeReport === 'applicants' ? 'default' : 'outline'} 
              onClick={() => setActiveReport('applicants')}
              size="sm"
            >
              Applicant Funnel
            </Button>
            <Button 
              variant={activeReport === 'timesheets' ? 'default' : 'outline'} 
              onClick={() => setActiveReport('timesheets')}
              size="sm"
            >
              Timesheet Analytics
            </Button>
            <Button 
              variant={activeReport === 'diversity' ? 'default' : 'outline'} 
              onClick={() => setActiveReport('diversity')}
              size="sm"
            >
              Diversity & Inclusion
            </Button>
            <Button 
              variant={activeReport === 'budget' ? 'default' : 'outline'} 
              onClick={() => setActiveReport('budget')}
              size="sm"
            >
              Budget Analytics
            </Button>
            <Button 
              variant={activeReport === 'referrals' ? 'default' : 'outline'} 
              onClick={() => setActiveReport('referrals')}
              size="sm"
            >
              Referral Program
            </Button>
          </div>
          
          {reports[activeReport]}
        </CardContent>
      </Card>
    </div>
  );
};