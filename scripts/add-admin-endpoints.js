#!/usr/bin/env node

/**
 * Script to add all missing admin endpoints to the Workers code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workerPath = path.join(__dirname, '..', 'src', 'index.js');

// Read the current worker code
let workerCode = fs.readFileSync(workerPath, 'utf8');

// Admin endpoints to add (these will be inserted before the theme endpoints)
const adminEndpoints = `
      // Admin: Get all images
      if (pathname === '/api/admin/images' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const url = new URL(request.url);
          const search = url.searchParams.get('search');
          
          let query, params = [];
          
          if (search && search.trim()) {
            query = \`
              SELECT DISTINCT i.*, 
                     e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                     e.focal_length, e.aperture, e.iso, e.software, e.artist,
                     e.description as exif_description, e.keywords
              FROM images i
              LEFT JOIN image_exif e ON i.id = e.image_id
              WHERE i.original_filename LIKE ? 
                 OR i.alt_text LIKE ?
                 OR i.caption LIKE ?
              ORDER BY i.created_at DESC
            \`;
            const searchTerm = \`%\${search.trim()}%\`;
            params = [searchTerm, searchTerm, searchTerm];
          } else {
            query = \`
              SELECT i.*, 
                     e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                     e.focal_length, e.aperture, e.iso, e.software, e.artist,
                     e.description as exif_description, e.keywords
              FROM images i
              LEFT JOIN image_exif e ON i.id = e.image_id
              ORDER BY i.created_at DESC
            \`;
          }
          
          const { results } = await env.DB.prepare(query).bind(...params).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching images:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Delete image
      if (pathname.startsWith('/api/admin/images/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const imageId = pathname.split('/')[4];
        if (!imageId) {
          return new Response('Image ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM images WHERE id = ?').bind(imageId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Image not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error deleting image:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get gallery images
      if (pathname === '/api/admin/gallery' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(\`
            SELECT 
              g.*,
              i.b2_url,
              i.alt_text,
              i.original_filename,
              i.width,
              i.height,
              i.file_size,
              i.mime_type
            FROM gallery g
            JOIN images i ON g.image_id = i.id
            ORDER BY g.sort_order ASC, g.created_at DESC
          \`).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching admin gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Add image to gallery
      if (pathname === '/api/admin/gallery' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { image_id, title, description, sort_order = 0 } = body;
          
          if (!image_id) {
            return new Response(JSON.stringify({ error: 'Image ID is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(\`
            INSERT INTO gallery (image_id, title, description, sort_order)
            VALUES (?, ?, ?, ?)
          \`).bind(image_id, title || '', description || '', sort_order).run();
          
          const { results } = await env.DB.prepare(\`
            SELECT 
              g.*,
              i.b2_url,
              i.alt_text,
              i.original_filename,
              i.width,
              i.height
            FROM gallery g
            JOIN images i ON g.image_id = i.id
            WHERE g.id = ?
          \`).bind(result.meta.last_row_id).all();
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error adding to gallery:', error);
          if (error.message && error.message.includes('UNIQUE')) {
            return new Response(JSON.stringify({ error: 'Image is already in gallery' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return new Response(JSON.stringify({ error: 'Failed to add to gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update gallery item
      if (pathname.startsWith('/api/admin/gallery/') && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const galleryId = pathname.split('/')[4];
        if (!galleryId) {
          return new Response('Gallery ID required', { status: 400 });
        }
        
        try {
          const body = await request.json();
          const { title, description, sort_order, visible } = body;
          
          await env.DB.prepare(\`
            UPDATE gallery 
            SET title = ?, description = ?, sort_order = ?, visible = ?
            WHERE id = ?
          \`).bind(title || '', description || '', sort_order || 0, visible ? 1 : 0, galleryId).run();
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating gallery item:', error);
          return new Response(JSON.stringify({ error: 'Failed to update gallery item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Remove from gallery
      if (pathname.startsWith('/api/admin/gallery/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const galleryId = pathname.split('/')[4];
        if (!galleryId) {
          return new Response('Gallery ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM gallery WHERE id = ?').bind(galleryId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Gallery item not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error removing from gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to remove from gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get about page
      if (pathname === '/api/admin/about' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(\`
            SELECT 
              a.*,
              i.b2_url as profile_image_url,
              i.alt_text as profile_image_alt
            FROM about_page a
            LEFT JOIN images i ON a.profile_image_id = i.id
            ORDER BY a.id DESC
            LIMIT 1
          \`).all();
          
          if (results.length === 0) {
            return new Response(JSON.stringify({ error: 'About page not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching about page for admin:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update about page
      if (pathname === '/api/admin/about' && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { title, lead_text, content, profile_image_id } = body;
          
          if (!title) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const profileImageIdValue = profile_image_id && profile_image_id !== '' ? parseInt(profile_image_id) : null;
          
          // Check if about page exists
          const { results: existing } = await env.DB.prepare('SELECT id FROM about_page ORDER BY id DESC LIMIT 1').all();
          
          if (existing.length > 0) {
            // Update existing
            await env.DB.prepare(\`
              UPDATE about_page 
              SET title = ?, lead_text = ?, content = ?, profile_image_id = ?, updated_at = ?
              WHERE id = ?
            \`).bind(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString(), existing[0].id).run();
          } else {
            // Create new
            await env.DB.prepare(\`
              INSERT INTO about_page (title, lead_text, content, profile_image_id, updated_at)
              VALUES (?, ?, ?, ?, ?)
            \`).bind(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString()).run();
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating about page:', error);
          return new Response(JSON.stringify({ error: 'Failed to update about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Get all social links
      if (pathname === '/api/admin/social-links' && request.method === 'GET') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const { results } = await env.DB.prepare(\`
            SELECT id, platform, label, url, icon_svg, sort_order, visible
            FROM social_links 
            ORDER BY sort_order ASC
          \`).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching social links for admin:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch social links' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Create social link
      if (pathname === '/api/admin/social-links' && request.method === 'POST') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const body = await request.json();
          const { platform, label, url, icon_svg, sort_order, visible } = body;
          
          if (!platform || !label || !url) {
            return new Response(JSON.stringify({ error: 'Platform, label, and URL are required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(\`
            INSERT INTO social_links (platform, label, url, icon_svg, sort_order, visible, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          \`).bind(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString()).run();
          
          const { results } = await env.DB.prepare('SELECT * FROM social_links WHERE id = ?').bind(result.meta.last_row_id).all();
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error creating social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to create social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Update social link
      if (pathname.startsWith('/api/admin/social-links/') && request.method === 'PUT') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const linkId = pathname.split('/')[4];
        if (!linkId) {
          return new Response('Link ID required', { status: 400 });
        }
        
        try {
          const body = await request.json();
          const { platform, label, url, icon_svg, sort_order, visible } = body;
          
          if (!platform || !label || !url) {
            return new Response(JSON.stringify({ error: 'Platform, label, and URL are required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          const result = await env.DB.prepare(\`
            UPDATE social_links 
            SET platform = ?, label = ?, url = ?, icon_svg = ?, sort_order = ?, visible = ?, updated_at = ?
            WHERE id = ?
          \`).bind(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString(), linkId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Social link not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error updating social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to update social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      // Admin: Delete social link
      if (pathname.startsWith('/api/admin/social-links/') && request.method === 'DELETE') {
        const session = await isAuthenticated(request);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const linkId = pathname.split('/')[4];
        if (!linkId) {
          return new Response('Link ID required', { status: 400 });
        }
        
        try {
          const result = await env.DB.prepare('DELETE FROM social_links WHERE id = ?').bind(linkId).run();
          
          if (result.meta.changes === 0) {
            return new Response(JSON.stringify({ error: 'Social link not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error deleting social link:', error);
          return new Response(JSON.stringify({ error: 'Failed to delete social link' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
`;

// Insert the admin endpoints before the theme endpoints
const themeEndpointMarker = '      // Admin: Get current theme';
const insertionPoint = workerCode.indexOf(themeEndpointMarker);

if (insertionPoint !== -1) {
  workerCode = workerCode.slice(0, insertionPoint) + adminEndpoints + '\n      ' + workerCode.slice(insertionPoint);
  
  // Write the updated code back
  fs.writeFileSync(workerPath, workerCode);
  console.log('✅ Successfully added all admin endpoints to the Workers code');
} else {
  console.error('❌ Could not find insertion point for admin endpoints');
  process.exit(1);
}