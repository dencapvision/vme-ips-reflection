export interface Env {
  PAGES_URL: string;
  ALLOWED_ORIGINS?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    console.log(`[Proxy] Request received: ${request.method} ${url.pathname}`);

    // 1. Determine target URL (forward to Cloudflare Pages deployment)
    const targetUrl = new URL(url.pathname + url.search, env.PAGES_URL);
    
    // 2. Clone the request with the new URL
    const modifiedRequest = new Request(targetUrl.toString(), {
      body: request.body,
      method: request.method,
      headers: new Headers(request.headers),
      redirect: 'manual'
    });
    
    // Add custom proxy headers
    modifiedRequest.headers.set('X-Forwarded-Host', url.host);
    modifiedRequest.headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
    modifiedRequest.headers.set('X-Edge-Proxy', 'VME-Edge-Proxy');
    
    try {
      // 3. Fetch from the Cloudflare Pages backend
      let response = await fetch(modifiedRequest);
      
      // 4. Build response headers incorporating CORS rules
      const newHeaders = new Headers(response.headers);
      const origin = request.headers.get('Origin');
      
      if (origin) {
        const allowedOrigins = env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : [];
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          newHeaders.set('Access-Control-Allow-Origin', origin);
          newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
          newHeaders.set('Access-Control-Allow-Credentials', 'true');
        }
      }
      
      // Handle OPTIONS preflight request at the proxy level
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: newHeaders
        });
      }
      
      // 5. Return the forwarded response
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
      
    } catch (err: any) {
      console.error('[Proxy] Forwarding error:', err);
      return new Response(JSON.stringify({
        error: 'Proxy Error',
        message: 'Unable to forward request to backend pages service.',
        details: err.message
      }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
