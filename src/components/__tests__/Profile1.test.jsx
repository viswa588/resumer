import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../Profile1';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock FeaturedJobsPage component
jest.mock('../FeaturedJobsPage', () => {
  return function MockFeaturedJobsPage() {
    return <div data-testid="featured-jobs">Featured Jobs Mock</div>;
  };
});

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

describe('ProfilePage Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders profile page with logout button', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    
    // Check that the profile name is rendered
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    
    // Check that the logout button is rendered
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  test('logout button clears localStorage and navigates to login page', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    
    // Find and click the logout button
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    // Check that localStorage.removeItem was called
    expect(localStorage.removeItem).toHaveBeenCalledWith('userRole');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userEmail');
    
    // Check that navigate was called with the login path
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});