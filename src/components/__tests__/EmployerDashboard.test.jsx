import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmployerDashboard from '../EmployerDashboard';
import { sampleJobApplicants, sampleTimesheets, sampleEmployerJobs } from '../../data/sampleData';

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

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('EmployerDashboard', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.clear();
    
    // Setup localStorage with sample data
    const mockData = {
      employerJobs: sampleEmployerJobs,
      jobApplicants: sampleJobApplicants,
      timesheets: sampleTimesheets,
      userEmail: 'employer@example.com'
    };
    
    // Add each item to localStorage
    Object.entries(mockData).forEach(([key, value]) => {
      if (key === 'userEmail') {
        localStorageMock.setItem(key, value);
      } else {
        localStorageMock.setItem(key, JSON.stringify(value));
      }
    });
  });

  test('renders dashboard with sample data', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      // Check for dashboard title
      expect(screen.getByText('Employer Dashboard')).toBeInTheDocument();
      
      // Check for stats
      expect(screen.getByText('Total Applicants')).toBeInTheDocument();
      expect(screen.getByText('Pending Timesheets')).toBeInTheDocument();
      
      // Check for recent applicants section
      expect(screen.getByText('Recent Applicants')).toBeInTheDocument();
      
      // Check for recent jobs section
      expect(screen.getByText('Recent Job Postings')).toBeInTheDocument();
    });
  });

  test('displays correct stats from sample data', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load and check stats
    await waitFor(() => {
      // Count of pending timesheets (status === 'Pending')
      const pendingTimesheets = sampleTimesheets.filter(
        ts => ts.status === 'Pending' && 
        sampleEmployerJobs.some(job => job.id === ts.jobId && job.employerEmail === 'employer@example.com')
      ).length;
      
      // Count of total applicants for employer's jobs
      const totalApplicants = sampleJobApplicants.filter(
        app => sampleEmployerJobs.some(
          job => job.id === app.jobId && job.employerEmail === 'employer@example.com'
        )
      ).length;
      
      // Count of pending approvals
      const pendingApprovals = sampleJobApplicants.filter(
        app => app.status === 'pending' && 
        sampleEmployerJobs.some(
          job => job.id === app.jobId && job.employerEmail === 'employer@example.com'
        )
      ).length;
      
      // Check that the stats are displayed correctly
      const statsElements = screen.getAllByText(/\d+/);
      expect(statsElements.length).toBeGreaterThan(0);
      
      // Check for specific stats (this assumes the order of the stats cards)
      const postedJobsCount = sampleEmployerJobs.filter(job => job.employerEmail === 'employer@example.com').length;
      const activeJobsCount = sampleEmployerJobs.filter(job => job.status === 'active' && job.employerEmail === 'employer@example.com').length;
      
      // Verify stats are displayed
      expect(screen.getByText(postedJobsCount.toString())).toBeInTheDocument();
      expect(screen.getByText(activeJobsCount.toString())).toBeInTheDocument();
      expect(screen.getByText(totalApplicants.toString())).toBeInTheDocument();
      expect(screen.getByText(pendingApprovals.toString())).toBeInTheDocument();
      expect(screen.getByText(pendingTimesheets.toString())).toBeInTheDocument();
    });
  });
});