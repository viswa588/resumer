import React, { useState } from 'react';
import { FaDownload, FaEye, FaFileInvoiceDollar } from 'react-icons/fa';
import { Card, CardContent } from './ui/card';
import PaycheckModal from './PaycheckModal';

const PaycheckSection = ({ paychecks = [] }) => {
  // If no paychecks are provided, use sample data
  const samplePaychecks = [
    {
      id: 1,
      period: 'Jan 1 - Jan 7, 2023',
      amount: '$1,250.00',
      status: 'Paid',
      downloadUrl: '#',
      date: '2023-01-08'
    },
    {
      id: 2,
      period: 'Jan 8 - Jan 14, 2023',
      amount: '$1,250.00',
      status: 'Paid',
      downloadUrl: '#',
      date: '2023-01-15'
    },
    {
      id: 3,
      period: 'Jan 15 - Jan 21, 2023',
      amount: '$1,250.00',
      status: 'Paid',
      downloadUrl: '#',
      date: '2023-01-22'
    },
    {
      id: 4,
      period: 'Jan 22 - Jan 28, 2023',
      amount: '$1,250.00',
      status: 'Paid',
      downloadUrl: '#',
      date: '2023-01-29'
    }
  ];

  // Use all paychecks in one place instead of filtering by job
  const displayPaychecks = paychecks.length > 0 ? paychecks : samplePaychecks;
  const [viewingPaycheck, setViewingPaycheck] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = (paycheck) => {
    // In a real app, this would trigger a download of the paycheck PDF
    alert(`Downloading paycheck for ${paycheck.period}`);
  };

  const handleView = (paycheck) => {
    setViewingPaycheck(paycheck);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setViewingPaycheck(null);
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <FaFileInvoiceDollar className="mr-2 text-green-600" />
        Paychecks
      </h3>
      
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {displayPaychecks
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
          .map(paycheck => (
            <Card key={paycheck.id} className="mb-3 bg-green-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{paycheck.period} (Weekly)</h4>
                    <p className="text-gray-600">{paycheck.amount}</p>
                    <p className="text-sm text-gray-500">
                      Issued: {new Date(paycheck.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(paycheck)}
                      className="flex items-center text-blue-600 hover:text-blue-800 bg-white p-2 rounded-md"
                      title="View Paycheck"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDownload(paycheck)}
                      className="flex items-center text-green-600 hover:text-green-800 bg-white p-2 rounded-md"
                      title="Download Paycheck"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    paycheck.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {paycheck.status}
                  </span>
                  
                  {/* Show job title if available */}
                  {paycheck.jobTitle && (
                    <span className="text-xs text-gray-500">
                      {paycheck.jobTitle}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Paycheck Modal */}
      <PaycheckModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        paycheck={viewingPaycheck} 
      />
    </div>
  );
};

export default PaycheckSection;