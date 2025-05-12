import React, { useState } from 'react';
import { FaDownload, FaEye, FaFileInvoiceDollar, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { Card, CardContent } from './ui/card';
import PaycheckModal from './PaycheckModal';

const PaychecksModal = ({ isOpen, onClose, paychecks = [] }) => {
  const [viewingPaycheck, setViewingPaycheck] = useState(null);
  const [isPaycheckDetailModalOpen, setIsPaycheckDetailModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (paycheck) => {
    // In a real app, this would trigger a download of the paycheck PDF
    alert(`Downloading paycheck for ${paycheck.period}`);
  };

  const handleView = (paycheck) => {
    setViewingPaycheck(paycheck);
    setIsPaycheckDetailModalOpen(true);
  };

  const closePaycheckDetailModal = () => {
    setIsPaycheckDetailModalOpen(false);
    setViewingPaycheck(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <FaFileInvoiceDollar className="mr-2 text-green-600" />
            Paychecks
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-grow">
          {paychecks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No paychecks found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paychecks
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
                .map(paycheck => (
                  <Card key={paycheck.id} className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{paycheck.period}</h4>
                          <p className="text-gray-600">{paycheck.amount}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FaCalendarAlt className="mr-1" size={12} />
                            <span>
                              Issued: {formatDate(paycheck.date)}
                              {paycheck.weekEnding && ` (Week ending: ${formatDate(paycheck.weekEnding)})`}
                            </span>
                          </div>
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
          )}
        </div>
      </div>

      {/* Individual Paycheck Detail Modal */}
      <PaycheckModal 
        isOpen={isPaycheckDetailModalOpen} 
        onClose={closePaycheckDetailModal} 
        paycheck={viewingPaycheck} 
      />
    </div>
  );
};

export default PaychecksModal;