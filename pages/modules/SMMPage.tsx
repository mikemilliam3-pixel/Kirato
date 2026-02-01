
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SMMLayout from './smm/SMMLayout';
import Dashboard from './smm/sections/Dashboard';
import ContentPlanner from './smm/sections/ContentPlanner';
import PostGenerator from './smm/sections/PostGenerator';
import BrandVoice from './smm/sections/BrandVoice';
import HashtagSEO from './smm/sections/HashtagSEO';
import AssetLibrary from './smm/sections/AssetLibrary';
import Performance from './smm/sections/Performance';

const SMMPage: React.FC = () => {
  return (
    <SMMLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="content-planner" element={<ContentPlanner />} />
        <Route path="post-generator" element={<PostGenerator />} />
        <Route path="brand-voice" element={<BrandVoice />} />
        <Route path="hashtag-seo" element={<HashtagSEO />} />
        <Route path="asset-library" element={<AssetLibrary />} />
        <Route path="performance" element={<Performance />} />
      </Routes>
    </SMMLayout>
  );
};

export default SMMPage;
