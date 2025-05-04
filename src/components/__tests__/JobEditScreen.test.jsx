import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobEditScreen from '../JobEditScreen';
import '@testing-library/jest-dom';

// Mock useNavigate and useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '123' }),
}));

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('JobEditScreen Component', () => {
  const mockJob = {
    id: 123,
    title: 'Software Developer',
    company: 'Tech Company',
    location: 'Remote',
    salary: '$100,000',
    jobType: 'Full-time',
    description: 'This is a job description',
    requirements: ['React', 'JavaScript'],
    applicationDeadline: '2023-12-31',
    experienceLevel: 'Mid-level',
    contactEmail: 'test@example.com',
    employerEmail: 'test@example.com',
    postedDate: '2023-01-01T00:00:00.000Z',
    status: 'active'
  };

  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.clear();
    
    // Set up mock job in localStorage
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'employerJobs') {
        return JSON.stringify([mockJob]);
      }
      return null;
    });
  });

  test('renders job edit form with job data', async () => {
    render(
      <BrowserRouter>
        <JobEditScreen />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Edit Job')).toBeInTheDocument();
      expect(screen.getByLabelText('Job Title')).toHaveValue('Software Developer');
      expect(screen.getByLabelText('Company Name')).toHaveValue('Tech Company');
      expect(screen.getByLabelText('Location')).toHaveValue('Remote');
      expect(screen.getByLabelText('Job Description')).toHaveValue('This is a job description');
    });
  });

  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <JobEditScreen />
      </BrowserRouter>
    );
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText('Job Title')).toHaveValue('Software Developer');
    });
    
    // Clear required fields
    fireEvent.change(screen.getByLabelText('Job Title'), {
      target: { value: '' }
    });
    
    fireEvent.change(screen.getByLabelText('Company Name'), {
      target: { value: '' }
    });
    
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: '' }
    });
    
    fireEvent.change(screen.getByLabelText('Job Description'), {
      target: { value: '' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Job title is required')).toBeInTheDocument();
      expect(screen.getByText('Company name is required')).toBeInTheDocument();
      expect(screen.getByText('Location is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  test('submits form with updated data', async () => {
    render(
      <BrowserRouter>
        <JobEditScreen />
      </BrowserRouter>
    );
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText('Job Title')).toHaveValue('Software Developer');
    });
    
    // Update form fields
    fireEvent.change(screen.getByLabelText('Job Title'), {
      target: { value: 'Senior Software Developer' }
    });
    
    fireEvent.change(screen.getByLabelText('Salary'), {
      target: { value: '$120,000' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Check that localStorage.setItem was called
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'employerJobs',
        expect.any(String)
      );
      
      // Check that the updated job was saved
      const savedJobs = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedJobs[0].title).toBe('Senior Software Developer');
      expect(savedJobs[0].salary).toBe('$120,000');
    });
  });

  test('shows error when job not found', async () => {
    // Mock empty jobs array
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'employerJobs') {
        return JSON.stringify([]);
      }
      return null;
    });
    
    render(
      <BrowserRouter>
        <JobEditScreen />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Job not found/i)).toBeInTheDocument();
      expect(screen.getByText('Back to Job Management')).toBeInTheDocument();
    });
  });
});