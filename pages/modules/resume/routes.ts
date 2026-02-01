
import { ResumeSectionNav } from './types';

export const resumeRoutes: ResumeSectionNav[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'resume-builder', path: 'resume-builder', icon: 'FileText', labelKey: 'builder' },
  { id: 'cover-letters', path: 'cover-letters', icon: 'Mail', labelKey: 'coverLetters' },
  { id: 'job-tracker', path: 'job-tracker', icon: 'Briefcase', labelKey: 'jobTracker' },
  { id: 'interview-practice', path: 'interview-practice', icon: 'Mic', labelKey: 'interview' },
  { id: 'export', path: 'export', icon: 'Download', labelKey: 'export' },
];
