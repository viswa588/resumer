import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { FaFileInvoiceDollar, FaDownload, FaPrint, FaSpinner } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const PaychecksModal = ({ isOpen, onClose, paychecks = [] }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handlePrint = (paycheck) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Paycheck - ${paycheck.period}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company { font-size: 24px; font-weight: bold; }
            .title { font-size: 20px; margin: 10px 0; }
            .paycheck { border: 1px solid #ccc; padding: 20px; max-width: 800px; margin: 0 auto; }
            .section { margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .label { font-weight: bold; }
            .amount { text-align: right; }
            .total { font-size: 18px; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="paycheck">
            <div class="header">
              <div class="company">Tech Innovations Inc.</div>
              <div class="title">PAYCHECK</div>
              <div>123 Tech Street, San Francisco, CA 94103</div>
            </div>
            
            <div class="section">
              <div class="row">
                <span class="label">Employee:</span>
                <span>${paycheck.userId}</span>
              </div>
              <div class="row">
                <span class="label">Pay Period:</span>
                <span>${paycheck.period}</span>
              </div>
              <div class="row">
                <span class="label">Payment Date:</span>
                <span>${formatDate(paycheck.date)}</span>
              </div>
              <div class="row">
                <span class="label">Job Title:</span>
                <span>${paycheck.jobTitle}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="row">
                <span class="label">Gross Pay:</span>
                <span class="amount">${paycheck.amount}</span>
              </div>
              <div class="row">
                <span class="label">Federal Tax (15%):</span>
                <span class="amount">-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.15).toFixed(2)}</span>
              </div>
              <div class="row">
                <span class="label">State Tax (5%):</span>
                <span class="amount">-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.05).toFixed(2)}</span>
              </div>
              <div class="row">
                <span class="label">Social Security (6.2%):</span>
                <span class="amount">-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.062).toFixed(2)}</span>
              </div>
              <div class="row">
                <span class="label">Medicare (1.45%):</span>
                <span class="amount">-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.0145).toFixed(2)}</span>
              </div>
            </div>
            
            <div class="row total">
              <span>Net Pay:</span>
              <span class="amount">$${(parseFloat(paycheck.amount.replace('$', '')) * 0.7235).toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownload = (paycheck) => {
    setIsDownloading(true);
    
    // Create a container for the PDF content
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 24px; font-weight: bold;">Tech Innovations Inc.</div>
          <div style="font-size: 20px; margin: 10px 0;">PAYCHECK</div>
          <div>123 Tech Street, San Francisco, CA 94103</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Employee:</span>
            <span>${paycheck.userId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Pay Period:</span>
            <span>${paycheck.period}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Payment Date:</span>
            <span>${formatDate(paycheck.date)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Job Title:</span>
            <span>${paycheck.jobTitle}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Gross Pay:</span>
            <span>${paycheck.amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Federal Tax (15%):</span>
            <span>-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.15).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">State Tax (5%):</span>
            <span>-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.05).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Social Security (6.2%):</span>
            <span>-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.062).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">Medicare (1.45%):</span>
            <span>-$${(parseFloat(paycheck.amount.replace('$', '')) * 0.0145).toFixed(2)}</span>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px;">
          <span>Net Pay:</span>
          <span>$${(parseFloat(paycheck.amount.replace('$', '')) * 0.7235).toFixed(2)}</span>
        </div>
      </div>
    `;
    
    // Use html2pdf to convert the HTML to PDF
    const opt = {
      margin: 10,
      filename: `Paycheck-${paycheck.period.replace(/\s/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf()
      .from(container)
      .set(opt)
      .save()
      .then(() => {
        setIsDownloading(false);
      })
      .catch(err => {
        console.error('Error generating PDF:', err);
        alert('Failed to generate PDF. Please try again.');
        setIsDownloading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <FaFileInvoiceDollar className="mr-2 text-green-600" /> Your Paychecks
          </DialogTitle>
        </DialogHeader>
        
        {paychecks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No paychecks available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paychecks.map((paycheck) => (
              <div 
                key={paycheck.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{paycheck.jobTitle}</h3>
                    <p className="text-gray-600">Period: {paycheck.period}</p>
                    <p className="text-gray-500 text-sm">Payment Date: {formatDate(paycheck.date)}</p>
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {paycheck.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{paycheck.amount}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                        onClick={() => handlePrint(paycheck)}
                      >
                        <FaPrint className="mr-1" /> Print
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleDownload(paycheck)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <>
                            <FaSpinner className="mr-1 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <FaDownload className="mr-1" /> Download PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaychecksModal;