import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TimeSheetEntry from '../TimeSheetEntry';
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

// Mock the date-fns format function
jest.mock('date-fns', () => ({
  format: jest.fn().mockImplementation(() => 'Jan 1 - Jan 7, 2023')
}));

// Mock the timesheetUtils
jest.mock('../../lib/timesheetUtils', () => ({
  updateTimesheetInLocalStorage: jest.fn()
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

describe('TimeSheetEntry Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders timesheet entry form', () => {
    render(
      <MemoryRouter initialEntries={['/timesheet/new/1']}>
        <Routes>
          <Route path="/timesheet/new/:id" element={<TimeSheetEntry />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Timesheet Entry')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  test('correctly calculates daily totals with mixed values', () => {
    render(
      <MemoryRouter initialEntries={['/timesheet/new/1']}>
        <Routes>
          <Route path="/timesheet/new/:id" element={<TimeSheetEntry />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Get all the input fields for Monday (first column)
    const inputs = screen.getAllByRole('spinbutton');
    
    // Set values for the first row (Monday)
    fireEvent.change(inputs[0], { target: { value: '2.5' } });
    
    // Add a new row
    fireEvent.click(screen.getByText('Add Row'));
    
    // Get updated inputs after adding a row
    const updatedInputs = screen.getAllByRole('spinbutton');
    
    // Set values for the second row (Monday)
    fireEvent.change(updatedInputs[7], { target: { value: '3.5' } });
    
    // Check that the total for Monday is 6.0 (2.5 + 3.5)
    const totalRow = screen.getByText('Total').closest('tr');
    const totalCells = totalRow.querySelectorAll('td');
    expect(totalCells[1].textContent).toBe('6');
  });

  test('correctly handles invalid values in hour calculations', () => {
    render(
      <MemoryRouter initialEntries={['/timesheet/new/1']}>
        <Routes>
          <Route path="/timesheet/new/:id" element={<TimeSheetEntry />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Get all the input fields
    const inputs = screen.getAllByRole('spinbutton');
    
    // Set valid and invalid values for different days
    fireEvent.change(inputs[0], { target: { value: '2.5' } }); // Monday: valid
    fireEvent.change(inputs[1], { target: { value: 'abc' } }); // Tuesday: invalid
    fireEvent.change(inputs[2], { target: { value: '' } });    // Wednesday: empty
    fireEvent.change(inputs[3], { target: { value: '0' } });   // Thursday: zero
    fireEvent.change(inputs[4], { target: { value: '3.5' } }); // Friday: valid
    
    // Check that the totals are calculated correctly
    const totalRow = screen.getByText('Total').closest('tr');
    const totalCells = totalRow.querySelectorAll('td');
    
    // Monday: 2.5
    expect(totalCells[1].textContent).toBe('2.5');
    
    // Tuesday: 0 (invalid value 'abc' should be treated as 0)
    expect(totalCells[2].textContent).toBe('0');
    
    // Wednesday: 0 (empty string should be treated as 0)
    expect(totalCells[3].textContent).toBe('0');
    
    // Thursday: 0 (explicit zero)
    expect(totalCells[4].textContent).toBe('0');
    
    // Friday: 3.5
    expect(totalCells[5].textContent).toBe('3.5');
  });
});