import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesLayout from './SalesLayout';
import Dashboard from './sections/Dashboard';
import Products from './sections/Products';
import Orders from './sections/Orders';
import ChannelPosting from './sections/ChannelPosting';

const SellerApprovedPanel: React.FC = () => {
  return (
    <SalesLayout isDemo={false}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="channel-posting" element={<ChannelPosting />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </SalesLayout>
  );
};

export default SellerApprovedPanel;