// components/TimeSheetEntry.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { format } from "date-fns";
import { jobs } from "../data/jobs";
import { updateTimesheetInLocalStorage } from "../lib/timesheetUtils";
import { useNotification } from "../context/NotificationContext";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TimeSheetEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addTimesheetNotification } = useNotification();
  const [currentJob, setCurrentJob] = useState(null);
  const [entries, setEntries] = useState([
    {
      project: "",
      task: "",
      hours: ["", "", "", "", "", "", ""],
    },
  ]);

  // Load job details if ID is provided
  useEffect(() => {
    if (id) {
      const jobId = parseInt(id);
      const foundJob = jobs.find(j => j.id === jobId);
      
      if (foundJob) {
        setCurrentJob(foundJob);
        
        // Pre-populate the first entry with the job details
        const updatedEntries = [...entries];
        updatedEntries[0].project = `${foundJob.title} - ${foundJob.company}`;
        setEntries(updatedEntries);
      }
    }
  }, [id]);

  // Get projects - include current job if available
  const getProjects = () => {
    const defaultProjects = [
      { id: 1, name: "Project A" },
      { id: 2, name: "Project B" },
      { id: 3, name: "Project C" },
    ];
    
    if (currentJob) {
      return [
        { id: currentJob.id, name: `${currentJob.title} - ${currentJob.company}` },
        ...defaultProjects
      ];
    }
    
    return defaultProjects;
  };

  const projects = getProjects();

  const tasks = [
    { id: 1, name: "Task A" },
    { id: 2, name: "Task B" },
    { id: 3, name: "Task C" },
    { id: 4, name: "Task D" },
  ];

  const handleEntryChange = (rowIndex, field, value) => {
    const updated = [...entries];
    updated[rowIndex][field] = value;
    setEntries(updated);
  };

  const handleHourChange = (rowIndex, dayIndex, value) => {
    const updated = [...entries];
    updated[rowIndex].hours[dayIndex] = value;
    setEntries(updated);
  };

  const handleAddRow = () => {
    setEntries([...entries, { project: "", task: "", hours: ["", "", "", "", "", "", ""] }]);
  };

  const calculateTotal = (dayIndex) => {
    return entries.reduce((sum, entry) => {
      const val = parseFloat(entry.hours[dayIndex]);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate total hours
    const totalHours = entries.reduce((sum, entry) => {
      return sum + entry.hours.reduce((hourSum, hour) => {
        const hourValue = parseFloat(hour);
        return hourSum + (isNaN(hourValue) ? 0 : hourValue);
      }, 0);
    }, 0);
    
    // Save timesheet entries to localStorage
    const timesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
    const newTimesheet = {
      id: Date.now(),
      jobId: currentJob ? currentJob.id : null,
      userId: "user123", // This would normally come from authentication
      userName: "John Doe", // This would normally come from authentication
      jobTitle: currentJob ? currentJob.title : "General",
      weekEnding: new Date().toISOString().split('T')[0], // Use current date as week ending
      totalHours: totalHours,
      status: "Pending",
      submittedDate: new Date().toISOString(),
      date: new Date().toISOString(),
      entries: entries,
    };
    
    timesheets.push(newTimesheet);
    localStorage.setItem('timesheets', JSON.stringify(timesheets));
    
    // Also update the individual timesheet in localStorage using the new function
    updateTimesheetInLocalStorage(newTimesheet);
    
    // Add notification for timesheet submission
    addTimesheetNotification('submitted', newTimesheet.date, newTimesheet.id);
    
    // Navigate back to profile or timesheet list
    if (currentJob) {
      navigate('/profile');
    } else {
      navigate('/timesheet/list');
    }
  };

  const handleGoBack = () => {
    navigate(currentJob ? '/profile' : '/timesheet/list');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
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
                <CardTitle className="text-2xl font-bold">Timesheet Entry</CardTitle>
              </div>
              <CardDescription>
                {currentJob 
                  ? `Enter your hours for ${currentJob.title} at ${currentJob.company}`
                  : "Enter your project hours for the week"
                }
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleAddRow}>Add Row</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left border">Project</th>
                      <th className="p-2 text-left border">Task Description</th>
                      {daysOfWeek.map((day, idx) => (
                        <th key={idx} className="p-2 border">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="p-2 border">
                          <Select
                            value={entry.project}
                            onValueChange={(value) => handleEntryChange(rowIndex, "project", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((proj) => (
                                <SelectItem key={proj.id} value={proj.name}>{proj.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 border">
                          <Select
                            value={entry.task}
                            onValueChange={(value) => handleEntryChange(rowIndex, "task", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select task" />
                            </SelectTrigger>
                            <SelectContent>
                              {tasks.map((task) => (
                                <SelectItem key={task.id} value={task.name}>{task.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        {entry.hours.map((val, dayIndex) => (
                          <td key={dayIndex} className="p-2 border">
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              value={val}
                              onChange={(e) => handleHourChange(rowIndex, dayIndex, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="p-2 border text-right" colSpan={2}>Total</td>
                      {daysOfWeek.map((_, idx) => (
                        <td key={idx} className="p-2 border">{calculateTotal(idx)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" type="button">Save Draft</Button>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TimeSheetEntry;