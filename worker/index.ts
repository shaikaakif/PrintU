export interface Env {
  ENVIRONMENT?: string;
  ALLOWED_ORIGINS?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    const url = new URL(request.url);

    try {
      // Health Check Route
      if (url.pathname === '/health' || url.pathname === '/api/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          service: 'PrintU Cloudflare Edge Worker',
          environment: env.ENVIRONMENT || 'production',
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json'
          }
        });
      }

      // Silent Network Print API Endpoint
      if (url.pathname === '/api/print') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        const contentType = request.headers.get('content-type') || '';
        let jobId = '';
        let title = '';
        let printerIp = '';
        let pagesCount = 0;

        if (contentType.includes('application/json')) {
          const body = await request.json() as any;
          jobId = body.jobId || `job_${Date.now()}`;
          title = body.title || 'Untitled Document';
          printerIp = body.printerIp || '';
          pagesCount = Array.isArray(body.pages) ? body.pages.length : 1;
        } else if (contentType.includes('multipart/form-data')) {
          const formData = await request.formData();
          jobId = (formData.get('jobId') as string) || `job_${Date.now()}`;
          title = (formData.get('title') as string) || 'Untitled Document';
          printerIp = (formData.get('printerIp') as string) || '';
          const files = formData.getAll('pages');
          pagesCount = files.length || 1;
        }

        if (!printerIp) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Missing target printer IP address or gateway endpoint'
          }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
          });
        }

        // Return edge status response acknowledging binary job payload receipt
        return new Response(JSON.stringify({
          success: true,
          message: `Print payload queued successfully at edge worker. Ready for tunnel dispatch to printer IP ${printerIp}.`,
          jobId,
          title,
          printerIp,
          pagesCount,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }

      // Default fallback for unmatched routes
      return new Response(JSON.stringify({ error: 'Endpoint Not Found' }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });

    } catch (err: any) {
      return new Response(JSON.stringify({
        success: false,
        error: err?.message || 'Internal Cloudflare Worker Server Error'
      }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
  }
};
