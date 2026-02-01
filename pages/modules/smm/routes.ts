
import { SmmSection } from './types';

export const smmRoutes: SmmSection[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'content-planner', path: 'content-planner', icon: 'Calendar', labelKey: 'planner' },
  { id: 'post-generator', path: 'post-generator', icon: 'Sparkles', labelKey: 'generator' },
  { id: 'brand-voice', path: 'brand-voice', icon: 'UserCheck', labelKey: 'voice' },
  { id: 'hashtag-seo', path: 'hashtag-seo', icon: 'Hash', labelKey: 'hashtag' },
  { id: 'asset-library', path: 'asset-library', icon: 'Library', labelKey: 'library' },
  { id: 'performance', path: 'performance', icon: 'BarChart2', labelKey: 'performance' },
];
