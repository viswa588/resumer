import React from 'react';
import { FaDownload, FaTimes, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const PaycheckModal = ({ isOpen, onClose, paycheck }) => {
  if (!isOpen || !paycheck) return null;

  // Calculate service charge (5%) and other values
  const grossPay = parseFloat(paycheck.amount.replace('$', '').replace(',', ''));
  const serviceCharge = grossPay * 0.05;
  const processingFee = 10.00; // Fixed processing fee of $10
  
  // Calculate net pay after all deductions
  const federalTax = 250.00;
  const stateTax = 125.00;
  const socialSecurity = 77.50;
  const medicare = 18.13;
  const healthInsurance = 85.00;
  const retirement = 62.50;
  
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + 
                         healthInsurance + retirement + serviceCharge + processingFee;
  const netPay = grossPay - totalDeductions;

  const handleDownload = () => {
    // In a real app, this would trigger a download of the paycheck PDF
    alert(`Downloading paycheck for ${paycheck.period}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Paycheck Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium">Pay Period: {paycheck.period}</h3>
            <div className="flex items-center justify-center text-gray-500 mt-1">
              <FaCalendarAlt className="mr-1" size={14} />
              <span>Issued: {formatDate(paycheck.date)}</span>
            </div>
            {paycheck.weekEnding && (
              <div className="flex items-center justify-center text-gray-500 mt-1">
                <FaFileAlt className="mr-1" size={14} />
                <span>Timesheet Week Ending: {formatDate(paycheck.weekEnding)}</span>
              </div>
            )}
            {paycheck.jobTitle && (
              <p className="text-gray-600 mt-2">Position: {paycheck.jobTitle}</p>
            )}
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Earnings</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Regular Pay</span>
                      <span>{paycheck.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Gross Pay</span>
                      <span>{paycheck.amount}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Deductions</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Federal Tax</span>
                      <span>-$250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Tax</span>
                      <span>-$125.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Security</span>
                      <span>-$77.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medicare</span>
                      <span>-$18.13</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Insurance</span>
                      <span>-$85.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>401(k)</span>
                      <span>-$62.50</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Service Charge and Processing Fee Section */}
              <div className="mt-4 pt-3 border-t border-gray-200 bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-gray-700 mb-2">Fees</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service Charge (5%)</span>
                    <span>-${serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span>-$10.00</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Net Pay</span>
                  <span className="text-green-600">${netPay.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <FaDownload /> Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaycheckModal;