
import { FreelancerSection } from './types';

export const freelancerRoutes: FreelancerSection[] = [
  { id: 'dashboard', path: 'dashboard', icon: 'LayoutDashboard', labelKey: 'dashboard' },
  { id: 'proposals', path: 'proposals', icon: 'FileText', labelKey: 'proposals' },
  { id: 'portfolio', path: 'portfolio', icon: 'Briefcase', labelKey: 'portfolio' },
  { id: 'pricing', path: 'pricing', icon: 'Calculator', labelKey: 'pricing' },
  { id: 'client-crm', path: 'client-crm', icon: 'Users', labelKey: 'crm' },
  { id: 'contracts', path: 'contracts', icon: 'ShieldCheck', labelKey: 'contracts' },
  { id: 'time-tracking', path: 'time-tracking', icon: 'Clock', labelKey: 'time' },
];
