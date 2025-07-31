// Cloudflare Pages Functions middleware
export async function onRequest(context) {
  const { request, env, next } = context;
  
  // Add CORS headers for API routes
  if (request.url.includes('/api/')) {
    const response = await next();
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
    
    // Add CORS headers to actual response
    const newResponse = new Response(response.body, response);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  }
  
  return next();
}