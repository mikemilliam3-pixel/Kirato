
export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
export type ResumeSectionType = 'profile' | 'experience' | 'education' | 'skills' | 'projects' | 'languages';

export interface CareerKPI {
  resumesSaved: number;
  coverLettersCreated: number;
  jobsTracked: number;
  interviewsPracticed: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface ResumeData {
  id: string;
  title: string; // e.g. "Software Engineer Resume"
  lastUpdated: string;
  profile: {
    fullName: string;
    jobTitle: string;
    location: string;
    email: string;
    phone: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

export interface CoverLetter {
  id: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  content: string;
  date: string;
}

export interface TrackedJob {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  salary?: string;
  link?: string;
  nextStepDate?: string;
  notes?: string;
}

export interface InterviewSession {
  id: string;
  role: string;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number; // 0-100
}

export interface ResumeSectionNav {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
