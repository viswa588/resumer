# Timesheet Formatting Changes

## Overview

This document outlines the changes made to implement consistent timesheet data formatting across the application.

## Changes Made

1. Created a new utility function in `/src/lib/timesheetUtils.js` that provides a standardized way to format timesheet data:
   ```javascript
   export const getFormattedTimesheets = () => {
     const storedTimesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
       
     // Map the timesheets to match the expected format
     const formattedTimesheets = storedTimesheets.map(ts => ({
       id: ts.id,
       studentName: ts.userName,
       studentId: ts.userId,
       weekEnding: ts.weekEnding,
       totalHours: ts.totalHours,
       status: ts.status,
       department: ts.jobTitle,
       submittedDate: ts.submittedDate
     }));
     
     return formattedTimesheets;
   };
   ```

2. Updated the `TimeSheetApproval.jsx` component to use the new utility function instead of duplicating the formatting logic.

3. Updated the `TimeSheetList.jsx` component to also use the new utility function for consistency.

4. Added tests for the new utility function in `/src/lib/__tests__/timesheetUtils.test.js`.

5. Updated existing tests for `TimeSheetApproval` to use the mocked utility function.

6. Added a new test for `TimeSheetList` to ensure it correctly uses the utility function.

## Benefits

- **Consistency**: All components now use the same formatting logic for timesheets.
- **Maintainability**: Changes to the formatting logic only need to be made in one place.
- **Testability**: The formatting logic can be tested independently of the components that use it.
- **Reusability**: The utility function can be easily used by any component that needs to display timesheet data.

## Usage

To use the formatted timesheet data in a component:

```javascript
import { getFormattedTimesheets } from "../lib/timesheetUtils";

// Inside your component
const formattedTimesheets = getFormattedTimesheets();
```

This will return an array of timesheet objects with the following structure:

```javascript
{
  id: number,
  studentName: string,
  studentId: string,
  weekEnding: string,
  totalHours: number,
  status: string,
  department: string,
  submittedDate: string
}
```