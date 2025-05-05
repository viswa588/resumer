// components/PaymentProcessing.jsx
import { useState, useEffect } from "react";
import { calculateHours } from "../lib/hourUtils";
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import PaymentGateway from "./PaymentGateway";

// You can move this to an environment variable or configuration file
const HOURLY_RATE = 20;

const PaymentProcessing = ({ timesheet, onClose, onProcessPayment }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    hourlyRate: HOURLY_RATE,
  });

  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  useEffect(() => {
    calculatePayment();
  }, [timesheet]);

  const calculatePayment = () => {
    const subtotal = timesheet.totalHours * HOURLY_RATE;
    const tax = subtotal * 0.1; // 10% tax (you can adjust this)
    const total = subtotal + tax;

    setPaymentDetails({
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      hourlyRate: HOURLY_RATE,
    });
  };

  const handleProcessPayment1 = () => {
    onProcessPayment({
      timesheetId: timesheet.id,
      paymentDetails,
      paymentDate: new Date().toISOString(),
    });
  };

  const handleProcessPayment = () => {
    setShowPaymentGateway(true);
  };

  return (
    <>
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
          <CardDescription>
            Process payment for approved timesheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Student Details</h3>
              <p>Name: {timesheet.studentName}</p>
              <p>ID: {timesheet.studentId}</p>
              <p>Department: {timesheet.department}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Timesheet Details</h3>
              <p>Week Ending: {timesheet.weekEnding}</p>
              <p>Total Hours: {timesheet.totalHours}</p>
              <p>Status: <Badge className="bg-green-100 text-green-800">Approved</Badge></p>
            </div>
          </div>

          {/* Hours Breakdown */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Hours Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rate ($/hr)</TableHead>
                  <TableHead className="text-right">Amount ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheet.entries?.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{calculateHours(entry.hours)}</TableCell>
                    <TableCell>${HOURLY_RATE.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${(calculateHours(entry.hours) * HOURLY_RATE).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${paymentDetails.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${paymentDetails.tax}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Payment:</span>
                <span>${paymentDetails.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment}>
              Process Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    {showPaymentGateway && (
      <PaymentGateway
        paymentDetails={paymentDetails}
        onClose={() => setShowPaymentGateway(false)}
        onPaymentComplete={(result) => {
          console.log("Payment completed:", result);
          onProcessPayment({
            ...paymentDetails,
            transactionId: result.transactionId,
            paymentMethod: result.method,
          });
        }}
      />
    )}
    </>
  );
};

export default PaymentProcessing;