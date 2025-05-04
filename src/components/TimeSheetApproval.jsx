// components/TimeSheetApproval.jsx
import { useState, useEffect } from "react";
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
import { Search } from "lucide-react";
import PaymentProcessing from "./PaymentProcessing";
import { initializeSampleData } from "../data/sampleData";

const TimeSheetApproval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    // Initialize sample data if it doesn't exist
    initializeSampleData();
    
    // Load timesheets from localStorage
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
    
    setTimesheets(formattedTimesheets);
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
      "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
    };
    return (
      <Badge className={`rounded-md border px-2 py-0.5 text-xs font-medium ${statusMap[status] || "bg-gray-100"}`}>
        {status}
      </Badge>
    );
  };

  const handleApprove = (id) => {
    const timesheet = timesheets.find((t) => t.id === id);
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
    console.log("Processing payment:", paymentDetails);
    setTimesheets(
      timesheets.map((t) =>
        t.id === selectedTimesheet.id ? { ...t, status: "Approved" } : t
      )
    );
    setShowPayment(false);
    setSelectedTimesheet(null);
  };

  const handleReject = (id) => {
    setTimesheets(
      timesheets.map((t) =>
        t.id === id ? { ...t, status: "Rejected" } : t
      )
    );
  };

  const handleViewDetails = (id) => {
    console.log("View details:", id);
  };

  const filteredTimesheets = timesheets.filter((t) => {
    const matchesSearch =
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {showPayment ? (
          <PaymentProcessing
            timesheet={selectedTimesheet}
            onClose={() => setShowPayment(false)}
            onProcessPayment={handleProcessPayment}
          />
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Timesheet Approvals</CardTitle>
              <CardDescription>Review and manage student-submitted hours</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
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
                />
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                />
              </div>

              {/* Table */}
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Week Ending</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimesheets.map((ts) => (
                      <TableRow key={ts.id} className="hover:bg-muted/50">
                        <TableCell>{ts.studentName}</TableCell>
                        <TableCell>{ts.studentId}</TableCell>
                        <TableCell>{ts.department}</TableCell>
                        <TableCell>{ts.weekEnding}</TableCell>
                        <TableCell>{ts.totalHours}</TableCell>
                        <TableCell>{getStatusBadge(ts.status)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(ts.id)}
                            >
                              View
                            </Button>
                            {ts.status === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleApprove(ts.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(ts.id)}
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
    </div>
  );
};

export default TimeSheetApproval;