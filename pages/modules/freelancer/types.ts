
export type ProposalStatus = 'draft' | 'sent' | 'won' | 'lost';
export type ClientStatus = 'active' | 'inactive';
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold';

export interface FreelancerKPI {
  activeClients: number;
  activeProjects: number;
  proposalsSent: number;
  invoicesDue: string;
}

export interface FreelancerClient {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  tags: string[];
}

export interface FreelancerProject {
  id: string;
  clientId: string;
  title: string;
  budget: string;
  status: ProjectStatus;
}

export interface FreelancerProposal {
  id: string;
  clientId: string;
  title: string;
  amount: string;
  status: ProposalStatus;
  date: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  imageUrl: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  description: string;
  duration: string; // HH:mm:ss
  date: string;
}

export interface FreelancerSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
