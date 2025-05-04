import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RolesAndResponsibilities from '../RolesAndResponsibilities';
import '@testing-library/jest-dom';

// Mock the jobs data
jest.mock('../../data/jobs', () => ({
  jobs: [
    {
      id: 1,
      title: "Test Job",
      company: "Test Company",
      location: "Test Location",
      description: "Test Description",
      requirements: ["Requirement 1", "Requirement 2"],
      benefits: ["Benefit 1", "Benefit 2"],
      contactEmail: "test@example.com"
    }
  ]
}));

describe('RolesAndResponsibilities Component', () => {
  test('renders roles and responsibilities page with job details', () => {
    render(
      <MemoryRouter initialEntries={['/roles-and-responsibilities/1']}>
        <Routes>
          <Route path="/roles-and-responsibilities/:id" element={<RolesAndResponsibilities />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the main title is rendered
    expect(screen.getByText('Roles and Responsibilities')).toBeInTheDocument();
    
    // Check if job details are rendered
    expect(screen.getByText('Test Job at Test Company')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    
    // Check if requirements are rendered
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Requirement 1')).toBeInTheDocument();
    expect(screen.getByText('Requirement 2')).toBeInTheDocument();
    
    // Check if benefits are rendered
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('Benefit 1')).toBeInTheDocument();
    expect(screen.getByText('Benefit 2')).toBeInTheDocument();
    
    // Check if contact information is rendered
    expect(screen.getByText('Questions?')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Check if back button is rendered
    expect(screen.getByText('Back to Profile')).toBeInTheDocument();
  });
});