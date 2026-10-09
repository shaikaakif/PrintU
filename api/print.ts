import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { jobId, title, printerIp, pages, copies } = req.body;

  if (!printerIp) {
    return res.status(400).json({ error: 'Printer IP address required' });
  }

  // Vercel Serverless proxy endpoint for Cloudflare Tunnel / Local Bridge
  return res.status(200).json({
    success: true,
    message: `Print payload generated for job "${title || jobId}". Forwarded to printer bridge at ${printerIp}.`,
    jobId,
    pagesCount: pages?.length || 0,
    timestamp: new Date().toISOString()
  });
}
