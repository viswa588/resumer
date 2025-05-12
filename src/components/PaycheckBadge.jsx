import React from 'react';

const PaycheckBadge = ({ count = 0 }) => {
  if (count <= 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default PaycheckBadge;