
import { createJobRecord, getJobById } from '../../lib/jobs/job.queue';

/**
 * Unified Media Job API
 */

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const job = createJobRecord(body);
    return new Response(JSON.stringify(job), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Job creation failed" }), { status: 400 });
  }
};

export const GET = async (jobId: string) => {
  const job = getJobById(jobId);
  if (!job) {
    return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(job), { status: 200 });
};
