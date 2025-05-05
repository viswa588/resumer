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
  getFormattedTimesheets: jest.fn()
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
});