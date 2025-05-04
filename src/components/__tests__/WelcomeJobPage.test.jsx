import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WelcomeJobPage from '../WelcomeJobPage';

// Mock the jobs data
jest.mock('../../data/jobs', () => ({
  jobs: [
    {
      id: 1,
      title: "Test Job",
      company: "Test Company",
      location: "Test Location",
      salary: "$100,000",
      jobType: "Full-time",
      contactEmail: "test@example.com"
    }
  ]
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' })
}));

describe('WelcomeJobPage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });
  
  test('renders welcome message and job details', () => {
    render(
      <MemoryRouter initialEntries={['/welcome-job/1']}>
        <Routes>
          <Route path="/welcome-job/:id" element={<WelcomeJobPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Check for welcome message
    expect(screen.getByText('Congratulations!')).toBeInTheDocument();
    expect(screen.getByText("You've accepted the job offer!")).toBeInTheDocument();
    
    // Check for job details
    expect(screen.getByText('Welcome to Test Company')).toBeInTheDocument();
    expect(screen.getByText('Test Job', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Check for next steps section
    expect(screen.getByText('Next Steps')).toBeInTheDocument();
  });
  
  test('navigates back to jobs when button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/welcome-job/1']}>
        <Routes>
          <Route path="/welcome-job/:id" element={<WelcomeJobPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Back to Jobs'));
    expect(mockNavigate).toHaveBeenCalledWith('/jobs');
  });
  
  test('shows error when job is not found', () => {
    // Override the useParams mock for this test
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: '999' });
    
    render(
      <MemoryRouter initialEntries={['/welcome-job/999']}>
        <Routes>
          <Route path="/welcome-job/:id" element={<WelcomeJobPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Job Not Found')).toBeInTheDocument();
  });
});