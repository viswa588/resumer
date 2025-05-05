import { getFormattedTimesheets, updateTimesheetInLocalStorage } from '../timesheetUtils';
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
    jest.clearAllMocks();
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

  test('updateTimesheetInLocalStorage formats and stores timesheet correctly', () => {
    // Arrange
    const mockTimesheet = {
      id: 123,
      userName: 'Test User',
      userId: 'user123',
      weekEnding: '2023-12-31',
      totalHours: 40,
      status: 'Pending',
      jobTitle: 'Frontend Developer',
      submittedDate: '2023-12-25T10:30:00Z'
    };

    // Act
    updateTimesheetInLocalStorage(mockTimesheet);
    
    // Assert
    expect(localStorageMock.setItem).toHaveBeenCalledWith('timesheet', JSON.stringify({
      id: mockTimesheet.id,
      studentName: mockTimesheet.userName,
      studentId: mockTimesheet.userId,
      weekEnding: mockTimesheet.weekEnding,
      totalHours: mockTimesheet.totalHours,
      status: mockTimesheet.status,
      department: mockTimesheet.jobTitle,
      submittedDate: mockTimesheet.submittedDate
    }));
  });
});