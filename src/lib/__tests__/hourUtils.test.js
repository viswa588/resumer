import { calculateHours } from '../hourUtils';

describe('hourUtils', () => {
  test('calculateHours handles array of hours correctly', () => {
    // Test with array of numeric strings
    expect(calculateHours(['2', '3', '4.5'])).toBe(9.5);
    
    // Test with array containing empty strings, null, undefined
    expect(calculateHours(['2', '3', '', null, undefined, 'invalid', '4.5'])).toBe(9.5);
    
    // Test with array of numbers
    expect(calculateHours([2, 3, 4.5])).toBe(9.5);
    
    // Test with mixed array
    expect(calculateHours([2, '3', 4.5, '', null])).toBe(9.5);
  });
  
  test('calculateHours handles single value correctly', () => {
    // Test with numeric string
    expect(calculateHours('8.5')).toBe(8.5);
    
    // Test with number
    expect(calculateHours(8.5)).toBe(8.5);
    
    // Test with zero
    expect(calculateHours(0)).toBe(0);
    expect(calculateHours('0')).toBe(0);
    
    // Test with invalid values
    expect(calculateHours('')).toBe(0);
    expect(calculateHours(null)).toBe(0);
    expect(calculateHours(undefined)).toBe(0);
    expect(calculateHours('invalid')).toBe(0);
  });
  
  test('calculateHours handles edge cases', () => {
    // Test with empty array
    expect(calculateHours([])).toBe(0);
    
    // Test with no argument
    expect(calculateHours()).toBe(0);
    
    // Test with object (should return 0)
    expect(calculateHours({})).toBe(0);
  });
});