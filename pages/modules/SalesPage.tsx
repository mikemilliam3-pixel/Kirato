
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesLayout from './sales/SalesLayout';
import Dashboard from './sales/sections/Dashboard';
import Products from './sales/sections/Products';
import Orders from './sales/sections/Orders';
import ChannelPosting from './sales/sections/ChannelPosting';
import PublicShop from './sales/sections/PublicShop';
import Customers from './sales/sections/Customers';
import Chat from './sales/sections/Chat';
import Promotions from './sales/sections/Promotions';
import Settings from './sales/sections/Settings';

const SalesPage: React.FC = () => {
  return (
    <SalesLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="channel-posting" element={<ChannelPosting />} />
        <Route path="public-shop" element={<PublicShop />} />
        <Route path="customers" element={<Customers />} />
        <Route path="chat" element={<Chat />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </SalesLayout>
  );
};

export default SalesPage;
