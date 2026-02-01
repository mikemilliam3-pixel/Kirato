
import { AutomationSectionNav } from './types';

export const automationRoutes: AutomationSectionNav[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'workflow-builder', path: 'workflow-builder', icon: 'Zap', labelKey: 'workflows' },
  { id: 'task-templates', path: 'task-templates', icon: 'ClipboardList', labelKey: 'templates' },
  { id: 'integrations', path: 'integrations', icon: 'Link', labelKey: 'integrations' },
  { id: 'kpi', path: 'kpi', icon: 'BarChart3', labelKey: 'kpi' },
  { id: 'team-roles', path: 'team-roles', icon: 'Users', labelKey: 'team' },
];
