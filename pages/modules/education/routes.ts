
import { EducationSection } from './types';

export const eduRoutes: EducationSection[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'learning-paths', path: 'learning-paths', icon: 'Map', labelKey: 'learningPaths' },
  { id: 'lessons', path: 'lessons', icon: 'BookOpen', labelKey: 'lessons' },
  { id: 'quizzes', path: 'quizzes', icon: 'FileQuestion', labelKey: 'quizzes' },
  { id: 'flashcards', path: 'flashcards', icon: 'Copy', labelKey: 'flashcards' },
  { id: 'notes', path: 'notes', icon: 'StickyNote', labelKey: 'notes' },
  { id: 'study-schedule', path: 'study-schedule', icon: 'CalendarDays', labelKey: 'schedule' },
  { id: 'progress', path: 'progress', icon: 'LineChart', labelKey: 'progress' },
];
