
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HealthLayout from './health/HealthLayout';
import Dashboard from './health/sections/Dashboard';
import Intake from './health/sections/Intake';
import LifestylePlan from './health/sections/LifestylePlan';
import HabitTracker from './health/sections/HabitTracker';
import QAChat from './health/sections/QAChat';
import Reminders from './health/sections/Reminders';

const HealthPage: React.FC = () => {
  return (
    <HealthLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="intake" element={<Intake />} />
        <Route path="lifestyle-plan" element={<LifestylePlan />} />
        <Route path="habit-tracker" element={<HabitTracker />} />
        <Route path="qa-chat" element={<QAChat />} />
        <Route path="reminders" element={<Reminders />} />
      </Routes>
    </HealthLayout>
  );
};

export default HealthPage;
