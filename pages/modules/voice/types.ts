
export type VoiceProjectStatus = 'draft' | 'active' | 'done' | 'archived';
export type VoiceScriptTone = 'calm' | 'energetic' | 'professional' | 'funny';
export type VoiceAssetType = 'recording' | 'music' | 'sfx';
export type VoiceJobStatus = 'queued' | 'running' | 'done' | 'failed';
export type VoicePlanStatus = 'todo' | 'recording' | 'done';

export interface VoiceScript {
  id: string;
  title: string;
  purpose: string;
  tone: VoiceScriptTone;
  content: string;
  durationTarget: number; // seconds
  estimatedDuration: number;
  updatedAt: string;
  projectId?: string;
  tags: string[];
}

export interface VoiceProject {
  id: string;
  title: string;
  description: string;
  status: VoiceProjectStatus;
  updatedAt: string;
  tags: string[];
}

export interface VoicePlanItem {
  id: string;
  projectId: string;
  title: string;
  speaker: string;
  targetDuration: number;
  notes: string;
  status: VoicePlanStatus;
  order: number;
}

export interface VoiceAudioAsset {
  id: string;
  projectId: string;
  title: string;
  type: VoiceAssetType;
  url: string;
  duration?: number;
  notes?: string;
  createdAt: string;
  tags: string[];
}

export interface VoiceExportJob {
  id: string;
  projectId: string;
  status: VoiceJobStatus;
  format: 'mp3' | 'wav' | 'zip';
  createdAt: string;
  outputUrl?: string;
}

export interface VoiceSectionNav {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}
