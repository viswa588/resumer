import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./ui/table";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

const TimeSheetList = () => {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    // Simulate API call with dummy data
    setTimesheets([
      {
        id: 1,
        week: "2024-01-01",
        status: "Pending",
        entries: [
          { date: "2024-01-01", hours: 8, task: "Development", description: "Working on frontend" },
          { date: "2024-01-02", hours: 7.5, task: "Testing", description: "Tested modules" },
          { date: "2024-01-03", hours: 6, task: "Meetings", description: "Sprint planning" },
        ],
      },
    ]);
  }, []);

  const handleEdit = (timesheetId) => {
    console.log("Edit timesheet:", timesheetId);
  };

  const getWeekRange = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Submitted Timesheets</CardTitle>
            <CardDescription className="text-muted-foreground">
              Overview of all submitted timesheets by week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="table-auto w-full border border-gray-300 text-sm">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableCell className="font-semibold p-2 border">Week</TableCell>
                    <TableCell className="font-semibold p-2 border">Total Hours</TableCell>
                    <TableCell className="font-semibold p-2 border">Status</TableCell>
                    <TableCell className="font-semibold p-2 border text-center">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheets.map((ts) => {
                    const totalHours = ts.entries.reduce((sum, entry) => sum + Number(entry.hours), 0);
                    return (
                      <TableRow key={ts.id} className="hover:bg-muted">
                        <TableCell className="p-2 border">{getWeekRange(ts.week)}</TableCell>
                        <TableCell className="p-2 border">{totalHours.toFixed(2)}</TableCell>
                        <TableCell className="p-2 border">
                          <Badge variant={ts.status === "Pending" ? "secondary" : "default"}>{ts.status}</Badge>
                        </TableCell>
                        <TableCell className="p-2 border text-center">
                          {ts.status === "Pending" && (
                            <Button variant="outline" size="sm" onClick={() => handleEdit(ts.id)}>
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeSheetList;
