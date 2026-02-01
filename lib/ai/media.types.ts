
export type MediaJobType = 'text-image' | 'text-video' | 'image-video';
export type MediaJobStatus = 'queued' | 'running' | 'done' | 'failed';

export interface MediaJob {
  id: string;
  type: MediaJobType;
  status: MediaJobStatus;
  prompt?: string;
  inputUrl?: string;
  aspect?: string;
  quality?: string;
  resolution?: string;
  duration?: string;
  resultUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  jobId: string;
  url: string;
  type: 'image' | 'video';
  createdAt: string;
}
