import React from 'react';

const PaycheckBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  
  return (
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </div>
  );
};

export default PaycheckBadge;