import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { JobListingsCard } from './JobListingsCard';
import { ApplicantSummaryCard } from './ApplicantSummaryCard';
import { TimesheetOverviewCard } from './TimesheetOverviewCard';
import { CompanyActivityCard } from './CompanyActivityCard';
import { DashboardReports } from './DashboardReports';
import { AIInterviewAssistant } from './AIInterviewAssistant';
import { 
  WorkflowAutomation, 
  TalentPoolManagement, 
  ComplianceSecurityPanel,
  ReferralProgramTracker,
  BudgetingCostInsights,
  DiversityInclusionDashboard,
  CollaborationTools
} from './AdvancedFeatures';
import { FaRobot, FaBell, FaChartBar, FaUserTie } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

const NewEmployerDashboard = ({ initialTab = 'overview' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Dummy notifications
  const notifications = [
    { id: 1, title: "Interview scheduled", description: "Interview with Sarah Johnson at 2:00 PM", type: "interview" },
    { id: 2, title: "Timesheet reminder", description: "3 timesheets pending approval", type: "timesheet" },
    { id: 3, title: "Job posting expiring", description: "Frontend Developer job expires in 2 days", type: "job" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
              
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === 'overview' ? 'default' : 'outline'} 
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Button>
                <Button 
                  variant={activeTab === 'interviews' ? 'default' : 'outline'} 
                  onClick={() => setActiveTab('interviews')}
                >
                  AI Interviews
                </Button>
                <Button 
                  variant={activeTab === 'reports' ? 'default' : 'outline'} 
                  onClick={() => setActiveTab('reports')}
                >
                  Reports
                </Button>
                <Button 
                  variant={activeTab === 'advanced' ? 'default' : 'outline'} 
                  onClick={() => setActiveTab('advanced')}
                >
                  Advanced Features
                </Button>
              </div>
            </div>
            
            {activeTab === 'overview' ? (
              <>
                {/* Notifications Section */}
                <div className="mb-6">
                  <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FaBell className="h-5 w-5 text-blue-600" />
                          </div>
                          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
                          >
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-gray-600">{notification.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Job Listings Card */}
                  <JobListingsCard />
                  
                  {/* Applicant Summary Card */}
                  <ApplicantSummaryCard />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Timesheet Overview Card */}
                  <TimesheetOverviewCard />
                  
                  {/* Company Activity Card */}
                  <CompanyActivityCard />
                </div>

                {/* AI Assistant Section */}
                <div className="mb-6">
                  <Card className="shadow-sm bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <FaRobot className="h-5 w-5 text-purple-600" />
                          </div>
                          <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
                          <span className="font-medium">Resume Screening</span>
                          <span className="text-xs text-gray-500 mt-1">AI-powered candidate analysis</span>
                        </Button>
                        <Button 
                          className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                          onClick={() => setActiveTab('interviews')}
                        >
                          <span className="font-medium">Interview Assistant</span>
                          <span className="text-xs text-gray-500 mt-1">Automated candidate interviews</span>
                        </Button>
                        <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
                          <span className="font-medium">Hiring Assistant</span>
                          <span className="text-xs text-gray-500 mt-1">Get personalized recommendations</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : activeTab === 'interviews' ? (
              <>
                {/* AI Interview Assistant Header */}
                <div className="mb-6">
                  <Card className="shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <FaUserTie className="h-5 w-5 text-indigo-600" />
                          </div>
                          <CardTitle className="text-lg font-semibold">AI Interview Assistant</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Automate early-stage candidate interactions with our AI Interview Assistant. 
                        Schedule and conduct initial screening interviews, analyze responses, and get 
                        comprehensive candidate assessments without manual intervention.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* AI Interview Assistant Content */}
                <AIInterviewAssistant />
              </>
            ) : activeTab === 'reports' ? (
              <>
                {/* Reports Header */}
                <div className="mb-6">
                  <Card className="shadow-sm bg-gradient-to-r from-green-50 to-teal-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FaChartBar className="h-5 w-5 text-green-600" />
                          </div>
                          <CardTitle className="text-lg font-semibold">Visual Reports & Analytics</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Explore detailed analytics and visualizations of your recruitment data. 
                        Toggle between different report types to gain insights into your hiring process, 
                        team diversity, budget allocation, and more.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Reports Content */}
                <DashboardReports />
              </>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <WorkflowAutomation />
                  <TalentPoolManagement />
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <ComplianceSecurityPanel />
                  <ReferralProgramTracker />
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <BudgetingCostInsights />
                  <DiversityInclusionDashboard />
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <CollaborationTools />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewEmployerDashboard;