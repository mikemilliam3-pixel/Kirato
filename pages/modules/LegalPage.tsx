
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LegalLayout from './legal/LegalLayout';
import Dashboard from './legal/sections/Dashboard';
import Templates from './legal/sections/Templates';
import ClauseExplainer from './legal/sections/ClauseExplainer';
import QAChat from './legal/sections/QAChat';
import Checklist from './legal/sections/Checklist';

const LegalPage: React.FC = () => {
  return (
    <LegalLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="templates" element={<Templates />} />
        <Route path="clause-explainer" element={<ClauseExplainer />} />
        <Route path="qa-chat" element={<QAChat />} />
        <Route path="checklist" element={<Checklist />} />
      </Routes>
    </LegalLayout>
  );
};

export default LegalPage;
