import { getFormattedTimesheets } from '../timesheetUtils';
import { sampleTimesheets } from '../../data/sampleData';

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

describe('timesheetUtils', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.clear();
  });

  test('getFormattedTimesheets returns empty array when localStorage is empty', () => {
    // Arrange
    localStorageMock.getItem.mockReturnValue(null);
    
    // Act
    const result = getFormattedTimesheets();
    
    // Assert
    expect(result).toEqual([]);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('timesheets');
  });

  test('getFormattedTimesheets formats timesheets correctly', () => {
    // Arrange
    localStorageMock.getItem.mockReturnValue(JSON.stringify(sampleTimesheets));
    
    // Act
    const result = getFormattedTimesheets();
    
    // Assert
    expect(result.length).toBe(sampleTimesheets.length);
    
    // Check that each timesheet is formatted correctly
    result.forEach((formattedTs, index) => {
      const originalTs = sampleTimesheets[index];
      
      expect(formattedTs).toEqual({
        id: originalTs.id,
        studentName: originalTs.userName,
        studentId: originalTs.userId,
        weekEnding: originalTs.weekEnding,
        totalHours: originalTs.totalHours,
        status: originalTs.status,
        department: originalTs.jobTitle,
        submittedDate: originalTs.submittedDate
      });
    });
  });
});