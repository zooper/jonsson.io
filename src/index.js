/**
 * Cloudflare Workers entry point for jonsson.io photography blog
 */

export default {
  async fetch(request, env, ctx) {
    try {
      // Handle request using the existing route handlers
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Basic routing for now - will expand this
      if (pathname === '/') {
        return new Response('Photography Blog - Coming Soon', {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      if (pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ message: 'API endpoint' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Default response
      return new Response('Not Found', { status: 404 });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};