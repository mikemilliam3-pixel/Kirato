
export type EducationLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type QuizType = 'MCQ' | 'True-False' | 'Short-Answer';

export interface EduKPI {
  activePath: string;
  lessonsCompleted: number;
  avgQuizScore: number;
  streak: number;
}

export interface LearningPath {
  id: string;
  title: string;
  progress: number;
  modulesCount: number;
  level: EducationLevel;
  status: 'active' | 'archived';
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  level: EducationLevel;
  isCompleted: boolean;
  isBookmarked: boolean;
}

export interface QuizAttempt {
  id: string;
  quizTitle: string;
  score: number;
  date: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  cardsCount: number;
  dueToday: number;
  tags: string[];
}

export interface EducationSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
