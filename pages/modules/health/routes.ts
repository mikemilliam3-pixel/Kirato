
import { HealthSection } from './types';

export const healthRoutes: HealthSection[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'intake', path: 'intake', icon: 'ClipboardCheck', labelKey: 'intake' },
  { id: 'lifestyle-plan', path: 'lifestyle-plan', icon: 'Apple', labelKey: 'lifestyle' },
  { id: 'habit-tracker', path: 'habit-tracker', icon: 'Activity', labelKey: 'habits' },
  { id: 'qa-chat', path: 'qa-chat', icon: 'MessageCircle', labelKey: 'chat' },
  { id: 'reminders', path: 'reminders', icon: 'Bell', labelKey: 'reminders' },
];
