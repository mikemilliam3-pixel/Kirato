
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResumeLayout from './resume/ResumeLayout';
import Dashboard from './resume/sections/Dashboard';
import ResumeBuilder from './resume/sections/ResumeBuilder';
import CoverLetters from './resume/sections/CoverLetters';
import JobTracker from './resume/sections/JobTracker';
import InterviewPractice from './sections/InterviewPractice';
import Export from './resume/sections/Export';

// Local InterviewPractice import fix if file was created in resume subfolder
import ResumeInterviewPractice from './resume/sections/InterviewPractice';

const ResumePage: React.FC = () => {
  return (
    <ResumeLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resume-builder" element={<ResumeBuilder />} />
        <Route path="cover-letters" element={<CoverLetters />} />
        <Route path="job-tracker" element={<JobTracker />} />
        <Route path="interview-practice" element={<ResumeInterviewPractice />} />
        <Route path="export" element={<Export />} />
      </Routes>
    </ResumeLayout>
  );
};

export default ResumePage;
