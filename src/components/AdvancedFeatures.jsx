import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { 
  FaRobot, 
  FaCog, 
  FaGlobe, 
  FaShieldAlt, 
  FaUsers, 
  FaTrophy, 
  FaCalendarCheck, 
  FaBrain, 
  FaSearch, 
  FaMoneyBillWave, 
  FaComments, 
  FaBalanceScale, 
  FaPhone 
} from 'react-icons/fa';
import { Button } from './ui/button';

export const WorkflowAutomation = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FaCog className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Workflow Automation</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Auto-Reject Rules</span>
            <span className="text-xs text-gray-500 mt-1">Set criteria for automatic rejection</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Auto-Move Stages</span>
            <span className="text-xs text-gray-500 mt-1">Based on assessment scores</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Custom Pipelines</span>
            <span className="text-xs text-gray-500 mt-1">Per job or department</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const TalentPoolManagement = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUsers className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Talent Pool Management</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Tag Candidates</span>
            <span className="text-xs text-gray-500 mt-1">Save strong candidates for future</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Internal Notes</span>
            <span className="text-xs text-gray-500 mt-1">Add comments on cultural fit</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Group by Skills</span>
            <span className="text-xs text-gray-500 mt-1">Organize by expertise or interest</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ComplianceSecurityPanel = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaShieldAlt className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Compliance & Security</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Document Expiry</span>
            <span className="text-xs text-gray-500 mt-1">Visa/work permit alerts</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Audit Logs</span>
            <span className="text-xs text-gray-500 mt-1">Track all dashboard activity</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Compliance Check</span>
            <span className="text-xs text-gray-500 mt-1">GDPR/EEOC indicators</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReferralProgramTracker = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaTrophy className="h-5 w-5 text-yellow-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Referral Program Tracker</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Track Referrals</span>
            <span className="text-xs text-gray-500 mt-1">Status and reward progress</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Leaderboard</span>
            <span className="text-xs text-gray-500 mt-1">Top referrers this quarter</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const BudgetingCostInsights = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaMoneyBillWave className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Budgeting & Cost Insights</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Cost Per Hire</span>
            <span className="text-xs text-gray-500 mt-1">Track recruitment expenses</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Budget vs Actuals</span>
            <span className="text-xs text-gray-500 mt-1">Monthly recruiting spend</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Ad Spend Tracking</span>
            <span className="text-xs text-gray-500 mt-1">LinkedIn, Indeed, etc.</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const DiversityInclusionDashboard = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaBalanceScale className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Diversity & Inclusion</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Demographics</span>
            <span className="text-xs text-gray-500 mt-1">Anonymized applicant data</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Diversity Goals</span>
            <span className="text-xs text-gray-500 mt-1">Track hiring objectives</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Language Checker</span>
            <span className="text-xs text-gray-500 mt-1">Unbiased job descriptions</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const CollaborationTools = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaComments className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Collaboration Tools</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Internal Comments</span>
            <span className="text-xs text-gray-500 mt-1">Notes on candidates</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Team Voting</span>
            <span className="text-xs text-gray-500 mt-1">Vote on candidates</span>
          </Button>
          <Button className="flex flex-col items-center justify-center h-24 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200">
            <span className="font-medium">Feedback Scorecard</span>
            <span className="text-xs text-gray-500 mt-1">Structured interview feedback</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};