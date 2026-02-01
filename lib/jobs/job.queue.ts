
import { MediaJob, MediaJobStatus } from '../ai/media.types';
import { GoogleGenAI } from "@google/genai";
import fs from 'node:fs/promises';
import path from 'node:path';

// Conceptual DB Store
const JOBS_DB: Map<string, MediaJob> = new Map();

export const createJobRecord = (params: Partial<MediaJob>): MediaJob => {
  const id = Math.random().toString(36).substr(2, 9);
  const newJob: MediaJob = {
    id,
    type: params.type || 'text-image',
    status: 'queued',
    prompt: params.prompt,
    inputUrl: params.inputUrl,
    aspect: params.aspect,
    quality: params.quality,
    resolution: params.resolution,
    duration: params.duration,
    userId: 'current-user', // Mock user
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  JOBS_DB.set(id, newJob);
  processJob(id); // Kick off processing
  return newJob;
};

export const getJobById = (id: string): MediaJob | undefined => {
  return JOBS_DB.get(id);
};

const processJob = async (id: string) => {
  const job = JOBS_DB.get(id);
  if (!job) return;

  // Move to running status
  const runningJob = { ...job, status: 'running' as MediaJobStatus, updatedAt: new Date().toISOString() };
  JOBS_DB.set(id, runningJob);

  try {
    if (job.type === 'text-image') {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: job.prompt || 'A creative professional social media post background',
        config: {
          imageConfig: {
            aspectRatio: (job.aspect as any) || "1:1"
          }
        },
      });

      let base64Image = "";
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (!base64Image) {
        throw new Error("No image data returned from AI model");
      }

      const fileName = `img-${id}.png`;
      const publicPath = path.join(process.cwd(), 'public', 'generated');
      const filePath = path.join(publicPath, fileName);

      // Ensure directory exists
      await fs.mkdir(publicPath, { recursive: true });
      
      // Save binary data
      await fs.writeFile(filePath, Buffer.from(base64Image, 'base64'));

      const doneJob = { 
        ...runningJob, 
        status: 'done' as MediaJobStatus, 
        resultUrl: `/generated/${fileName}`,
        updatedAt: new Date().toISOString() 
      };
      JOBS_DB.set(id, doneJob);
    } else {
      // Keep mock logic for video types for now
      setTimeout(() => {
        const isVideo = job.type.includes('video');
        const resultUrl = isVideo 
          ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' 
          : 'https://picsum.photos/1024/1024';

        const doneJob = { 
          ...runningJob, 
          status: 'done' as MediaJobStatus, 
          resultUrl,
          updatedAt: new Date().toISOString() 
        };
        JOBS_DB.set(id, doneJob);
      }, 5000);
    }
  } catch (error: any) {
    console.error(`Job ${id} failed:`, error);
    JOBS_DB.set(id, {
      ...runningJob,
      status: 'failed' as MediaJobStatus,
      updatedAt: new Date().toISOString()
    });
  }
};
