
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VoiceLayout from './voice/VoiceLayout';
import Dashboard from './voice/sections/Dashboard';
import ScriptWriter from './voice/sections/ScriptWriter';
import Projects from './voice/sections/Projects';
import Planner from './voice/sections/Planner';
import Audio from './voice/sections/Audio';
import Export from './voice/sections/Export';

const VoicePage: React.FC = () => {
  return (
    <VoiceLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="script-writer" element={<ScriptWriter />} />
        <Route path="projects" element={<Projects />} />
        <Route path="planner" element={<Planner />} />
        <Route path="audio" element={<Audio />} />
        <Route path="export" element={<Export />} />
      </Routes>
    </VoiceLayout>
  );
};

export default VoicePage;
