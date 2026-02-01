
import { LegalSection } from './types';

export const legalRoutes: LegalSection[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'templates', path: 'templates', icon: 'FileText', labelKey: 'templates' },
  { id: 'clause-explainer', path: 'clause-explainer', icon: 'FileSearch', labelKey: 'explainer' },
  { id: 'qa-chat', path: 'qa-chat', icon: 'MessageCircle', labelKey: 'chat' },
  { id: 'checklist', path: 'checklist', icon: 'ClipboardCheck', labelKey: 'checklist' },
];
