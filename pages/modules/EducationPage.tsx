
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EducationLayout from './education/EducationLayout';
import Dashboard from './education/sections/Dashboard';
import LearningPaths from './education/sections/LearningPaths';
import Lessons from './education/sections/Lessons';
import Quizzes from './education/sections/Quizzes';
import Flashcards from './education/sections/Flashcards';
import Notes from './education/sections/Notes';
import StudySchedule from './education/sections/StudySchedule';
import Progress from './education/sections/Progress';

const EducationPage: React.FC = () => {
  return (
    <EducationLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="learning-paths" element={<LearningPaths />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="notes" element={<Notes />} />
        <Route path="study-schedule" element={<StudySchedule />} />
        <Route path="progress" element={<Progress />} />
      </Routes>
    </EducationLayout>
  );
};

export default EducationPage;
