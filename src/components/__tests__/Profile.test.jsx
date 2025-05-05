import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../Profile';
import '@testing-library/jest-dom';

// Mock the jobs data
jest.mock('../../data/jobs', () => ({
  jobs: [
    {
      id: 1,
      title: "Test Job",
      company: "Test Company",
      location: "Test Location",
      description: "Test Description"
    }
  ]
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
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

// Mock window.open
window.open = jest.fn();

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not show roles and responsibilities link when no job is accepted', () => {
    // Setup localStorage with no accepted jobs
    localStorage.getItem.mockReturnValue('{}');
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Check that the "Your Current Position" section is not rendered
    expect(screen.queryByText('Your Current Position')).not.toBeInTheDocument();
    expect(screen.queryByText('View Roles & Responsibilities')).not.toBeInTheDocument();
  });
  
  test('shows roles and responsibilities link when a job is accepted', () => {
    // Setup localStorage with an accepted job
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'jobOfferStatuses') {
        return JSON.stringify({ '1': 'accepted' });
      }
      return null;
    });
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Check that the "Your Current Position" section is rendered
    expect(screen.getByText('Your Current Position')).toBeInTheDocument();
    expect(screen.getByText('Test Job')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('View Roles & Responsibilities')).toBeInTheDocument();
  });

  test('renders logout button', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Find the logout button by its title attribute
    const logoutButton = screen.getByTitle('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  test('logout button clears localStorage and navigates to login page', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    localStorage.removeItem = jest.fn();
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Find and click the logout button
    const logoutButton = screen.getByTitle('Logout');
    fireEvent.click(logoutButton);
    
    // Check that localStorage.removeItem was called
    expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userEmail');
    expect(localStorage.removeItem).toHaveBeenCalledWith('appliedJobs');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userResume');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userResumeFileName');
  });

  test('renders resume upload section', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Check that the resume section is rendered
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Upload Resume (PDF)')).toBeInTheDocument();
  });

  test('shows resume when one is stored in localStorage', () => {
    // Setup localStorage with a resume
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userResume') {
        return 'data:application/pdf;base64,test-pdf-data';
      }
      if (key === 'userResumeFileName') {
        return 'test-resume.pdf';
      }
      return null;
    });
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Check that the resume is displayed
    expect(screen.getByText('test-resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('clicking delete button removes the resume', () => {
    // Setup localStorage with a resume
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userResume') {
        return 'data:application/pdf;base64,test-pdf-data';
      }
      if (key === 'userResumeFileName') {
        return 'test-resume.pdf';
      }
      return null;
    });
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Find and click the delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    // Check that localStorage.removeItem was called
    expect(localStorage.removeItem).toHaveBeenCalledWith('userResume');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userResumeFileName');
  });

  test('clicking view button opens the resume in a new window', () => {
    // Setup localStorage with a resume
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userResume') {
        return 'data:application/pdf;base64,test-pdf-data';
      }
      if (key === 'userResumeFileName') {
        return 'test-resume.pdf';
      }
      return null;
    });
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Find and click the view button
    const viewButton = screen.getByText('View');
    fireEvent.click(viewButton);
    
    // Check that window.open was called
    expect(window.open).toHaveBeenCalled();
  });

  test('correctly calculates total hours from timesheet entries with mixed values - array format', () => {
    // Setup localStorage with a job and timesheet that has mixed values (numbers, empty strings, null, undefined)
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'jobOfferStatuses') {
        return JSON.stringify({ '1': 'accepted' });
      }
      if (key === 'timesheets') {
        return JSON.stringify([
          {
            id: 1,
            jobId: 1,
            date: new Date().toISOString(),
            entries: [
              {
                project: 'Test Project',
                task: 'Test Task',
                hours: ['2', '3', '', null, undefined, 'invalid', '4.5']
              },
              {
                project: 'Test Project 2',
                task: 'Test Task 2',
                hours: ['1.5', '2.5', '3', '', '0', null, undefined]
              }
            ]
          }
        ]);
      }
      return null;
    });
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // The total should be 2 + 3 + 0 + 0 + 0 + 0 + 4.5 + 1.5 + 2.5 + 3 + 0 + 0 + 0 + 0 = 16.5
    expect(screen.getByText('16.5 hours total')).toBeInTheDocument();
  });
  
  test('correctly calculates total hours from timesheet entries with single value format', () => {
    // Setup localStorage with a job and timesheet that has single value hours format
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'jobOfferStatuses') {
        return JSON.stringify({ '1': 'accepted' });
      }
      if (key === 'timesheets') {
        return JSON.stringify([
          {
            id: 1,
            jobId: 1,
            date: new Date().toISOString(),
            entries: [
              {
                date: '2023-12-11',
                hours: 8,
                task: 'Development',
                description: 'Implemented new features'
              },
              {
                date: '2023-12-12',
                hours: 7.5,
                task: 'Testing',
                description: 'Unit testing'
              },
              {
                date: '2023-12-13',
                hours: '6.5',
                task: 'Documentation',
                description: 'API documentation'
              }
            ]
          }
        ]);
      }
      return null;
    });
    
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // The total should be 8 + 7.5 + 6.5 = 22.0
    expect(screen.getByText('22.0 hours total')).toBeInTheDocument();
  });
});