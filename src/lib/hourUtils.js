/**
 * Utility function to calculate hours from either array or single value format
 * @param {Array|number|string} hours - Hours in either array or single value format
 * @returns {number} - Total hours
 */
export const calculateHours = (hours) => {
  if (Array.isArray(hours)) {
    return hours.reduce((sum, h) => {
      const hourValue = parseFloat(h);
      return sum + (isNaN(hourValue) ? 0 : hourValue);
    }, 0);
  }
  return parseFloat(hours) || 0;
};