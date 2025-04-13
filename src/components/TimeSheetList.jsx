import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./ui/table";

const TimeSheetList = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    // Add your API call here to fetch timesheets
    // For now using dummy data
    setTimesheets([
      {
        id: 1,
        week: "2024-01-01",
        status: "Pending",
        entries: [
          {
            date: "2024-01-01",
            hours: 8,
            task: "Development",
            description: "Working on frontend",
          },
        ],
      },
    ]);
  }, []);

  const handleEdit = (timesheetId) => {
    // Add navigation to edit page
    console.log("Edit timesheet:", timesheetId);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Submitted Timesheets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Week</TableCell>
                <TableCell>Total Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet.id}>
                  <TableCell>{timesheet.week}</TableCell>
                  <TableCell>
                    {timesheet.entries.reduce(
                      (sum, entry) => sum + Number(entry.hours),
                      0
                    )}
                  </TableCell>
                  <TableCell>{timesheet.status}</TableCell>
                  <TableCell>
                    {timesheet.status === "Pending" && (
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(timesheet.id)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};



export default TimeSheetList;
