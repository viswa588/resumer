import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TimeSheetApproval from '../TimeSheetApproval';
import { sampleTimesheets } from '../../data/sampleData';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock PaymentProcessing component
jest.mock('../PaymentProcessing', () => {
  return function MockPaymentProcessing() {
    return <div data-testid="payment-processing">Payment Processing</div>;
  };
});

describe('TimeSheetApproval', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.clear();
    
    // Setup localStorage with sample timesheet data
    localStorageMock.setItem('timesheets', JSON.stringify(sampleTimesheets));
  });

  test('renders timesheet approval page with sample data', async () => {
    render(
      <BrowserRouter>
        <TimeSheetApproval />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      // Check for page title
      expect(screen.getByText('Timesheet Approvals')).toBeInTheDocument();
      
      // Check for table headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Week Ending')).toBeInTheDocument();
      expect(screen.getByText('Total Hours')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      
      // Check for filter options
      expect(screen.getByPlaceholderText('Search by name or ID...')).toBeInTheDocument();
    });
  });

  test('displays correct number of timesheets from sample data', async () => {
    render(
      <BrowserRouter>
        <TimeSheetApproval />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      // Count the number of pending timesheets in the sample data
      const pendingTimesheets = sampleTimesheets.filter(ts => ts.status === 'Pending');
      
      // Check for View buttons (one for each timesheet)
      const viewButtons = screen.getAllByText('View');
      expect(viewButtons.length).toBe(sampleTimesheets.length);
      
      // Check for Approve buttons (one for each pending timesheet)
      const approveButtons = screen.getAllByText('Approve');
      expect(approveButtons.length).toBe(pendingTimesheets.length);
      
      // Check for Reject buttons (one for each pending timesheet)
      const rejectButtons = screen.getAllByText('Reject');
      expect(rejectButtons.length).toBe(pendingTimesheets.length);
      
      // Check that timesheet data is displayed
      sampleTimesheets.forEach(timesheet => {
        expect(screen.getByText(timesheet.userName)).toBeInTheDocument();
        expect(screen.getByText(timesheet.userId)).toBeInTheDocument();
        expect(screen.getByText(timesheet.jobTitle)).toBeInTheDocument();
        expect(screen.getByText(timesheet.weekEnding)).toBeInTheDocument();
        expect(screen.getByText(timesheet.totalHours.toString())).toBeInTheDocument();
      });
    });
  });
});