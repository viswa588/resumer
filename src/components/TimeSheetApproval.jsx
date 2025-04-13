// components/TimeSheetApproval.jsx
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import PaymentProcessing from "./PaymentProcessing";
import { Search } from "lucide-react"; // Import the search icon

const TimeSheetApproval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  // Sample data - replace with your API call
  const [timesheets, setTimesheets] = useState([
    {
      id: 1,
      studentName: "John Doe",
      studentId: "STU001",
      weekEnding: "2024-01-21",
      totalHours: 40,
      status: "Pending",
      department: "Computer Science",
      submittedDate: "2024-01-22",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      studentId: "STU002",
      weekEnding: "2024-01-21",
      totalHours: 35,
      status: "Approved",
      department: "Engineering",
      submittedDate: "2024-01-22",
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      studentId: "STU003",
      weekEnding: "2024-01-21",
      totalHours: 38,
      status: "Rejected",
      department: "Mathematics",
      submittedDate: "2024-01-22",
    },
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      Approved: {
        className: "bg-green-100 text-green-800 border-green-200",
      },
      Rejected: {
        className: "bg-red-100 text-red-800 border-red-200",
      },
      "Under Review": {
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
    };

    return (
      <Badge className={statusConfig[status]?.className || "bg-gray-100"}>
        {status}
      </Badge>
    );
  };

  const handleApprove = (timesheetId) => {
    const timesheet = timesheets.find((sheet) => sheet.id === timesheetId);
    setSelectedTimesheet({
      ...timesheet,
      entries: [
        {
          date: timesheet.weekEnding,
          hours: timesheet.totalHours,
          task: "Regular Hours",
          description: "Weekly work",
        },
      ],
    });
    setShowPayment(true);
  };

  const handleProcessPayment = (paymentDetails) => {
    // Handle payment processing
    console.log("Processing payment:", paymentDetails);
    
    // Update timesheet status
    setTimesheets(
      timesheets.map((sheet) =>
        sheet.id === selectedTimesheet.id
          ? { ...sheet, status: "Approved", paymentProcessed: true }
          : sheet
      )
    );
    
    // Close payment screen
    setShowPayment(false);
    setSelectedTimesheet(null);
  };

  const filteredTimesheets = timesheets.filter((timesheet) => {
    const matchesSearch =
      timesheet.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || timesheet.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (timesheetId) => {
    // Implement view details logic
    console.log("Viewing details for timesheet:", timesheetId);
  };

  const handleApprove1 = (timesheetId) => {
    setTimesheets(
      timesheets.map((sheet) =>
        sheet.id === timesheetId
          ? { ...sheet, status: "Approved" }
          : sheet
      )
    );
  };

  const handleReject = (timesheetId) => {
    setTimesheets(
      timesheets.map((sheet) =>
        sheet.id === timesheetId
          ? { ...sheet, status: "Rejected" }
          : sheet
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
         {showPayment ? (
        <PaymentProcessing
          timesheet={selectedTimesheet}
          onClose={() => setShowPayment(false)}
          onProcessPayment={handleProcessPayment}
        />
      ) :(
      <Card>
        <CardHeader>
          <CardTitle>Timesheet Approval Dashboard</CardTitle>
          <CardDescription>
            Review and manage student timesheet submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              placeholder="From Date"
            />
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              placeholder="To Date"
            />
          </div>

          {/* Timesheets Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Week Ending</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimesheets.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell>{timesheet.studentName}</TableCell>
                    <TableCell>{timesheet.studentId}</TableCell>
                    <TableCell>{timesheet.department}</TableCell>
                    <TableCell>{timesheet.weekEnding}</TableCell>
                    <TableCell>{timesheet.totalHours}</TableCell>
                    <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(timesheet.id)}
                        >
                          View
                        </Button>
                        {timesheet.status === "Pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(timesheet.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(timesheet.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default TimeSheetApproval;
