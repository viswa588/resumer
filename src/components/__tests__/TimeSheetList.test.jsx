import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TimeSheetList from '../TimeSheetList';
import { sampleTimesheets } from '../../data/sampleData';
import * as timesheetUtils from '../../lib/timesheetUtils';

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({}),
  useNavigate: jest.fn()
}));

// Mock the timesheetUtils module
jest.mock('../../lib/timesheetUtils', () => ({
  getFormattedTimesheets: jest.fn(),
  updateTimesheetInLocalStorage: jest.fn()
}));

describe('TimeSheetList', () => {
  beforeEach(() => {
    // Mock the getFormattedTimesheets function to return formatted sample data
    const formattedTimesheets = sampleTimesheets.map(ts => ({
      id: ts.id,
      studentName: ts.userName,
      studentId: ts.userId,
      weekEnding: ts.weekEnding,
      totalHours: ts.totalHours,
      status: ts.status,
      department: ts.jobTitle,
      submittedDate: ts.submittedDate,
      jobId: ts.jobId,
      entries: ts.entries
    }));
    
    timesheetUtils.getFormattedTimesheets.mockReturnValue(formattedTimesheets);
  });

  test('renders timesheet list with sample data', () => {
    render(
      <BrowserRouter>
        <TimeSheetList />
      </BrowserRouter>
    );
    
    // Check for page title
    expect(screen.getByText('Submitted Timesheets')).toBeInTheDocument();
    
    // Check for table headers
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Job')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Total Hours')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check that the utility function was called
    expect(timesheetUtils.getFormattedTimesheets).toHaveBeenCalled();
  });
  
  test('correctly calculates total hours with mixed values', () => {
    // Create a timesheet with mixed hour values
    const timesheetWithMixedValues = [{
      id: 999,
      studentName: 'Test Student',
      studentId: 'test123',
      weekEnding: '2023-01-07',
      totalHours: 0, // This will be recalculated by the component
      status: 'Pending',
      department: 'Test Department',
      submittedDate: '2023-01-01',
      jobId: 1,
      entries: [
        {
          project: 'Test Project',
          task: 'Test Task',
          hours: ['2.5', '3', '', null, undefined, 'invalid', '4.5']
        },
        {
          project: 'Test Project 2',
          task: 'Test Task 2',
          hours: ['1.5', '2.5', '3', '', '0', null, undefined]
        }
      ]
    }];
    
    timesheetUtils.getFormattedTimesheets.mockReturnValue(timesheetWithMixedValues);
    
    render(
      <BrowserRouter>
        <TimeSheetList />
      </BrowserRouter>
    );
    
    // The total should be 2.5 + 3 + 0 + 0 + 0 + 0 + 4.5 + 1.5 + 2.5 + 3 + 0 + 0 + 0 + 0 = 17.0
    expect(screen.getByText('17.00')).toBeInTheDocument();
  });
  
  test('correctly calculates total hours with single value format', () => {
    // Create a timesheet with single value hours
    const timesheetWithSingleValues = [{
      id: 998,
      studentName: 'Test Student',
      studentId: 'test123',
      weekEnding: '2023-01-07',
      totalHours: 0, // This will be recalculated by the component
      status: 'Pending',
      department: 'Test Department',
      submittedDate: '2023-01-01',
      jobId: 1,
      entries: [
        {
          date: '2023-01-01',
          hours: 8,
          task: 'Development',
          description: 'Implemented new features'
        },
        {
          date: '2023-01-02',
          hours: 7.5,
          task: 'Testing',
          description: 'Unit testing'
        },
        {
          date: '2023-01-03',
          hours: '6.5',
          task: 'Documentation',
          description: 'API documentation'
        }
      ]
    }];
    
    timesheetUtils.getFormattedTimesheets.mockReturnValue(timesheetWithSingleValues);
    
    render(
      <BrowserRouter>
        <TimeSheetList />
      </BrowserRouter>
    );
    
    // The total should be 8 + 7.5 + 6.5 = 22.0
    expect(screen.getByText('22.00')).toBeInTheDocument();
  });
});