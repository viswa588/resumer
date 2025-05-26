import React from 'react';
import NewEmployerDashboard from './components/NewEmployerDashboard';

const NewDashboardPage = ({ initialTab = 'overview' }) => {
  return <NewEmployerDashboard initialTab={initialTab} />;
};

export default NewDashboardPage;