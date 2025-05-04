import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppliedJobsModal from '../AppliedJobsModal';

// Mock the JobOfferActions component
jest.mock('../JobOfferActions', () => {
  return function MockJobOfferActions({ onAcceptOffer, onRejectOffer }) {
    return (
      <div data-testid="job-offer-actions">
        <button onClick={onAcceptOffer}>Mock Accept</button>
        <button onClick={onRejectOffer}>Mock Reject</button>
      </div>
    );
  };
});

describe('AppliedJobsModal Component', () => {
  const mockJobs = [
    {
      id: 1,
      title: "Test Job 1",
      company: "Test Company 1",
      location: "Test Location 1"
    },
    {
      id: 2,
      title: "Test Job 2",
      company: "Test Company 2",
      location: "Test Location 2"
    }
  ];
  
  const mockAppliedJobs = new Set([1]);
  const mockOnClose = jest.fn();
  const mockOnAcceptOffer = jest.fn();
  const mockOnRejectOffer = jest.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnAcceptOffer.mockClear();
    mockOnRejectOffer.mockClear();
  });
  
  test('renders empty state when no applied jobs', () => {
    render(
      <AppliedJobsModal 
        appliedJobs={new Set()} 
        jobs={mockJobs}
        onClose={mockOnClose}
        onAcceptOffer={mockOnAcceptOffer}
        onRejectOffer={mockOnRejectOffer}
      />
    );
    
    expect(screen.getByText('Applied Jobs')).toBeInTheDocument();
    expect(screen.getByText("You haven't applied to any jobs yet.")).toBeInTheDocument();
  });
  
  test('renders list of applied jobs', () => {
    render(
      <AppliedJobsModal 
        appliedJobs={mockAppliedJobs} 
        jobs={mockJobs}
        onClose={mockOnClose}
        onAcceptOffer={mockOnAcceptOffer}
        onRejectOffer={mockOnRejectOffer}
      />
    );
    
    expect(screen.getByText('Applied Jobs')).toBeInTheDocument();
    expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Job 2')).not.toBeInTheDocument();
  });
  
  test('calls onClose when close button is clicked', () => {
    render(
      <AppliedJobsModal 
        appliedJobs={mockAppliedJobs} 
        jobs={mockJobs}
        onClose={mockOnClose}
        onAcceptOffer={mockOnAcceptOffer}
        onRejectOffer={mockOnRejectOffer}
      />
    );
    
    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test('shows job details when a job is selected', () => {
    render(
      <AppliedJobsModal 
        appliedJobs={mockAppliedJobs} 
        jobs={mockJobs}
        onClose={mockOnClose}
        onAcceptOffer={mockOnAcceptOffer}
        onRejectOffer={mockOnRejectOffer}
      />
    );
    
    // Click on the job to select it
    fireEvent.click(screen.getByText('Test Job 1'));
    
    // Should show back button and job offer actions
    expect(screen.getByText('Back to Applied Jobs')).toBeInTheDocument();
    expect(screen.getByTestId('job-offer-actions')).toBeInTheDocument();
  });
  
  test('calls appropriate handlers when offer actions are triggered', () => {
    render(
      <AppliedJobsModal 
        appliedJobs={mockAppliedJobs} 
        jobs={mockJobs}
        onClose={mockOnClose}
        onAcceptOffer={mockOnAcceptOffer}
        onRejectOffer={mockOnRejectOffer}
      />
    );
    
    // Click on the job to select it
    fireEvent.click(screen.getByText('Test Job 1'));
    
    // Click accept offer
    fireEvent.click(screen.getByText('Mock Accept'));
    expect(mockOnAcceptOffer).toHaveBeenCalledTimes(1);
    expect(mockOnAcceptOffer).toHaveBeenCalledWith(mockJobs[0]);
    
    // Click reject offer
    fireEvent.click(screen.getByText('Mock Reject'));
    expect(mockOnRejectOffer).toHaveBeenCalledTimes(1);
    expect(mockOnRejectOffer).toHaveBeenCalledWith(mockJobs[0]);
  });
});