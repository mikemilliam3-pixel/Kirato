
export type SmmPlatform = 'Telegram' | 'Instagram' | 'TikTok' | 'Facebook';
export type SmmStatus = 'draft' | 'scheduled' | 'published';

export interface SmmSchedule {
  id: string;
  platform: SmmPlatform;
  date: string;
  time: string;
  caption: string;
  status: SmmStatus;
  mediaUrl?: string;
}

export interface SmmAsset {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: 'post' | 'hashtag' | 'seo';
  createdAt: string;
  isFavorite: boolean;
}

export interface SmmBrandVoice {
  id: string;
  name: string;
  audience: string;
  tone: string;
  isActive: boolean;
}

export interface SmmSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
