
export type Severity = 'mild' | 'moderate' | 'severe';
export type HabitType = 'water' | 'sleep' | 'steps' | 'meditation' | 'custom';

export interface HealthKPI {
  habitsCompleted: number;
  streak: number;
  lastIntakeDate: string;
  activePlan: string;
}

export interface SymptomIntake {
  id: string;
  concern: string;
  severity: Severity;
  duration: string;
  hasRedFlags: boolean;
  timestamp: string;
}

export interface LifestylePlan {
  id: string;
  goals: string[];
  dailyChecklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
}

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  goal: number;
  unit: string;
  current: number;
}

export interface HealthSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
