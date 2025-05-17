import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FaCheck, FaTimes, FaFileInvoiceDollar, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { getTimesheets, approveTimesheet, rejectTimesheet, generatePaycheck } from '../services/timesheetService';

const TimeSheetApproval = () => {
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState([]);
  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [approvedTimesheets, setApprovedTimesheets] = useState([]);
  const [rejectedTimesheets, setRejectedTimesheets] = useState([]);

  useEffect(() => {
    // Load timesheets
    const allTimesheets = getTimesheets();
    setTimesheets(allTimesheets);
    
    // Filter timesheets by status
    setPendingTimesheets(allTimesheets.filter(ts => ts.status === 'pending'));
    setApprovedTimesheets(allTimesheets.filter(ts => ts.status === 'approved'));
    setRejectedTimesheets(allTimesheets.filter(ts => ts.status === 'rejected'));
  }, []);

  const handleApprove = (timesheetId) => {
    // Find the timesheet to approve
    const timesheet = timesheets.find(ts => ts.id === timesheetId);
    if (!timesheet) return;
    
    // Navigate to payment processing with the timesheet data
    navigate(`/payment/process/${timesheetId}`, { state: { timesheet } });
  };

  const handleReject = (timesheetId) => {
    const result = rejectTimesheet(timesheetId);
    if (result.success) {
      // Update timesheet lists
      const updatedTimesheets = timesheets.map(ts => 
        ts.id === timesheetId ? { ...ts, status: 'rejected', approved: false } : ts
      );
      setTimesheets(updatedTimesheets);
      setPendingTimesheets(updatedTimesheets.filter(ts => ts.status === 'pending'));
      setRejectedTimesheets(updatedTimesheets.filter(ts => ts.status === 'rejected'));
      
      alert('Timesheet rejected.');
    }
  };

  const handleGeneratePaycheck = (timesheetId) => {
    // Find the timesheet
    const timesheet = timesheets.find(ts => ts.id === timesheetId);
    if (!timesheet) return;
    
    // Navigate to payment processing with the timesheet data
    navigate(`/payment/process/${timesheetId}`, { state: { timesheet } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotalHours = (entries) => {
    if (!entries || !Array.isArray(entries)) return 0;
    
    return entries.reduce((total, entry) => {
      if (!entry.hours) return total;
      
      const [hours, minutes] = entry.hours.split(':').map(Number);
      return total + hours + (minutes / 60);
    }, 0).toFixed(1);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Redirect to login page
    navigate('/employer-login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4"
              onClick={() => navigate('/employer-dashboard')}
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Timesheet Approval</h1>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </Button>
        </div>
        
        {/* Pending Timesheets */}
        <h2 className="text-xl font-semibold mb-4">Pending Timesheets</h2>
        {pendingTimesheets.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No pending timesheets
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-8">
            {pendingTimesheets.map(timesheet => (
              <Card key={timesheet.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{timesheet.jobTitle || 'Timesheet'}</h3>
                      <p className="text-gray-600">Employee: {timesheet.userEmail || timesheet.userName}</p>
                      <p className="text-gray-500 text-sm">Week: {formatDate(timesheet.weekStartDate)} - {formatDate(timesheet.weekEndDate)}</p>
                      <p className="text-gray-500 text-sm">Total Hours: {calculateTotalHours(timesheet.entries)}</p>
                      <p className="text-gray-500 text-sm">Submitted: {formatDate(timesheet.submittedDate)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleApprove(timesheet.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <FaCheck className="mr-2" /> Approve
                      </Button>
                      <Button 
                        onClick={() => handleReject(timesheet.id)}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <FaTimes className="mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Approved Timesheets */}
        <h2 className="text-xl font-semibold mb-4 mt-8">Approved Timesheets</h2>
        {approvedTimesheets.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No approved timesheets
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedTimesheets.map(timesheet => (
              <Card key={timesheet.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{timesheet.jobTitle || 'Timesheet'}</h3>
                      <p className="text-gray-600">Employee: {timesheet.userEmail || timesheet.userName}</p>
                      <p className="text-gray-500 text-sm">Week: {formatDate(timesheet.weekStartDate)} - {formatDate(timesheet.weekEndDate)}</p>
                      <p className="text-gray-500 text-sm">Total Hours: {calculateTotalHours(timesheet.entries)}</p>
                      <p className="text-gray-500 text-sm">Approved: {formatDate(timesheet.approvedDate)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Approved
                      </div>
                      <Button 
                        onClick={() => handleGeneratePaycheck(timesheet.id)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <FaFileInvoiceDollar className="mr-2" /> Generate Paycheck
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSheetApproval;