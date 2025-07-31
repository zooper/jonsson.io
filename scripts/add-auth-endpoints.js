#!/usr/bin/env node

/**
 * Script to add authentication and static file serving endpoints to the Workers code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workerPath = path.join(__dirname, '..', 'src', 'index.js');

// Read the current worker code
let workerCode = fs.readFileSync(workerPath, 'utf8');

// Authentication and static file endpoints to add
const authEndpoints = `
      // Admin: Login
      if (pathname === '/api/admin/login' && request.method === 'POST') {
        try {
          const body = await request.json();
          const { password } = body;
          
          if (password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Generate session token
          const token = crypto.randomUUID();
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          
          // Store session in environment variable or simple map for demo
          // In production, you'd want to use Durable Objects or KV storage
          const sessionData = {
            token,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString()
          };
          
          return new Response(JSON.stringify({ 
            token,
            expiresAt: expiresAt.toISOString()
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
          
        } catch (error) {
          console.error('Login error:', error);
          return new Response(JSON.stringify({ error: 'Login failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Static file serving
      if (pathname.startsWith('/static/')) {
        return serveStaticFile(pathname);
      }

      // Admin interface
      if (pathname === '/admin' || pathname === '/admin/') {
        return serveAdminInterface();
      }
`;

// Function to serve admin interface and static files
const staticFunctions = `
  // Authentication helper
  async function isAuthenticated(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.substring(7);
    
    // Simple token validation - in production you'd check against KV/DO storage
    if (!token || token.length < 10) {
      return false;
    }
    
    return { token, authenticated: true };
  }

  // Serve static files
  function serveStaticFile(pathname) {
    const staticFiles = {
      "/static/css/admin.css": \`/* Admin CSS styles would go here */\`,
      "/static/js/admin.js": \`${fs.readFileSync(path.join(__dirname, '..', 'static', 'js', 'admin.js'), 'utf8').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
      "/static/css/editor.css": \`/* Editor CSS styles would go here */\`,
    };
    
    const content = staticFiles[pathname];
    if (!content) {
      return new Response('File not found', { status: 404 });
    }
    
    const contentType = pathname.endsWith('.css') ? 'text/css' : 
                       pathname.endsWith('.js') ? 'application/javascript' : 
                       'text/plain';
    
    return new Response(content, {
      headers: { 'Content-Type': contentType }
    });
  }

  // Serve admin interface
  function serveAdminInterface() {
    const adminHTML = \`${fs.readFileSync(path.join(__dirname, '..', 'static', 'admin.html'), 'utf8').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
    
    return new Response(adminHTML, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

`;

// Insert the authentication endpoints before the theme endpoints
const themeEndpointMarker = '      // Admin: Get current theme';
const insertionPoint = workerCode.indexOf(themeEndpointMarker);

if (insertionPoint !== -1) {
  workerCode = workerCode.slice(0, insertionPoint) + authEndpoints + '\n      ' + workerCode.slice(insertionPoint);
  
  // Add the static functions before the export default
  const exportDefaultMarker = 'export default {';
  const exportPoint = workerCode.indexOf(exportDefaultMarker);
  
  if (exportPoint !== -1) {
    workerCode = workerCode.slice(0, exportPoint) + staticFunctions + '\n' + workerCode.slice(exportPoint);
    
    // Write the updated code back
    fs.writeFileSync(workerPath, workerCode);
    console.log('✅ Successfully added authentication and static file serving endpoints');
  } else {
    console.error('❌ Could not find export default marker');
    process.exit(1);
  }
} else {
  console.error('❌ Could not find insertion point for authentication endpoints');
  process.exit(1);
}