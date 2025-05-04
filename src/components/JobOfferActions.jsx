import React from 'react';

const JobOfferActions = ({ job, onAcceptOffer, onRejectOffer }) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
      <button 
        onClick={onAcceptOffer}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
      >
        Accept Offer
      </button>
      <button 
        onClick={onRejectOffer}
        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition-colors"
      >
        Reject Offer
      </button>
    </div>
  );
};

export default JobOfferActions;