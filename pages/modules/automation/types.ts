
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived';
export type StepType = 'action' | 'condition' | 'delay';
export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER';
export type IntegrationType = 'sheets' | 'telegram' | 'email';

export interface WorkflowStep {
  id: string;
  type: StepType;
  label: string;
  config: {
    actionType?: string;
    conditionValue?: string;
    delayMinutes?: number;
    message?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: 'manual' | 'schedule' | 'webhook';
  steps: WorkflowStep[];
  updatedAt: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  category: string;
  checklist: string[];
  defaultRole: Role;
}

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  enabled: boolean;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  status: 'active' | 'invited';
}

export interface AutomationSectionNav {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
