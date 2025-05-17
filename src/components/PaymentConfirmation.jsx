import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FaCheckCircle, FaFileInvoiceDollar, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paycheck = location.state?.paycheck;

  const handleGoBack = () => {
    navigate('/timesheet/approval');
  };

  const handleViewPaychecks = () => {
    navigate('/employer-dashboard');
  };

  if (!paycheck) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">No payment information found.</p>
              <Button onClick={handleGoBack}>Back to Timesheet Approval</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
              <p className="text-gray-600 mt-2">
                The payment has been processed successfully and the timesheet has been approved.
              </p>
            </motion.div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-green-800 mb-4">Payment Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <p className="text-gray-600">Payment ID:</p>
                <p>{paycheck.id}</p>
                
                <p className="text-gray-600">Employee:</p>
                <p>{paycheck.userId}</p>
                
                <p className="text-gray-600">Job Title:</p>
                <p>{paycheck.jobTitle}</p>
                
                <p className="text-gray-600">Pay Period:</p>
                <p>{paycheck.period}</p>
                
                <p className="text-gray-600 font-semibold">Amount:</p>
                <p className="font-semibold">{paycheck.amount}</p>
                
                <p className="text-gray-600">Payment Date:</p>
                <p>{paycheck.date}</p>
                
                <p className="text-gray-600">Status:</p>
                <p className="text-green-600 font-medium">{paycheck.status}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Next Steps</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>The employee will be notified about the payment</li>
                <li>A payment receipt has been generated and stored in the system</li>
                <li>The timesheet status has been updated to "Approved"</li>
                <li>You can view this payment in the payment history section</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={handleGoBack}
                className="flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Timesheets
              </Button>
              <Button 
                onClick={handleViewPaychecks}
                className="bg-blue-500 hover:bg-blue-600 flex items-center"
              >
                <FaFileInvoiceDollar className="mr-2" /> View All Payments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentConfirmation;