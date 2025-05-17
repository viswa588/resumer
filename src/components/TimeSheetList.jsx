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
import { getFormattedTimesheets, updateTimesheetInLocalStorage } from "../lib/timesheetUtils";
import { calculateHours } from "../lib/hourUtils";

const TimeSheetList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timesheets, setTimesheets] = useState([]);
  const [jobFilter, setJobFilter] = useState(null);

  useEffect(() => {
    // Get formatted timesheets using the utility function
    let timesheetsData = getFormattedTimesheets();
    
    // If we have a specific job ID to filter by
    if (id) {
      const jobId = parseInt(id);
      timesheetsData = timesheetsData.filter(ts => ts.jobId === jobId);
      
      // Find the job details
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        setJobFilter(job);
      }
    }
    
    setTimesheets(timesheetsData);
  }, [id]);

  const handleEdit = (timesheetId) => {
    navigate(`/timesheet/edit/${timesheetId}`);
  };

  const handleView = (timesheetId) => {
    // Find the timesheet in the list
    const timesheet = timesheets.find(ts => ts.id === timesheetId);
    
    if (timesheet) {
      // Find the original timesheet in localStorage
      const storedTimesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
      const originalTimesheet = storedTimesheets.find(ts => ts.id === timesheetId);
      
      if (originalTimesheet) {
        // Update the individual timesheet in localStorage
        updateTimesheetInLocalStorage(originalTimesheet);
      }
    }
    
    navigate(`/timesheet/view/${timesheetId}`);
  };

  const handleGoBack = () => {
    navigate('/profile');
  };

  const getWeekRange = (dateStr) => {
    const date = new Date(dateStr);
    // Get the start of the week (Monday)
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(date.setDate(diff));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
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

  const getJobName = (jobId) => {
    if (!jobId) return "N/A";
    const job = jobs.find(j => j.id === jobId);
    return job ? `${job.title} - ${job.company}` : "Unknown Job";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <div className="flex items-center mb-4">
              <button 
                onClick={handleGoBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back
              </button>
              <CardTitle className="text-2xl font-bold">Submitted Timesheets</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {jobFilter 
                ? `Timesheets for ${jobFilter.title} at ${jobFilter.company}`
                : "Overview of all submitted timesheets"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timesheets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No timesheets found.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate(jobFilter ? `/timesheet/new/${jobFilter.id}` : '/timesheet/new')}
                >
                  Create New Timesheet
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="table-auto w-full border border-gray-300 text-sm">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableCell className="font-semibold p-2 border">Date</TableCell>
                      {!jobFilter && (
                        <TableCell className="font-semibold p-2 border">Job</TableCell>
                      )}
                      <TableCell className="font-semibold p-2 border">Week</TableCell>
                      <TableCell className="font-semibold p-2 border">Total Hours</TableCell>
                      <TableCell className="font-semibold p-2 border">Status</TableCell>
                      <TableCell className="font-semibold p-2 border text-center">Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timesheets
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((ts) => {
                        const totalHours = calculateTotalHours(ts.entries);
                        return (
                          <TableRow key={ts.id} className="hover:bg-muted">
                            <TableCell className="p-2 border">
                              {new Date(ts.date).toLocaleDateString()}
                            </TableCell>
                            {!jobFilter && (
                              <TableCell className="p-2 border">{getJobName(ts.jobId)}</TableCell>
                            )}
                            <TableCell className="p-2 border">{getWeekRange(ts.date)}</TableCell>
                            <TableCell className="p-2 border">{totalHours.toFixed(2)}</TableCell>
                            <TableCell className="p-2 border">
                              {ts.status === 'approved' ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300">
                                  Approved
                                </Badge>
                              ) : ts.status === 'rejected' ? (
                                <Badge className="bg-red-100 text-red-800 border border-red-300">
                                  Rejected
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="p-2 border text-center">
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleView(ts.id)}>
                                  View
                                </Button>
                                {ts.status !== 'approved' && (
                                  <Button variant="outline" size="sm" onClick={() => handleEdit(ts.id)}>
                                    Edit
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeSheetList;