import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { FaArrowLeft, FaCheck, FaCreditCard, FaMoneyBill, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const timesheet = location.state?.timesheet;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    hourlyRate: '',
    paymentMethod: 'directDeposit',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    notes: ''
  });

  useEffect(() => {
    if (!timesheet) {
      navigate('/timesheet/approval');
      return;
    }

    // Calculate default payment amount based on timesheet hours
    const totalHours = calculateTotalHours(timesheet);
    const hourlyRate = 25; // Default hourly rate
    const amount = (totalHours * hourlyRate).toFixed(2);
    
    setPaymentDetails({
      ...paymentDetails,
      amount,
      hourlyRate
    });
  }, [timesheet]);

  const calculateTotalHours = (ts) => {
    if (!ts || !ts.entries || !Array.isArray(ts.entries)) {
      return 0;
    }
    
    return ts.entries.reduce((total, entry) => {
      if (!entry || !entry.hours) return total;
      
      // Handle different hour formats
      if (typeof entry.hours === 'number') {
        return total + entry.hours;
      } else if (typeof entry.hours === 'string') {
        // Handle "HH:MM" format
        const parts = entry.hours.split(':');
        if (parts.length === 2) {
          return total + (parseInt(parts[0]) + parseInt(parts[1]) / 60);
        }
        return total + parseFloat(entry.hours);
      }
      return total;
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentDetails({
      ...paymentDetails,
      paymentMethod: method
    });
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate payment details
      if (!paymentDetails.amount || !paymentDetails.hourlyRate) {
        alert('Please enter payment amount and hourly rate');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Process payment
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Create paycheck record
        const paycheck = {
          id: Date.now(),
          timesheetId: timesheet.id,
          userId: timesheet.userEmail || timesheet.userId,
          jobId: timesheet.jobId,
          period: `${timesheet.weekStartDate} - ${timesheet.weekEndDate}`,
          amount: `$${paymentDetails.amount}`,
          status: 'Paid',
          date: new Date().toISOString().split('T')[0],
          jobTitle: timesheet.jobTitle,
          weekEnding: timesheet.weekEnding || timesheet.weekEndDate
        };
        
        // Save paycheck to localStorage
        const existingPaychecks = JSON.parse(localStorage.getItem('userPaychecks') || '[]');
        localStorage.setItem('userPaychecks', JSON.stringify([...existingPaychecks, paycheck]));
        
        // Update timesheet status
        const timesheets = JSON.parse(localStorage.getItem('timesheets') || '[]');
        const updatedTimesheets = timesheets.map(ts => 
          ts.id === timesheet.id ? { ...ts, status: 'approved', approvedDate: new Date().toISOString() } : ts
        );
        localStorage.setItem('timesheets', JSON.stringify(updatedTimesheets));
        
        // Navigate to payment confirmation
        navigate('/payment/confirmation', { state: { paycheck } });
      }, 2000);
    }
  };

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/timesheet/approval');
    }
  };

  if (!timesheet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={handleGoBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <h1 className="text-2xl font-bold">
                {step === 1 ? 'Process Payment' : 'Payment Gateway'}
              </h1>
            </div>
            
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center">
                <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <div className={`h-1 flex-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <div className={`h-1 flex-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Payment Details</span>
                <span>Payment Method</span>
                <span>Confirmation</span>
              </div>
            </div>
            
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold text-blue-800 mb-2">Timesheet Information</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600">Employee:</p>
                    <p>{timesheet.userName || timesheet.userEmail}</p>
                    
                    <p className="text-gray-600">Job Title:</p>
                    <p>{timesheet.jobTitle}</p>
                    
                    <p className="text-gray-600">Week:</p>
                    <p>{timesheet.weekStartDate} - {timesheet.weekEndDate || timesheet.weekEnding}</p>
                    
                    <p className="text-gray-600">Total Hours:</p>
                    <p>{calculateTotalHours(timesheet).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      value={paymentDetails.hourlyRate}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Total Amount ($)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={paymentDetails.amount}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Payment Notes (Optional)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={paymentDetails.notes}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Add any notes about this payment"
                  />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h2 className="text-lg font-semibold text-green-800 mb-2">Payment Summary</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600">Employee:</p>
                    <p>{timesheet.userName || timesheet.userEmail}</p>
                    
                    <p className="text-gray-600">Total Hours:</p>
                    <p>{calculateTotalHours(timesheet).toFixed(2)}</p>
                    
                    <p className="text-gray-600">Hourly Rate:</p>
                    <p>${paymentDetails.hourlyRate}</p>
                    
                    <p className="text-gray-600 font-semibold">Total Amount:</p>
                    <p className="font-semibold">${paymentDetails.amount}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer ${paymentDetails.paymentMethod === 'directDeposit' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                      onClick={() => handlePaymentMethodChange('directDeposit')}
                    >
                      <div className="flex items-center mb-2">
                        <FaMoneyBill className="text-green-600 mr-2" />
                        <span className="font-medium">Direct Deposit</span>
                      </div>
                      <p className="text-sm text-gray-500">Transfer funds directly to employee's bank account</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer ${paymentDetails.paymentMethod === 'creditCard' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                      onClick={() => handlePaymentMethodChange('creditCard')}
                    >
                      <div className="flex items-center mb-2">
                        <FaCreditCard className="text-blue-600 mr-2" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <p className="text-sm text-gray-500">Pay using company credit card</p>
                    </div>
                  </div>
                </div>
                
                {paymentDetails.paymentMethod === 'directDeposit' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={paymentDetails.bankName}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          name="accountNumber"
                          value={paymentDetails.accountNumber}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          name="routingNumber"
                          value={paymentDetails.routingNumber}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Enter routing number"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentDetails.paymentMethod === 'creditCard' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        className="mt-1"
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          className="mt-1"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          className="mt-1"
                          placeholder="123"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          className="mt-1"
                          placeholder="12345"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="mr-4"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : step === 1 ? 'Next' : 'Process Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentProcessing;