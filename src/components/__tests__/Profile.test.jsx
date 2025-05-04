import React from 'react';
import { render, screen } from '@testing-library/react';
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
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Profile Component', () => {
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
});