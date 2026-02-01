
import { VoiceSectionNav } from './types';

export const voiceRoutes: VoiceSectionNav[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'script-writer', path: 'script-writer', icon: 'FileText', labelKey: 'scripts' },
  { id: 'projects', path: 'projects', icon: 'FolderOpen', labelKey: 'projects' },
  { id: 'planner', path: 'planner', icon: 'ClipboardList', labelKey: 'planner' },
  { id: 'audio', path: 'audio', icon: 'Music', labelKey: 'audio' },
  { id: 'export', path: 'export', icon: 'Download', labelKey: 'export' },
];
