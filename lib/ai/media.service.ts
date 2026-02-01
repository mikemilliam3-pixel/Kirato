
import { MediaJob, MediaJobType } from './media.types';

/**
 * AI Media Service
 * Handles communication with the media job system
 */

export const mediaService = {
  async createTextToImageJob(prompt: string, aspect: string, quality: string): Promise<MediaJob> {
    const res = await fetch('/api/media/jobs', {
      method: 'POST',
      body: JSON.stringify({ type: 'text-image', prompt, aspect, quality })
    });
    return res.json();
  },

  async createTextToVideoJob(prompt: string, aspect: string, quality: string, resolution: string, duration: string): Promise<MediaJob> {
    const res = await fetch('/api/media/jobs', {
      method: 'POST',
      body: JSON.stringify({ type: 'text-video', prompt, aspect, quality, resolution, duration })
    });
    return res.json();
  },

  async createImageToVideoJob(imageUrl: string, prompt: string, aspect: string, quality: string, resolution: string, duration: string): Promise<MediaJob> {
    const res = await fetch('/api/media/jobs', {
      method: 'POST',
      body: JSON.stringify({ type: 'image-video', inputUrl: imageUrl, prompt, aspect, quality, resolution, duration })
    });
    return res.json();
  },

  async getJobStatus(jobId: string): Promise<MediaJob> {
    const res = await fetch(`/api/media/jobs/${jobId}`);
    return res.json();
  }
};
