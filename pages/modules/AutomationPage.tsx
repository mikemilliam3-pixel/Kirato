
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AutomationLayout from './automation/AutomationLayout';
import Dashboard from './automation/sections/Dashboard';
import WorkflowBuilder from './automation/sections/WorkflowBuilder';
import TaskTemplates from './automation/sections/TaskTemplates';
import Integrations from './automation/sections/Integrations';
import KPIDashboard from './automation/sections/KPIDashboard';
import TeamRoles from './automation/sections/TeamRoles';

const AutomationPage: React.FC = () => {
  return (
    <AutomationLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workflow-builder" element={<WorkflowBuilder />} />
        <Route path="task-templates" element={<TaskTemplates />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="kpi" element={<KPIDashboard />} />
        <Route path="team-roles" element={<TeamRoles />} />
      </Routes>
    </AutomationLayout>
  );
};

export default AutomationPage;
