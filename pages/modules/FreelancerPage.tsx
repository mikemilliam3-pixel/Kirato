
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FreelancerLayout from './freelancer/FreelancerLayout';
import Dashboard from './freelancer/sections/Dashboard';
import Proposals from './freelancer/sections/Proposals';
import Portfolio from './freelancer/sections/Portfolio';
import Pricing from './freelancer/sections/Pricing';
import ClientCRM from './freelancer/sections/ClientCRM';
import Contracts from './freelancer/sections/Contracts';
import TimeTracking from './freelancer/sections/TimeTracking';

const FreelancerPage: React.FC = () => {
  return (
    <FreelancerLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="client-crm" element={<ClientCRM />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="time-tracking" element={<TimeTracking />} />
      </Routes>
    </FreelancerLayout>
  );
};

export default FreelancerPage;
