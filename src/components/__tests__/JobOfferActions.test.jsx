import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobOfferActions from '../JobOfferActions';

describe('JobOfferActions Component', () => {
  const mockJob = {
    id: 1,
    title: "Test Job",
    company: "Test Company"
  };
  
  const mockAcceptOffer = jest.fn();
  const mockRejectOffer = jest.fn();
  
  beforeEach(() => {
    mockAcceptOffer.mockClear();
    mockRejectOffer.mockClear();
  });
  
  test('renders accept and reject buttons', () => {
    render(
      <JobOfferActions 
        job={mockJob} 
        onAcceptOffer={mockAcceptOffer} 
        onRejectOffer={mockRejectOffer} 
      />
    );
    
    expect(screen.getByText('Accept Offer')).toBeInTheDocument();
    expect(screen.getByText('Reject Offer')).toBeInTheDocument();
  });
  
  test('calls onAcceptOffer when accept button is clicked', () => {
    render(
      <JobOfferActions 
        job={mockJob} 
        onAcceptOffer={mockAcceptOffer} 
        onRejectOffer={mockRejectOffer} 
      />
    );
    
    fireEvent.click(screen.getByText('Accept Offer'));
    expect(mockAcceptOffer).toHaveBeenCalledTimes(1);
  });
  
  test('calls onRejectOffer when reject button is clicked', () => {
    render(
      <JobOfferActions 
        job={mockJob} 
        onAcceptOffer={mockAcceptOffer} 
        onRejectOffer={mockRejectOffer} 
      />
    );
    
    fireEvent.click(screen.getByText('Reject Offer'));
    expect(mockRejectOffer).toHaveBeenCalledTimes(1);
  });
});