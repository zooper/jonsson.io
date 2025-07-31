import { getDatabase } from './database.js';
import multer from 'multer';
import { uploadImageToB2, deleteImageFromB2 } from './storage.js';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const upload = multer({ storage: multer.memoryStorage() });

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const db = getDatabase();
  const session = db.prepare('SELECT * FROM admin_sessions WHERE token = ? AND expires_at > datetime(\'now\')').get(token);
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  next();
}

// Helper function to download image data
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const request = client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });
    
    request.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

export function setupRoutes(app) {
  const db = getDatabase();
  
  // Homepage - serve static HTML
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  
  // Individual post pages
  app.get('/post/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/post.html'));
  });

  // Public API: Get current theme (no authentication required)
  app.get('/api/theme', (req, res) => {
    try {
      const themeSetting = db.prepare('SELECT setting_value FROM site_settings WHERE setting_key = ?').get('theme');
      const currentTheme = themeSetting ? themeSetting.setting_value : 'default';
      
      res.json({ theme: currentTheme });
    } catch (error) {
      console.error('Error loading theme:', error);
      res.json({ theme: 'default' }); // Fallback to default
    }
  });
  
  // API: Get all published posts with images
  app.get('/api/posts', (req, res) => {
    try {
      const posts = db.prepare(`
        SELECT 
          p.*,
          i.b2_url as featured_image_url,
          i.alt_text as featured_image_alt,
          i.width as featured_image_width,
          i.height as featured_image_height
        FROM posts p
        LEFT JOIN images i ON p.featured_image_id = i.id
        WHERE p.published = 1
        ORDER BY p.created_at DESC
      `).all();
      
      // Get images for each post (excluding featured image to avoid duplicates)
      const postsWithImages = posts.map(post => {
        const images = db.prepare(`
          SELECT i.*, pi.sort_order 
          FROM images i
          JOIN post_images pi ON i.id = pi.image_id
          WHERE pi.post_id = ? AND i.id != COALESCE(?, 0)
          ORDER BY pi.sort_order
        `).all(post.id, post.featured_image_id);
        
        return { ...post, images };
      });
      
      res.json(postsWithImages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });
  
  // API: Get single post by slug
  app.get('/api/posts/:slug', (req, res) => {
    try {
      const post = db.prepare(`
        SELECT 
          p.*,
          i.b2_url as featured_image_url,
          i.alt_text as featured_image_alt,
          i.width as featured_image_width,
          i.height as featured_image_height
        FROM posts p
        LEFT JOIN images i ON p.featured_image_id = i.id
        WHERE p.slug = ? AND p.published = 1
      `).get(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      // Get images for this post (excluding featured image to avoid duplicates)
      const images = db.prepare(`
        SELECT i.*, pi.sort_order 
        FROM images i
        JOIN post_images pi ON i.id = pi.image_id
        WHERE pi.post_id = ? AND i.id != COALESCE(?, 0)
        ORDER BY pi.sort_order
      `).all(post.id, post.featured_image_id);
      
      res.json({ ...post, images });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });
  
  // Admin login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Generate session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    db.prepare('INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)').run(token, expiresAt.toISOString());
    
    res.json({ token });
  });
  
  // Admin: Get all posts (including unpublished)
  app.get('/api/admin/posts', isAuthenticated, (req, res) => {
    try {
      const posts = db.prepare(`
        SELECT 
          p.*,
          i.b2_url as featured_image_url,
          i.alt_text as featured_image_alt,
          p.featured_image_id
        FROM posts p
        LEFT JOIN images i ON p.featured_image_id = i.id
        ORDER BY p.created_at DESC
      `).all();
      
      res.json(posts);
    } catch (error) {
      console.error('Error fetching admin posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });
  
  // Admin: Create new post
  app.post('/api/admin/posts', isAuthenticated, (req, res) => {
    const { title, content, published = false, featured_image_id } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    try {
      const slug = createSlug(title);
      const featuredImageIdValue = featured_image_id && featured_image_id !== '' ? parseInt(featured_image_id) : null;
      
      const result = db.prepare(`
        INSERT INTO posts (title, content, slug, published, featured_image_id, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(title, content || '', slug, published ? 1 : 0, featuredImageIdValue, new Date().toISOString());
      
      const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
      res.json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });
  
  // Admin: Update post
  app.put('/api/admin/posts/:id', isAuthenticated, (req, res) => {
    const postId = req.params.id;
    const { title, content, published = false, featured_image_id, update_slug = false } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    try {
      const featuredImageIdValue = featured_image_id && featured_image_id !== '' ? parseInt(featured_image_id) : null;
      
      // Only update slug if explicitly requested via update_slug parameter
      if (update_slug) {
        const slug = createSlug(title);
        db.prepare(`
          UPDATE posts 
          SET title = ?, content = ?, slug = ?, published = ?, featured_image_id = ?, updated_at = ?
          WHERE id = ?
        `).run(title, content || '', slug, published ? 1 : 0, featuredImageIdValue, new Date().toISOString(), postId);
      } else {
        // Preserve existing slug - only update other fields
        db.prepare(`
          UPDATE posts 
          SET title = ?, content = ?, published = ?, featured_image_id = ?, updated_at = ?
          WHERE id = ?
        `).run(title, content || '', published ? 1 : 0, featuredImageIdValue, new Date().toISOString(), postId);
      }
      
      const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });
  
  // Admin: Delete post
  app.delete('/api/admin/posts/:id', isAuthenticated, (req, res) => {
    const postId = req.params.id;
    
    try {
      const result = db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });
  
  // Admin: Get all images
  app.get('/api/admin/images', isAuthenticated, (req, res) => {
    const { search } = req.query;
    
    try {
      let query;
      let params = [];
      
      if (search && search.trim()) {
        // Search in image metadata and EXIF data
        query = `
          SELECT DISTINCT i.*, 
                 e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                 e.focal_length, e.aperture, e.iso, e.software, e.artist,
                 e.description as exif_description, e.keywords
          FROM images i
          LEFT JOIN image_exif e ON i.id = e.image_id
          WHERE i.original_filename LIKE ? 
             OR i.alt_text LIKE ?
             OR i.caption LIKE ?
             OR e.camera_make LIKE ?
             OR e.camera_model LIKE ?
             OR e.lens_make LIKE ?
             OR e.lens_model LIKE ?
             OR e.software LIKE ?
             OR e.artist LIKE ?
             OR e.description LIKE ?
             OR e.keywords LIKE ?
          ORDER BY i.created_at DESC
        `;
        const searchTerm = `%${search.trim()}%`;
        params = Array(11).fill(searchTerm);
      } else {
        // Get all images with basic EXIF info
        query = `
          SELECT i.*, 
                 e.camera_make, e.camera_model, e.lens_make, e.lens_model,
                 e.focal_length, e.aperture, e.iso, e.software, e.artist,
                 e.description as exif_description, e.keywords
          FROM images i
          LEFT JOIN image_exif e ON i.id = e.image_id
          ORDER BY i.created_at DESC
        `;
      }
      
      const images = db.prepare(query).all(...params);
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  });
  
  // Admin: Delete image
  app.delete('/api/admin/images/:id', isAuthenticated, async (req, res) => {
    const imageId = req.params.id;
    
    try {
      // Get image info first
      const image = db.prepare('SELECT * FROM images WHERE id = ?').get(imageId);
      
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      // Delete from Backblaze B2
      if (image.b2_file_id && image.filename) {
        try {
          await deleteImageFromB2(image.b2_file_id, image.filename);
        } catch (b2Error) {
          console.warn('Failed to delete from B2:', b2Error);
          // Continue with database deletion even if B2 deletion fails
        }
      }
      
      // Delete from database
      db.prepare('DELETE FROM images WHERE id = ?').run(imageId);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  });
  
  // Admin: Upload image
  app.post('/api/admin/upload', isAuthenticated, upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    try {
      const uploadResult = await uploadImageToB2(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      
      // Save to database
      const result = db.prepare(`
        INSERT INTO images (filename, original_filename, alt_text, caption, b2_file_id, b2_url, width, height, file_size, mime_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uploadResult.filename,
        uploadResult.originalFilename,
        req.body.alt_text || '',
        req.body.caption || '',
        uploadResult.fileId,
        uploadResult.url,
        uploadResult.width,
        uploadResult.height,
        uploadResult.fileSize,
        uploadResult.mimeType
      );
      
      const imageId = result.lastInsertRowid;
      
      // Save EXIF data if available
      if (uploadResult.exifData) {
        try {
          db.prepare(`
            INSERT INTO image_exif (
              image_id, camera_make, camera_model, lens_make, lens_model,
              focal_length, focal_length_35mm, aperture, shutter_speed, iso,
              flash, exposure_mode, white_balance, metering_mode, date_taken,
              gps_latitude, gps_longitude, gps_altitude, orientation, color_space,
              software, artist, copyright, description, keywords, rating, raw_exif
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            imageId,
            uploadResult.exifData.camera_make,
            uploadResult.exifData.camera_model,
            uploadResult.exifData.lens_make,
            uploadResult.exifData.lens_model,
            uploadResult.exifData.focal_length,
            uploadResult.exifData.focal_length_35mm,
            uploadResult.exifData.aperture,
            uploadResult.exifData.shutter_speed,
            uploadResult.exifData.iso,
            uploadResult.exifData.flash,
            uploadResult.exifData.exposure_mode,
            uploadResult.exifData.white_balance,
            uploadResult.exifData.metering_mode,
            uploadResult.exifData.date_taken,
            uploadResult.exifData.gps_latitude,
            uploadResult.exifData.gps_longitude,
            uploadResult.exifData.gps_altitude,
            uploadResult.exifData.orientation,
            uploadResult.exifData.color_space,
            uploadResult.exifData.software,
            uploadResult.exifData.artist,
            uploadResult.exifData.copyright,
            uploadResult.exifData.description,
            uploadResult.exifData.keywords,
            uploadResult.exifData.rating,
            uploadResult.exifData.raw_exif
          );
          console.log('EXIF data saved for image:', imageId);
        } catch (exifError) {
          console.error('Error saving EXIF data:', exifError);
          // Don't fail the upload if EXIF saving fails
        }
      }
      
      const image = db.prepare('SELECT * FROM images WHERE id = ?').get(imageId);
      res.json(image);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });
  
  // Admin: Clear post gallery images
  app.delete('/api/admin/posts/:id/gallery', isAuthenticated, (req, res) => {
    const postId = req.params.id;
    
    try {
      db.prepare('DELETE FROM post_images WHERE post_id = ?').run(postId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error clearing gallery images:', error);
      res.status(500).json({ error: 'Failed to clear gallery images' });
    }
  });
  
  // Admin: Add gallery images to post
  app.post('/api/admin/posts/:id/gallery', isAuthenticated, (req, res) => {
    const postId = req.params.id;
    const { images } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' });
    }
    
    try {
      const stmt = db.prepare('INSERT INTO post_images (post_id, image_id, sort_order) VALUES (?, ?, ?)');
      
      images.forEach(image => {
        stmt.run(postId, image.id, image.sort_order || 0);
      });
      
      res.json({ success: true, count: images.length });
    } catch (error) {
      console.error('Error adding gallery images:', error);
      res.status(500).json({ error: 'Failed to add gallery images' });
    }
  });

  // API: Get gallery images for homepage
  app.get('/api/gallery', (req, res) => {
    try {
      const galleryImages = db.prepare(`
        SELECT 
          g.*,
          i.id as image_id,
          i.b2_url,
          i.alt_text,
          i.original_filename,
          i.width,
          i.height,
          i.file_size,
          i.mime_type,
          e.date_taken,
          e.gps_latitude,
          e.gps_longitude,
          e.iso,
          e.aperture,
          e.shutter_speed,
          e.focal_length
        FROM gallery g
        JOIN images i ON g.image_id = i.id
        LEFT JOIN image_exif e ON i.id = e.image_id
        WHERE g.visible = 1
        ORDER BY g.sort_order ASC, g.created_at DESC
      `).all();
      
      res.json(galleryImages);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({ error: 'Failed to fetch gallery' });
    }
  });

  // Admin: Get all gallery images (including hidden)
  app.get('/api/admin/gallery', isAuthenticated, (req, res) => {
    try {
      const galleryImages = db.prepare(`
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
      `).all();
      
      res.json(galleryImages);
    } catch (error) {
      console.error('Error fetching admin gallery:', error);
      res.status(500).json({ error: 'Failed to fetch gallery' });
    }
  });

  // Admin: Add image to gallery
  app.post('/api/admin/gallery', isAuthenticated, (req, res) => {
    const { image_id, title, description, sort_order = 0 } = req.body;
    
    if (!image_id) {
      return res.status(400).json({ error: 'Image ID is required' });
    }
    
    try {
      const result = db.prepare(`
        INSERT INTO gallery (image_id, title, description, sort_order)
        VALUES (?, ?, ?, ?)
      `).run(image_id, title || '', description || '', sort_order);
      
      const galleryItem = db.prepare(`
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
      `).get(result.lastInsertRowid);
      
      res.json(galleryItem);
    } catch (error) {
      console.error('Error adding to gallery:', error);
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: 'Image is already in gallery' });
      } else {
        res.status(500).json({ error: 'Failed to add to gallery' });
      }
    }
  });

  // Admin: Update gallery item
  app.put('/api/admin/gallery/:id', isAuthenticated, (req, res) => {
    const galleryId = req.params.id;
    const { title, description, sort_order, visible } = req.body;
    
    try {
      db.prepare(`
        UPDATE gallery 
        SET title = ?, description = ?, sort_order = ?, visible = ?
        WHERE id = ?
      `).run(title || '', description || '', sort_order || 0, visible ? 1 : 0, galleryId);
      
      const galleryItem = db.prepare(`
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
      `).get(galleryId);
      
      if (!galleryItem) {
        return res.status(404).json({ error: 'Gallery item not found' });
      }
      
      res.json(galleryItem);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      res.status(500).json({ error: 'Failed to update gallery item' });
    }
  });

  // Admin: Remove from gallery
  app.delete('/api/admin/gallery/:id', isAuthenticated, (req, res) => {
    const galleryId = req.params.id;
    
    try {
      const result = db.prepare('DELETE FROM gallery WHERE id = ?').run(galleryId);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Gallery item not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing from gallery:', error);
      res.status(500).json({ error: 'Failed to remove from gallery' });
    }
  });

  // API: Get EXIF data for an image
  app.get('/api/images/:id/exif', (req, res) => {
    const imageId = req.params.id;
    
    try {
      const exifData = db.prepare(`
        SELECT * FROM image_exif WHERE image_id = ?
      `).get(imageId);
      
      if (!exifData) {
        return res.status(404).json({ error: 'EXIF data not found' });
      }
      
      // Parse raw EXIF if needed
      if (exifData.raw_exif) {
        try {
          exifData.raw_exif_parsed = JSON.parse(exifData.raw_exif);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
      
      res.json(exifData);
    } catch (error) {
      console.error('Error fetching EXIF data:', error);
      res.status(500).json({ error: 'Failed to fetch EXIF data' });
    }
  });

  // API: Get image by URL (for finding database ID from B2 URL)
  app.get('/api/images/by-url', (req, res) => {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    try {
      const image = db.prepare(`
        SELECT * FROM images WHERE b2_url = ?
      `).get(url);
      
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      res.json(image);
    } catch (error) {
      console.error('Error fetching image by URL:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  });

  // API: Get image by filename (for finding database ID from filename)
  app.get('/api/images/by-filename', (req, res) => {
    const { filename } = req.query;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename parameter is required' });
    }
    
    try {
      const image = db.prepare(`
        SELECT * FROM images WHERE original_filename = ? OR filename = ?
      `).get(filename, filename);
      
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      res.json(image);
    } catch (error) {
      console.error('Error fetching image by filename:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  });

  // Admin: AI Writing Assistant
  app.post('/api/admin/ai-assist', isAuthenticated, async (req, res) => {
    const { action, mode, content, images, exifData } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    try {
      let prompt = '';
      
      switch (action) {
        case 'describe-images':
          // For image description, we'll use vision model - handle this separately
          break;
          
        case 'exif-story':
          prompt = `As a photography blogger writing in ${mode} style, create a narrative story based on the EXIF data and technical details. Include location, camera settings, and shooting conditions.`;
          if (exifData) {
            prompt += `\n\nEXIF Data:\n${JSON.stringify(exifData, null, 2)}`;
          }
          break;
          
        case 'improve-text':
          prompt = `Please improve this photography blog content in ${mode} style. Make it more engaging while maintaining the photographer's voice:`;
          if (content) {
            prompt += `\n\n"${content}"`;
          }
          break;
          
        case 'expand-content':
          prompt = `Expand this photography blog content in ${mode} style. Add more detail, context, and storytelling elements:`;
          if (content) {
            prompt += `\n\n"${content}"`;
          }
          break;
          
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
      
      let openaiResponse;
      
      if (action === 'describe-images' && images && images.length > 0) {
        // Use vision model for image analysis
        const imageMessages = [];
        
        for (const [index, image] of images.entries()) {
          const imageMessage = {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze the image I'm about to show you. This is image ${index + 1} with filename "${image.filename || 'Unknown'}". Describe EXACTLY what you see in this specific image - the subjects, colors, lighting, composition, and mood. Write in ${mode} style as a professional photography blogger. Be very specific about what is actually visible in this particular photograph.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image.url,
                  detail: 'high'
                }
              }
            ]
          };
          imageMessages.push(imageMessage);
        }
        
        const visionRequestBody = {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a professional photography blogger and visual analyst. Analyze images with expertise in composition, lighting, technical aspects, and artistic elements. Write detailed, unique descriptions for each image that capture both the technical and emotional aspects. Focus ONLY on what you actually see in each image.'
            },
            ...imageMessages
          ],
          max_tokens: 1500,
          temperature: 0.7,
        };
        
        openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visionRequestBody),
        });
      } else {
        // Use regular text model for other actions
        openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a professional photography blogger assistant. Write engaging, authentic content that helps photographers tell their stories. Keep responses concise but compelling.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });
      }
      
      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }
      
      const openaiData = await openaiResponse.json();
      const generatedContent = openaiData.choices[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error('No content generated from OpenAI');
      }
      
      res.json({
        content: generatedContent,
        action: action,
        mode: mode
      });
      
    } catch (error) {
      console.error('AI assist error:', error);
      res.status(500).json({ error: 'Failed to generate AI content' });
    }
  });

  // Admin: Test B2 connection
  app.get('/api/admin/test-b2', isAuthenticated, async (req, res) => {
    try {
      // Check environment variables
      const keyId = process.env.B2_APPLICATION_KEY_ID || process.env.B2_ACCOUNT_ID;
      const key = process.env.B2_APPLICATION_KEY || process.env.B2_ACCOUNT_KEY;
      const bucketId = process.env.B2_BUCKET_ID;
      const bucketName = process.env.B2_BUCKET_NAME;
      
      if (!keyId || !key || !bucketId || !bucketName) {
        return res.status(400).json({ 
          error: 'Missing B2 credentials',
          missing: {
            keyId: !keyId,
            key: !key,
            bucketId: !bucketId,
            bucketName: !bucketName
          }
        });
      }
      
      const { initB2 } = await import('./storage.js');
      const b2 = initB2();
      
      const authResult = await b2.authorize();
      
      res.json({
        success: true,
        accountId: authResult.data.accountId,
        allowedBucket: authResult.data.allowed?.bucketId,
        configuredBucket: bucketId,
        bucketMatch: authResult.data.allowed?.bucketId === bucketId,
        apiUrl: authResult.data.apiUrl,
        downloadUrl: authResult.data.downloadUrl
      });
      
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        details: error.response?.data || 'No additional details'
      });
    }
  });

  // Admin: Browse bucket files with folder support
  app.get('/api/admin/bucket-files', isAuthenticated, async (req, res) => {
    const { prefix = '', filter = 'all', test } = req.query;
    
    // If this is a test request, return diagnostic information
    if (test === 'true') {
      try {
        console.log('B2 diagnostic test requested...');
        
        // Check environment variables
        const keyId = process.env.B2_APPLICATION_KEY_ID || process.env.B2_ACCOUNT_ID;
        const key = process.env.B2_APPLICATION_KEY || process.env.B2_ACCOUNT_KEY;
        const bucketId = process.env.B2_BUCKET_ID;
        const bucketName = process.env.B2_BUCKET_NAME;
        
        console.log('Environment variables:');
        console.log('- Key ID:', keyId ? keyId.substring(0, 8) + '...' : 'MISSING');
        console.log('- Key:', key ? 'SET (' + key.length + ' chars)' : 'MISSING');
        console.log('- Bucket ID:', bucketId ? bucketId.substring(0, 8) + '...' : 'MISSING');
        console.log('- Bucket Name:', bucketName || 'MISSING');
        
        if (!keyId || !key || !bucketId || !bucketName) {
          return res.status(400).json({ 
            success: false,
            error: 'Missing B2 credentials',
            missing: {
              keyId: !keyId,
              key: !key,
              bucketId: !bucketId,
              bucketName: !bucketName
            }
          });
        }
        
        const { initB2 } = await import('./storage.js');
        const b2 = initB2();
        
        const authResult = await b2.authorize();
        
        return res.json({
          success: true,
          accountId: authResult.data.accountId,
          allowedBucket: authResult.data.allowed?.bucketId,
          configuredBucket: bucketId,
          bucketMatch: authResult.data.allowed?.bucketId === bucketId,
          apiUrl: authResult.data.apiUrl,
          downloadUrl: authResult.data.downloadUrl
        });
        
      } catch (error) {
        return res.status(500).json({ 
          success: false,
          error: error.message,
          details: error.response?.data || 'No additional details'
        });
      }
    }
    
    try {
      // Check environment variables first
      if (!process.env.B2_APPLICATION_KEY_ID && !process.env.B2_ACCOUNT_ID) {
        return res.status(500).json({ error: 'B2 Application Key ID not configured' });
      }
      
      if (!process.env.B2_APPLICATION_KEY && !process.env.B2_ACCOUNT_KEY) {
        return res.status(500).json({ error: 'B2 Application Key not configured' });
      }
      
      if (!process.env.B2_BUCKET_ID) {
        return res.status(500).json({ error: 'B2 Bucket ID not configured' });
      }
      
      if (!process.env.B2_BUCKET_NAME) {
        return res.status(500).json({ error: 'B2 Bucket Name not configured' });
      }
      
      
      const { initB2 } = await import('./storage.js');
      const b2 = initB2();
      
      // Authorize with B2
      const authResult = await b2.authorize();
      
      // Verify we have the necessary authorization data
      if (!authResult.data || !authResult.data.authorizationToken) {
        throw new Error('B2 authorization succeeded but no authorization token received');
      }
      
      // Check if our bucket ID is valid by checking against authorized buckets
      const allowedBuckets = authResult.data.allowed?.bucketId;
      if (allowedBuckets && allowedBuckets !== process.env.B2_BUCKET_ID) {
        throw new Error(`B2 Application Key is not authorized for bucket ${process.env.B2_BUCKET_ID}. Allowed: ${allowedBuckets}`);
      }
      
      // List files with optional prefix for folder browsing
      const listParams = {
        bucketId: process.env.B2_BUCKET_ID,
        maxFileCount: 10000
      };
      
      if (prefix) {
        listParams.startFileName = prefix;
        listParams.prefix = prefix;
      }
      
      const response = await b2.listFileNames(listParams);
      
      if (!response.data || !response.data.files) {
        return res.json({ files: [], folders: [] });
      }
      
      // Get all existing filenames from database
      const existingFiles = db.prepare('SELECT filename FROM images').all();
      const existingFileNames = new Set(existingFiles.map(f => f.filename));
      
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.tif', '.webp'];
      const allFiles = response.data.files;
      
      // Process files to separate folders and files
      const folders = new Set();
      const files = [];
      
      for (const file of allFiles) {
        // Skip blog folder files when browsing root (they're managed through the blog interface)
        if (!prefix && file.fileName.startsWith('blog/')) {
          continue;
        }
        
        const relativePath = file.fileName.startsWith(prefix) 
          ? file.fileName.substring(prefix.length)
          : file.fileName;
        
        // Check if this is a folder (contains more path segments)
        const pathParts = relativePath.split('/');
        if (pathParts.length > 1 && pathParts[0]) {
          // Skip adding blog folder to root folder list
          if (!prefix && pathParts[0] === 'blog') {
            continue;
          }
          folders.add(pathParts[0]);
          continue;
        }
        
        // Skip if it's empty (folder marker) or not in current directory
        if (!relativePath || relativePath.includes('/')) {
          continue;
        }
        
        const isImage = imageExtensions.some(ext => 
          file.fileName.toLowerCase().endsWith(ext)
        );
        const isImported = existingFileNames.has(file.fileName);
        const canImport = isImage && !isImported;
        
        // Apply filter
        if (filter === 'images' && !isImage) continue;
        if (filter === 'new-images' && !canImport) continue;
        
        files.push({
          fileName: file.fileName,
          displayName: relativePath,
          fileId: file.fileId,
          contentType: file.contentType,
          contentLength: file.contentLength,
          uploadTimestamp: file.uploadTimestamp,
          url: `https://${process.env.B2_BUCKET_NAME}.s3.us-west-001.backblazeb2.com/${file.fileName}`,
          isImage: isImage,
          isImported: isImported,
          canImport: canImport
        });
      }
      
      // Convert folders Set to Array and sort
      const folderArray = Array.from(folders).sort().map(folderName => ({
        name: folderName,
        path: prefix + folderName + '/'
      }));
      
      res.json({
        files: files.sort((a, b) => a.displayName.localeCompare(b.displayName)),
        folders: folderArray,
        currentPath: prefix,
        stats: {
          totalFiles: files.length,
          imageFiles: files.filter(f => f.isImage).length,
          importableFiles: files.filter(f => f.canImport).length
        }
      });
    } catch (error) {
      console.error('Error browsing bucket files:', error);
      
      // More specific error messages
      if (error.message && error.message.includes('authorization')) {
        res.status(500).json({ error: 'B2 authorization failed. Check your B2 credentials in .env file.' });
      } else if (error.message && error.message.includes('bucket')) {
        res.status(500).json({ error: 'Invalid bucket configuration. Check B2_BUCKET_ID and B2_BUCKET_NAME in .env file.' });
      } else if (error.response) {
        res.status(500).json({ error: `B2 API error: ${error.response.status} - ${error.response.data?.message || error.message}` });
      } else {
        res.status(500).json({ error: `Failed to browse bucket files: ${error.message}` });
      }
    }
  });

  // Admin: Import selected files from bucket
  app.post('/api/admin/import-files', isAuthenticated, async (req, res) => {
    const { fileIds } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ error: 'File IDs array is required' });
    }
    
    try {
      const { initB2 } = await import('./storage.js');
      const { extractExifData } = await import('./exif.js');
      const b2 = initB2();
      
      // Authorize with B2
      await b2.authorize();
      
      let importedCount = 0;
      let failedCount = 0;
      const results = [];
      
      for (const fileId of fileIds) {
        try {
          // Get file info
          const fileInfo = await b2.getFileInfo({
            fileId: fileId
          });
          
          if (!fileInfo.data) {
            failedCount++;
            continue;
          }
          
          const fileName = fileInfo.data.fileName;
          const contentType = fileInfo.data.contentType;
          const fileSize = parseInt(fileInfo.data.contentLength) || 0;
          const url = `https://${process.env.B2_BUCKET_NAME}.s3.us-west-001.backblazeb2.com/${fileName}`;
          
          
          // Download the file
          const buffer = await downloadImage(url);
          
          // Extract EXIF data
          let exifData = null;
          if (contentType.startsWith('image/')) {
            exifData = await extractExifData(buffer);
          }
          
          // Get image metadata using Sharp
          let width = null;
          let height = null;
          if (contentType.startsWith('image/')) {
            const sharp = (await import('sharp')).default;
            const metadata = await sharp(buffer).metadata();
            width = metadata.width;
            height = metadata.height;
          }
          
          // Save to database
          const result = db.prepare(`
            INSERT INTO images (filename, original_filename, alt_text, caption, b2_file_id, b2_url, width, height, file_size, mime_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            fileName,
            fileName, // Use filename as original filename
            '', // Empty alt text initially
            '', // Empty caption initially
            fileId,
            url,
            width,
            height,
            fileSize,
            contentType
          );
          
          const imageId = result.lastInsertRowid;
          
          // Save EXIF data if available
          if (exifData) {
            try {
              db.prepare(`
                INSERT INTO image_exif (
                  image_id, camera_make, camera_model, lens_make, lens_model,
                  focal_length, focal_length_35mm, aperture, shutter_speed, iso,
                  flash, exposure_mode, white_balance, metering_mode, date_taken,
                  gps_latitude, gps_longitude, gps_altitude, orientation, color_space,
                  software, artist, copyright, description, keywords, rating, raw_exif
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).run(
                imageId,
                exifData.camera_make,
                exifData.camera_model,
                exifData.lens_make,
                exifData.lens_model,
                exifData.focal_length,
                exifData.focal_length_35mm,
                exifData.aperture,
                exifData.shutter_speed,
                exifData.iso,
                exifData.flash,
                exifData.exposure_mode,
                exifData.white_balance,
                exifData.metering_mode,
                exifData.date_taken,
                exifData.gps_latitude,
                exifData.gps_longitude,
                exifData.gps_altitude,
                exifData.orientation,
                exifData.color_space,
                exifData.software,
                exifData.artist,
                exifData.copyright,
                exifData.description,
                exifData.keywords,
                exifData.rating,
                exifData.raw_exif
              );
            } catch (exifError) {
            }
          }
          
          importedCount++;
          results.push({
            fileName: fileName,
            imageId: imageId,
            hasExif: !!exifData,
            status: 'success'
          });
          
        } catch (error) {
          failedCount++;
          results.push({
            fileId: fileId,
            status: 'failed',
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        imported: importedCount,
        failed: failedCount,
        total: fileIds.length,
        results: results
      });
      
    } catch (error) {
      console.error('Error importing files:', error);
      res.status(500).json({ error: 'Failed to import files' });
    }
  });

  // Admin: Migrate existing images to blog folder structure
  app.post('/api/admin/migrate-images', isAuthenticated, async (req, res) => {
    try {
      // Get all images that are still in root (not in blog/ folder)
      const rootImages = db.prepare(`
        SELECT * FROM images 
        WHERE filename NOT LIKE 'blog/%'
        ORDER BY created_at DESC
      `).all();
      
      if (rootImages.length === 0) {
        return res.json({
          success: true,
          message: 'No images need migration - all are already organized',
          migrated: 0,
          failed: 0,
          total: 0
        });
      }
      
      const { initB2 } = await import('./storage.js');
      const b2 = initB2();
      
      // Authorize with B2
      await b2.authorize();
      
      let migratedCount = 0;
      let failedCount = 0;
      const results = [];
      
      for (const image of rootImages) {
        try {
          console.log(`Migrating image ${image.id}: ${image.filename}`);
          
          // Generate new organized filename
          const uploadDate = new Date(image.created_at);
          const year = uploadDate.getFullYear();
          const month = String(uploadDate.getMonth() + 1).padStart(2, '0');
          const ext = path.extname(image.filename);
          const baseName = path.basename(image.filename, ext);
          const newFilename = `blog/images/${year}/${month}/${baseName}${ext}`;
          
          // Download the existing file
          const currentUrl = `https://${process.env.B2_BUCKET_NAME}.s3.us-west-001.backblazeb2.com/${image.filename}`;
          const buffer = await downloadImage(currentUrl);
          
          // Get upload URL for new location
          const uploadUrl = await b2.getUploadUrl({
            bucketId: process.env.B2_BUCKET_ID
          });
          
          // Upload to new location
          const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadUrl.data.uploadUrl,
            uploadAuthToken: uploadUrl.data.authorizationToken,
            fileName: newFilename,
            data: buffer,
            mime: image.mime_type || 'image/jpeg',
            info: {
              originalName: image.original_filename
            }
          });
          
          if (!uploadResponse.data) {
            throw new Error('Failed to upload file to new location');
          }
          
          const newFileId = uploadResponse.data.fileId;
          const newUrl = `https://${process.env.B2_BUCKET_NAME}.s3.us-west-001.backblazeb2.com/${newFilename}`;
          
          // Update database with new file info
          db.prepare(`
            UPDATE images 
            SET filename = ?, b2_file_id = ?, b2_url = ?
            WHERE id = ?
          `).run(newFilename, newFileId, newUrl, image.id);
          
          // Delete old file from B2
          try {
            await b2.deleteFileVersion({
              fileId: image.b2_file_id,
              fileName: image.filename
            });
            console.log(`Deleted old file: ${image.filename}`);
          } catch (deleteError) {
            console.warn(`Failed to delete old file ${image.filename}:`, deleteError);
            // Continue migration even if old file deletion fails
          }
          
          migratedCount++;
          results.push({
            imageId: image.id,
            oldFilename: image.filename,
            newFilename: newFilename,
            status: 'success'
          });
          
          console.log(`Successfully migrated: ${image.filename} -> ${newFilename}`);
          
        } catch (error) {
          console.error(`Error migrating image ${image.id} (${image.filename}):`, error);
          failedCount++;
          results.push({
            imageId: image.id,
            filename: image.filename,
            status: 'failed',
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: `Migration completed: ${migratedCount} migrated, ${failedCount} failed`,
        migrated: migratedCount,
        failed: failedCount,
        total: rootImages.length,
        results: results.filter(r => r.status === 'failed') // Only return failed ones to keep response size manageable
      });
      
    } catch (error) {
      console.error('Error during migration:', error);
      res.status(500).json({ error: 'Failed to migrate images' });
    }
  });

  // Admin: Update EXIF data for existing images
  app.post('/api/admin/update-exif', isAuthenticated, async (req, res) => {
    try {
      // Get all images that don't have EXIF data or need updating
      const images = db.prepare(`
        SELECT i.* 
        FROM images i
        LEFT JOIN image_exif e ON i.id = e.image_id
        WHERE e.image_id IS NULL
        ORDER BY i.created_at DESC
      `).all();
      
      if (images.length === 0) {
        return res.json({ 
          success: true, 
          message: 'All images already have EXIF data',
          processed: 0,
          failed: 0
        });
      }
      
      let processedCount = 0;
      let failedCount = 0;
      const { extractExifData } = await import('./exif.js');
      
      for (const image of images) {
        try {
          console.log(`Processing image ${image.id}: ${image.original_filename} from ${image.b2_url}`);
          
          // Download the image from B2
          const buffer = await downloadImage(image.b2_url);
          
          const exifData = await extractExifData(buffer);
          
          if (exifData) {
            // Save EXIF data to database
            db.prepare(`
              INSERT INTO image_exif (
                image_id, camera_make, camera_model, lens_make, lens_model,
                focal_length, focal_length_35mm, aperture, shutter_speed, iso,
                flash, exposure_mode, white_balance, metering_mode, date_taken,
                gps_latitude, gps_longitude, gps_altitude, orientation, color_space,
                software, artist, copyright, description, keywords, rating, raw_exif
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              image.id,
              exifData.camera_make,
              exifData.camera_model,
              exifData.lens_make,
              exifData.lens_model,
              exifData.focal_length,
              exifData.focal_length_35mm,
              exifData.aperture,
              exifData.shutter_speed,
              exifData.iso,
              exifData.flash,
              exifData.exposure_mode,
              exifData.white_balance,
              exifData.metering_mode,
              exifData.date_taken,
              exifData.gps_latitude,
              exifData.gps_longitude,
              exifData.gps_altitude,
              exifData.orientation,
              exifData.color_space,
              exifData.software,
              exifData.artist,
              exifData.copyright,
              exifData.description,
              exifData.keywords,
              exifData.rating,
              exifData.raw_exif
            );
            
            processedCount++;
          } else {
            // Don't count this as a failure - some images genuinely don't have EXIF data
            processedCount++;
          }
        } catch (error) {
          failedCount++;
        }
      }
      
      res.json({
        success: true,
        message: `EXIF update completed: ${processedCount} processed, ${failedCount} failed`,
        processed: processedCount,
        failed: failedCount,
        total: images.length,
        details: failedCount > 0 ? 'Check server logs for failure details' : 'All images processed successfully'
      });
      
    } catch (error) {
      console.error('Error updating EXIF data:', error);
      res.status(500).json({ error: 'Failed to update EXIF data' });
    }
  });

  // API: Get about page content
  app.get('/api/about', (req, res) => {
    try {
      const about = db.prepare(`
        SELECT 
          a.*,
          i.b2_url as profile_image_url,
          i.alt_text as profile_image_alt
        FROM about_page a
        LEFT JOIN images i ON a.profile_image_id = i.id
        ORDER BY a.id DESC
        LIMIT 1
      `).get();
      
      if (!about) {
        return res.status(404).json({ error: 'About page not found' });
      }
      
      res.json(about);
    } catch (error) {
      console.error('Error fetching about page:', error);
      res.status(500).json({ error: 'Failed to fetch about page' });
    }
  });

  // Admin: Get about page for editing
  app.get('/api/admin/about', isAuthenticated, (req, res) => {
    try {
      const about = db.prepare(`
        SELECT 
          a.*,
          i.b2_url as profile_image_url,
          i.alt_text as profile_image_alt
        FROM about_page a
        LEFT JOIN images i ON a.profile_image_id = i.id
        ORDER BY a.id DESC
        LIMIT 1
      `).get();
      
      if (!about) {
        return res.status(404).json({ error: 'About page not found' });
      }
      
      res.json(about);
    } catch (error) {
      console.error('Error fetching about page for admin:', error);
      res.status(500).json({ error: 'Failed to fetch about page' });
    }
  });

  // Admin: Update about page
  app.put('/api/admin/about', isAuthenticated, (req, res) => {
    const { title, lead_text, content, profile_image_id } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    try {
      const profileImageIdValue = profile_image_id && profile_image_id !== '' ? parseInt(profile_image_id) : null;
      
      // Check if about page exists
      const existing = db.prepare('SELECT id FROM about_page ORDER BY id DESC LIMIT 1').get();
      
      if (existing) {
        // Update existing
        db.prepare(`
          UPDATE about_page 
          SET title = ?, lead_text = ?, content = ?, profile_image_id = ?, updated_at = ?
          WHERE id = ?
        `).run(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString(), existing.id);
      } else {
        // Create new
        db.prepare(`
          INSERT INTO about_page (title, lead_text, content, profile_image_id, updated_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(title, lead_text || '', content || '', profileImageIdValue, new Date().toISOString());
      }
      
      // Return updated about page
      const about = db.prepare(`
        SELECT 
          a.*,
          i.b2_url as profile_image_url,
          i.alt_text as profile_image_alt
        FROM about_page a
        LEFT JOIN images i ON a.profile_image_id = i.id
        ORDER BY a.id DESC
        LIMIT 1
      `).get();
      
      res.json(about);
    } catch (error) {
      console.error('Error updating about page:', error);
      res.status(500).json({ error: 'Failed to update about page' });
    }
  });

  // Theme API endpoints
  app.get('/api/admin/theme', isAuthenticated, (req, res) => {
    try {
      const themeSetting = db.prepare('SELECT setting_value FROM site_settings WHERE setting_key = ?').get('theme');
      const currentTheme = themeSetting ? themeSetting.setting_value : 'default';
      
      res.json({ theme: currentTheme });
    } catch (error) {
      console.error('Error loading theme:', error);
      res.status(500).json({ error: 'Failed to load theme' });
    }
  });

  app.put('/api/admin/theme', isAuthenticated, (req, res) => {
    try {
      const { theme } = req.body;
      
      if (!theme) {
        return res.status(400).json({ error: 'Theme is required' });
      }

      // Validate theme
      const validThemes = ['default', 'classic', 'dark', 'ocean', 'forest', 'sunset', 'monochrome', 'solarized-light', 'solarized-dark', 'leica'];
      if (!validThemes.includes(theme)) {
        return res.status(400).json({ error: 'Invalid theme' });
      }

      // Check if theme setting exists
      const existing = db.prepare('SELECT * FROM site_settings WHERE setting_key = ?').get('theme');
      
      if (existing) {
        // Update existing theme
        db.prepare(`
          UPDATE site_settings 
          SET setting_value = ?, updated_at = ?
          WHERE setting_key = ?
        `).run(theme, new Date().toISOString(), 'theme');
      } else {
        // Create new theme setting
        db.prepare(`
          INSERT INTO site_settings (setting_key, setting_value, updated_at)
          VALUES (?, ?, ?)
        `).run('theme', theme, new Date().toISOString());
      }
      
      res.json({ success: true, theme });
    } catch (error) {
      console.error('Error saving theme:', error);
      res.status(500).json({ error: 'Failed to save theme' });
    }
  });

  // Get social links (public endpoint)
  app.get('/api/social-links', (req, res) => {
    try {
      const db = getDatabase();
      const socialLinks = db.prepare(`
        SELECT id, platform, label, url, icon_svg, sort_order, visible
        FROM social_links 
        WHERE visible = 1
        ORDER BY sort_order ASC
      `).all();
      
      res.json(socialLinks);
    } catch (error) {
      console.error('Error fetching social links:', error);
      res.status(500).json({ error: 'Failed to fetch social links' });
    }
  });

  // Admin: Get all social links
  app.get('/api/admin/social-links', isAuthenticated, (req, res) => {
    try {
      const db = getDatabase();
      const socialLinks = db.prepare(`
        SELECT id, platform, label, url, icon_svg, sort_order, visible
        FROM social_links 
        ORDER BY sort_order ASC
      `).all();
      
      res.json(socialLinks);
    } catch (error) {
      console.error('Error fetching social links for admin:', error);
      res.status(500).json({ error: 'Failed to fetch social links' });
    }
  });

  // Admin: Create social link
  app.post('/api/admin/social-links', isAuthenticated, (req, res) => {
    try {
      const { platform, label, url, icon_svg, sort_order, visible } = req.body;
      
      if (!platform || !label || !url) {
        return res.status(400).json({ error: 'Platform, label, and URL are required' });
      }

      const db = getDatabase();
      const result = db.prepare(`
        INSERT INTO social_links (platform, label, url, icon_svg, sort_order, visible, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString());
      
      const newLink = db.prepare('SELECT * FROM social_links WHERE id = ?').get(result.lastInsertRowid);
      res.json(newLink);
    } catch (error) {
      console.error('Error creating social link:', error);
      res.status(500).json({ error: 'Failed to create social link' });
    }
  });

  // Admin: Update social link
  app.put('/api/admin/social-links/:id', isAuthenticated, (req, res) => {
    try {
      const { id } = req.params;
      const { platform, label, url, icon_svg, sort_order, visible } = req.body;
      
      if (!platform || !label || !url) {
        return res.status(400).json({ error: 'Platform, label, and URL are required' });
      }

      const db = getDatabase();
      const result = db.prepare(`
        UPDATE social_links 
        SET platform = ?, label = ?, url = ?, icon_svg = ?, sort_order = ?, visible = ?, updated_at = ?
        WHERE id = ?
      `).run(platform, label, url, icon_svg || '', sort_order || 0, visible !== false ? 1 : 0, new Date().toISOString(), id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Social link not found' });
      }
      
      const updatedLink = db.prepare('SELECT * FROM social_links WHERE id = ?').get(id);
      res.json(updatedLink);
    } catch (error) {
      console.error('Error updating social link:', error);
      res.status(500).json({ error: 'Failed to update social link' });
    }
  });

  // Admin: Delete social link
  app.delete('/api/admin/social-links/:id', isAuthenticated, (req, res) => {
    try {
      const { id } = req.params;
      const db = getDatabase();
      
      const result = db.prepare('DELETE FROM social_links WHERE id = ?').run(id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Social link not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting social link:', error);
      res.status(500).json({ error: 'Failed to delete social link' });
    }
  });

  // Admin route
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/index.html'));
  });
}