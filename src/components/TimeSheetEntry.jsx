import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';
import { submitTimesheet } from '../services/timesheetService';
import { getApprovedJobIds } from '../services/applicationService';
import { jobs } from '../data/jobs';

const TimeSheetEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Job ID if provided
  const [selectedJob, setSelectedJob] = useState(null);
  const [approvedJobs, setApprovedJobs] = useState([]);
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [entries, setEntries] = useState([{ day: 'Monday', hours: '00:00', description: '' }]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get current user email
    const userEmail = localStorage.getItem('userEmail') || '';
    
    // Get approved job IDs for the user
    const approvedJobIds = getApprovedJobIds(userEmail);
    
    if (approvedJobIds.length === 0) {
      setError('You do not have any approved jobs. Please apply for jobs and wait for approval.');
      return;
    }
    
    // Load approved jobs
    const approvedJobsData = jobs.filter(job => approvedJobIds.includes(job.id));
    setApprovedJobs(approvedJobsData);
    
    // If job ID is provided in URL, select that job
    if (id) {
      const jobId = parseInt(id);
      const job = approvedJobsData.find(j => j.id === jobId);
      if (job) {
        setSelectedJob(job);
      } else {
        setError('Selected job not found or not approved.');
      }
    } else if (approvedJobsData.length > 0) {
      // Default to first approved job
      setSelectedJob(approvedJobsData[0]);
    }
    
    // Set default week dates (current week)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate start of week (Monday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    // Calculate end of week (Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    // Format dates as YYYY-MM-DD for input fields
    setWeekStartDate(startDate.toISOString().split('T')[0]);
    setWeekEndDate(endDate.toISOString().split('T')[0]);
  }, [id]);

  const addEntry = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const usedDays = entries.map(entry => entry.day);
    const availableDays = days.filter(day => !usedDays.includes(day));
    
    if (availableDays.length === 0) {
      setError('All days of the week have been added.');
      return;
    }
    
    setEntries([...entries, { day: availableDays[0], hours: '00:00', description: '' }]);
  };

  const removeEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const validateForm = () => {
    if (!selectedJob) {
      setError('Please select a job.');
      return false;
    }
    
    if (!weekStartDate || !weekEndDate) {
      setError('Please select week start and end dates.');
      return false;
    }
    
    if (entries.length === 0) {
      setError('Please add at least one time entry.');
      return false;
    }
    
    // Validate each entry
    for (const entry of entries) {
      if (!entry.day || !entry.hours) {
        setError('Please fill in all required fields for each entry.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create timesheet object
      const timesheet = {
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        companyName: selectedJob.company,
        userEmail: localStorage.getItem('userEmail') || '',
        weekStartDate,
        weekEndDate,
        entries,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Submit timesheet
      const result = submitTimesheet(timesheet);
      
      if (result.success) {
        alert('Timesheet submitted successfully. It will be available after approval by the employer.');
        navigate('/timesheet/list');
      } else {
        setError(result.message || 'Failed to submit timesheet.');
      }
    } catch (err) {
      setError('An error occurred while submitting the timesheet.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/profile')}
          >
            <FaArrowLeft className="mr-2" /> Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">Submit Timesheet</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="job">Job</Label>
                  <select
                    id="job"
                    className="w-full p-2 border rounded-md mt-1"
                    value={selectedJob?.id || ''}
                    onChange={(e) => {
                      const jobId = parseInt(e.target.value);
                      const job = approvedJobs.find(j => j.id === jobId);
                      setSelectedJob(job);
                    }}
                    disabled={approvedJobs.length === 0}
                  >
                    <option value="">Select a job</option>
                    {approvedJobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weekStartDate">Week Start</Label>
                    <Input
                      id="weekStartDate"
                      type="date"
                      value={weekStartDate}
                      onChange={(e) => setWeekStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weekEndDate">Week End</Label>
                    <Input
                      id="weekEndDate"
                      type="date"
                      value={weekEndDate}
                      onChange={(e) => setWeekEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Time Entries</h3>
                  <Button 
                    type="button"
                    onClick={addEntry}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <FaPlus className="mr-2" /> Add Day
                  </Button>
                </div>
                
                {entries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                    <div className="col-span-3">
                      <Label htmlFor={`day-${index}`}>Day</Label>
                      <select
                        id={`day-${index}`}
                        className="w-full p-2 border rounded-md mt-1"
                        value={entry.day}
                        onChange={(e) => updateEntry(index, 'day', e.target.value)}
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`hours-${index}`}>Hours</Label>
                      <Input
                        id={`hours-${index}`}
                        type="time"
                        value={entry.hours}
                        onChange={(e) => updateEntry(index, 'hours', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-6">
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Input
                        id={`description-${index}`}
                        type="text"
                        placeholder="Work description"
                        value={entry.description}
                        onChange={(e) => updateEntry(index, 'description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 p-2"
                        onClick={() => removeEntry(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Timesheet'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeSheetEntry;