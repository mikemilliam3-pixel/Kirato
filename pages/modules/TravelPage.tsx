
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TravelLayout from './travel/TravelLayout';
import Dashboard from './travel/sections/Dashboard';
import Trips from './travel/sections/Trips';
import Itinerary from './travel/sections/Itinerary';
import Budget from './travel/sections/Budget';
import Packing from './travel/sections/Packing';
import Wishlist from './travel/sections/Wishlist';
import Share from './travel/sections/Share';

const TravelPage: React.FC = () => {
  return (
    <TravelLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trips" element={<Trips />} />
        <Route path="itinerary" element={<Itinerary />} />
        <Route path="budget" element={<Budget />} />
        <Route path="packing" element={<Packing />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="share" element={<Share />} />
      </Routes>
    </TravelLayout>
  );
};

export default TravelPage;
