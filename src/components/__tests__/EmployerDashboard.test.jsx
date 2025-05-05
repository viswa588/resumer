import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
  
  test('stats cards are clickable and open modals', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Posted Jobs')).toBeInTheDocument();
    });
    
    // Find the stats cards
    const postedJobsCard = screen.getByText('Posted Jobs').closest('div').parentElement;
    const activeJobsCard = screen.getByText('Active Jobs').closest('div').parentElement;
    const totalApplicantsCard = screen.getByText('Total Applicants').closest('div').parentElement;
    const pendingApprovalsCard = screen.getByText('Pending Approvals').closest('div').parentElement;
    const pendingTimesheetsCard = screen.getByText('Pending Timesheets').closest('div').parentElement;
    
    // Click on Posted Jobs card and check if modal opens
    fireEvent.click(postedJobsCard);
    expect(screen.getByText('All jobs you have posted')).toBeInTheDocument();
    
    // Close the modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Click on Active Jobs card and check if modal opens
    fireEvent.click(activeJobsCard);
    expect(screen.getByText('Currently active job postings')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // Click on Total Applicants card and check if modal opens
    fireEvent.click(totalApplicantsCard);
    expect(screen.getByText('All applicants for your job postings')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // Click on Pending Approvals card and check if modal opens
    fireEvent.click(pendingApprovalsCard);
    expect(screen.getByText('Applicants waiting for your approval')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // Click on Pending Timesheets card and check if modal opens
    fireEvent.click(pendingTimesheetsCard);
    expect(screen.getByText('Timesheets waiting for your approval')).toBeInTheDocument();
  });

  // New tests for the enhanced features
  test('renders new performance metrics section', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      // Check for performance metrics section
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
      
      // Check for specific metrics
      expect(screen.getByText('Approval Rate')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
      expect(screen.getByText('Time to Hire')).toBeInTheDocument();
      expect(screen.getByText('Est. Revenue')).toBeInTheDocument();
    });
  });

  test('renders top performing jobs section', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      // Check for top performing jobs section
      expect(screen.getByText('Top Performing Jobs')).toBeInTheDocument();
      
      // Check for view all button
      expect(screen.getByText('View All')).toBeInTheDocument();
    });
  });

  test('financial insights modal opens and displays data', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Est. Revenue')).toBeInTheDocument();
    });
    
    // Find the Est. Revenue card and click it
    const revenueCard = screen.getByText('Est. Revenue').closest('div').parentElement;
    fireEvent.click(revenueCard);
    
    // Check if financial insights modal opens
    expect(screen.getByText('Financial Insights')).toBeInTheDocument();
    expect(screen.getByText('Revenue, costs, and profit analysis for your job postings')).toBeInTheDocument();
    
    // Check for financial metrics
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Cost')).toBeInTheDocument();
    expect(screen.getByText('Net Profit')).toBeInTheDocument();
    
    // Check for revenue by job table
    expect(screen.getByText('Revenue by Job')).toBeInTheDocument();
  });

  test('job performance modal opens and displays data', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Top Performing Jobs')).toBeInTheDocument();
    });
    
    // Find the View All button and click it
    const viewAllButton = screen.getByText('View All');
    fireEvent.click(viewAllButton);
    
    // Check if job performance modal opens
    expect(screen.getByText('Job Performance Analysis')).toBeInTheDocument();
    expect(screen.getByText('Detailed performance metrics for all your job postings')).toBeInTheDocument();
    
    // Check for sort options
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
    
    // Check for table headers
    expect(screen.getByText('Performance Score')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    expect(screen.getByText('Daily Rate')).toBeInTheDocument();
  });

  test('time filter changes update the dashboard', async () => {
    render(
      <BrowserRouter>
        <EmployerDashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Time Period:')).toBeInTheDocument();
    });
    
    // Find the time filter dropdown
    const timeFilter = screen.getByLabelText('Time Period:');
    
    // Change the filter to Last Month
    fireEvent.change(timeFilter, { target: { value: 'month' } });
    
    // Check that the filter value has changed
    expect(timeFilter.value).toBe('month');
  });
});