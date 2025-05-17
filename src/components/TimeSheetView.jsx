import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./ui/table";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { jobs } from "../data/jobs";
import { calculateHours } from "../lib/hourUtils";

const TimeSheetView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timesheet, setTimesheet] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load the timesheet from localStorage
    const loadTimesheet = () => {
      try {
        // First try to get the specific timesheet from localStorage
        const storedTimesheet = localStorage.getItem('timesheet');
        if (storedTimesheet) {
          const parsedTimesheet = JSON.parse(storedTimesheet);
          if (parsedTimesheet.id === parseInt(id)) {
            setTimesheet(parsedTimesheet);
            
            // Find the job details
            const jobData = jobs.find(j => j.id === parsedTimesheet.jobId);
            if (jobData) {
              setJob(jobData);
            }
            
            setLoading(false);
            return;
          }
        }
        
        // If not found in the specific timesheet storage, look in all timesheets
        const allTimesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
        const foundTimesheet = allTimesheets.find(ts => ts.id === parseInt(id));
        
        if (foundTimesheet) {
          setTimesheet(foundTimesheet);
          
          // Find the job details
          const jobData = jobs.find(j => j.id === foundTimesheet.jobId);
          if (jobData) {
            setJob(jobData);
          }
          
          setLoading(false);
        } else {
          setError("Timesheet not found");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading timesheet:", err);
        setError("Failed to load timesheet data");
        setLoading(false);
      }
    };
    
    loadTimesheet();
  }, [id]);

  const handleGoBack = () => {
    navigate('/timesheet/list');
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <Badge className="bg-green-100 text-green-800 border border-green-300">Approved</Badge>;
    } else if (status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 border border-red-300">Rejected</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Pending</Badge>;
    }
  };

  const calculateTotalHours = (entries) => {
    if (!entries || !Array.isArray(entries)) {
      return 0;
    }
    return entries.reduce((total, entry) => {
      if (!entry || !entry.hours) {
        return total;
      }
      return total + calculateHours(entry.hours);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <p>Loading timesheet data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={handleGoBack}>Back to Timesheets</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!timesheet) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-red-500 mb-4">Timesheet not found</p>
              <Button onClick={handleGoBack}>Back to Timesheets</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center mb-4">
              <button 
                onClick={handleGoBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Timesheets
              </button>
              <CardTitle className="text-2xl font-bold">Timesheet Details</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {job ? `${job.title} at ${job.company}` : timesheet.jobTitle || "Job Details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Timesheet Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Week:</div>
                    <div>{formatDate(timesheet.weekStartDate)} - {formatDate(timesheet.weekEndDate)}</div>
                    
                    <div className="text-gray-600">Submitted:</div>
                    <div>{formatDate(timesheet.submittedDate)}</div>
                    
                    <div className="text-gray-600">Status:</div>
                    <div>{getStatusBadge(timesheet.status)}</div>
                    
                    <div className="text-gray-600">Total Hours:</div>
                    <div>{calculateTotalHours(timesheet.entries).toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Job Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Job Title:</div>
                    <div>{job?.title || timesheet.jobTitle || "N/A"}</div>
                    
                    <div className="text-gray-600">Company:</div>
                    <div>{job?.company || "N/A"}</div>
                    
                    <div className="text-gray-600">Location:</div>
                    <div>{job?.location || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Time Entries</h3>
            {timesheet.entries && timesheet.entries.length > 0 ? (
              <Table className="w-full border border-gray-300">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableCell className="font-semibold p-2 border">Day</TableCell>
                    <TableCell className="font-semibold p-2 border">Hours</TableCell>
                    <TableCell className="font-semibold p-2 border">Description</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheet.entries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="p-2 border">{entry.day}</TableCell>
                      <TableCell className="p-2 border">{entry.hours}</TableCell>
                      <TableCell className="p-2 border">{entry.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">No time entries found</p>
            )}
            
            {timesheet.status === 'approved' && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Approval Information</h3>
                <p className="text-green-700">
                  This timesheet was approved on {formatDate(timesheet.approvedDate)}.
                </p>
              </div>
            )}
            
            {timesheet.status === 'rejected' && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Information</h3>
                <p className="text-red-700">
                  This timesheet was rejected on {formatDate(timesheet.rejectedDate)}.
                  {timesheet.rejectionReason && (
                    <span className="block mt-2">Reason: {timesheet.rejectionReason}</span>
                  )}
                </p>
              </div>
            )}
            
            {timesheet.status === 'pending' && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pending Approval</h3>
                <p className="text-yellow-700">
                  This timesheet is waiting for approval from your employer.
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleGoBack}>Back to Timesheets</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeSheetView;