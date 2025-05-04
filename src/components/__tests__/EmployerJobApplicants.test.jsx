import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmployerJobApplicants from '../EmployerJobApplicants';
import { sampleJobApplicants, sampleEmployerJobs } from '../../data/sampleData';

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

// Mock useNavigate and useParams
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ jobId: '1' }) // Mock jobId param
}));

describe('EmployerJobApplicants', () => {
  beforeEach(() => {
    // Clear localStorage mock and reset navigate mock
    localStorageMock.clear();
    mockNavigate.mockReset();
    
    // Setup localStorage with sample data
    localStorageMock.setItem('employerJobs', JSON.stringify(sampleEmployerJobs));
    localStorageMock.setItem('jobApplicants', JSON.stringify(sampleJobApplicants));
  });

  test('renders job applicants page with sample data', async () => {
    render(
      <BrowserRouter>
        <EmployerJobApplicants />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      // Check for page title
      expect(screen.getByText('Job Applicants')).toBeInTheDocument();
      
      // Check for table headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Applied Date')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
      
      // Check for filter options
      expect(screen.getByPlaceholderText('Search applicants...')).toBeInTheDocument();
    });
  });

  test('displays correct applicants for the job', async () => {
    render(
      <BrowserRouter>
        <EmployerJobApplicants />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      // Get applicants for job with id 1
      const jobApplicants = sampleJobApplicants.filter(app => app.jobId === 1);
      
      // Check that each applicant is displayed
      jobApplicants.forEach(applicant => {
        expect(screen.getByText(applicant.name)).toBeInTheDocument();
        expect(screen.getByText(applicant.email)).toBeInTheDocument();
      });
      
      // Check for View buttons (one for each applicant)
      const viewButtons = screen.getAllByText('View');
      expect(viewButtons.length).toBe(jobApplicants.length);
      
      // Check for Approve/Reject buttons for pending applicants
      const pendingApplicants = jobApplicants.filter(app => app.status === 'pending');
      if (pendingApplicants.length > 0) {
        const approveButtons = screen.getAllByText('Approve');
        expect(approveButtons.length).toBe(pendingApplicants.length);
        
        const rejectButtons = screen.getAllByText('Reject');
        expect(rejectButtons.length).toBe(pendingApplicants.length);
      }
    });
  });

  test('redirects if job not found', async () => {
    // Mock useParams to return a non-existent job ID
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ jobId: '999' });
    
    render(
      <BrowserRouter>
        <EmployerJobApplicants />
      </BrowserRouter>
    );
    
    // Wait for navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/employer-job-management');
    });
  });
});