/**
 * Cloudflare Workers entry point for jonsson.io photography blog
 */

// Basic HTML template for individual post pages
const postPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="post-title">Tomas Jonsson - Photography</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8f9fa; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .nav { margin-bottom: 2rem; }
        .nav a { color: #007bff; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .post-header { margin-bottom: 2rem; }
        .post-title { font-size: 2.5rem; margin-bottom: 0.5rem; color: #333; }
        .post-meta { color: #666; font-size: 0.9rem; }
        .post-content { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .featured-image { width: 100%; height: auto; border-radius: 8px; margin-bottom: 2rem; }
        .gallery { margin-top: 2rem; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .gallery-item { border-radius: 8px; overflow: hidden; }
        .gallery-item img { width: 100%; height: auto; display: block; }
        .loading { text-align: center; padding: 3rem; color: #666; }
        .error { text-align: center; padding: 3rem; color: #d32f2f; }
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="/">← Back to Blog</a>
        </nav>
        <div id="post-content" class="loading">Loading post...</div>
    </div>
    
    <script>
        async function loadPost() {
            try {
                const slug = window.location.pathname.split('/post/')[1];
                if (!slug) {
                    throw new Error('No post slug found');
                }
                
                const response = await fetch(\`/api/posts/\${slug}\`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Post not found');
                    }
                    throw new Error('Failed to load post');
                }
                
                const post = await response.json();
                
                // Update page title
                document.getElementById('post-title').textContent = \`\${post.title} - Tomas Jonsson Photography\`;
                
                // Build post HTML
                let html = \`
                    <div class="post-header">
                        <h1 class="post-title">\${post.title}</h1>
                        <div class="post-meta">
                            Published: \${new Date(post.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="post-content">
                \`;
                
                // Add featured image if available
                if (post.featured_image_url) {
                    html += \`<img src="\${post.featured_image_url}" alt="\${post.featured_image_alt || post.title}" class="featured-image">\`;
                }
                
                // Add content
                if (post.content) {
                    html += \`<div>\${post.content.replace(/\\n/g, '<br>')}</div>\`;
                }
                
                // Add gallery if images exist
                if (post.images && post.images.length > 0) {
                    html += \`
                        <div class="gallery">
                            <h3>Gallery</h3>
                            <div class="gallery-grid">
                    \`;
                    post.images.forEach(image => {
                        html += \`
                            <div class="gallery-item">
                                <img src="\${image.b2_url}" alt="\${image.alt_text || ''}" loading="lazy">
                            </div>
                        \`;
                    });
                    html += \`
                            </div>
                        </div>
                    \`;
                }
                
                html += '</div>';
                
                document.getElementById('post-content').innerHTML = html;
            } catch (error) {
                document.getElementById('post-content').innerHTML = \`<div class="error">Error: \${error.message}</div>\`;
            }
        }
        
        loadPost();
    </script>
</body>
</html>
`;

// Basic HTML template for the about page
const aboutPageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Tomas Jonsson Photography</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8f9fa; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .nav { margin-bottom: 2rem; }
        .nav a { color: #007bff; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .about-content { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .profile-image { width: 200px; height: 200px; border-radius: 50%; object-fit: cover; float: left; margin: 0 2rem 1rem 0; }
        .about-title { font-size: 2.5rem; margin-bottom: 1rem; color: #333; }
        .lead-text { font-size: 1.2rem; color: #666; margin-bottom: 2rem; font-style: italic; }
        .loading { text-align: center; padding: 3rem; color: #666; }
        .error { text-align: center; padding: 3rem; color: #d32f2f; }
        .social-links { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eee; }
        .social-links h3 { margin-bottom: 1rem; }
        .social-link { display: inline-block; margin-right: 1rem; margin-bottom: 0.5rem; }
        .social-link a { color: #007bff; text-decoration: none; }
        .social-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="/">← Back to Blog</a>
        </nav>
        <div id="about-content" class="loading">Loading about page...</div>
    </div>
    
    <script>
        async function loadAbout() {
            try {
                const [aboutResponse, socialResponse] = await Promise.all([
                    fetch('/api/about'),
                    fetch('/api/social-links')
                ]);
                
                if (!aboutResponse.ok) {
                    throw new Error('Failed to load about page');
                }
                
                const about = await aboutResponse.json();
                const socialLinks = socialResponse.ok ? await socialResponse.json() : [];
                
                let html = \`
                    <div class="about-content">
                        <h1 class="about-title">\${about.title || 'About'}</h1>
                \`;
                
                // Add profile image if available
                if (about.profile_image_url) {
                    html += \`<img src="\${about.profile_image_url}" alt="\${about.profile_image_alt || 'Profile'}" class="profile-image">\`;
                }
                
                // Add lead text
                if (about.lead_text) {
                    html += \`<div class="lead-text">\${about.lead_text}</div>\`;
                }
                
                // Add content
                if (about.content) {
                    html += \`<div>\${about.content.replace(/\\n/g, '<br>')}</div>\`;
                }
                
                // Add social links
                if (socialLinks.length > 0) {
                    html += \`
                        <div class="social-links">
                            <h3>Connect</h3>
                    \`;
                    socialLinks.forEach(link => {
                        html += \`
                            <div class="social-link">
                                <a href="\${link.url}" target="_blank" rel="noopener noreferrer">\${link.label}</a>
                            </div>
                        \`;
                    });
                    html += '</div>';
                }
                
                html += '</div>';
                
                document.getElementById('about-content').innerHTML = html;
            } catch (error) {
                document.getElementById('about-content').innerHTML = \`<div class="error">Error: \${error.message}</div>\`;
            }
        }
        
        loadAbout();
    </script>
</body>
</html>
`;

// Basic HTML template for the homepage
const homepageHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tomas Jonsson - Photography</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 2rem; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .site-header { text-align: center; margin-bottom: 3rem; }
        .site-header h1 { color: #333; margin-bottom: 1rem; }
        .main-nav { margin-top: 1rem; }
        .main-nav a { color: #007bff; text-decoration: none; margin: 0 1rem; font-size: 1.1rem; }
        .main-nav a:hover { text-decoration: underline; }
        .posts { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .post { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .post h2 { margin-top: 0; }
        .post h2 a { color: #333; text-decoration: none; }
        .post h2 a:hover { color: #007bff; }
        .post-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem; }
        .post-meta { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
        .post-excerpt { margin-bottom: 1rem; line-height: 1.6; }
        .read-more { color: #007bff; text-decoration: none; font-weight: 500; }
        .read-more:hover { text-decoration: underline; }
        .loading { text-align: center; padding: 3rem; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <header class="site-header">
            <h1>Tomas Jonsson - Photography</h1>
            <nav class="main-nav">
                <a href="/">Blog</a>
                <a href="/about">About</a>
            </nav>
        </header>
        <div id="posts" class="loading">Loading posts...</div>
    </div>
    
    <script>
        async function loadPosts() {
            try {
                const response = await fetch('/api/posts');
                const posts = await response.json();
                
                const postsContainer = document.getElementById('posts');
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<p>No posts found.</p>';
                    return;
                }
                
                postsContainer.className = 'posts';
                postsContainer.innerHTML = posts.map(post => \`
                    <div class="post">
                        \${post.featured_image_url ? '<img src="' + post.featured_image_url + '" alt="' + (post.featured_image_alt || post.title) + '" class="post-image">' : ''}
                        <h2><a href="/post/\${post.slug}">\${post.title}</a></h2>
                        <div class="post-meta">
                            Published: \${new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div class="post-excerpt">\${post.content ? post.content.substring(0, 200) + '...' : ''}</div>
                        <a href="/post/\${post.slug}" class="read-more">Read more →</a>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('posts').innerHTML = '<p>Error loading posts.</p>';
                console.error('Error loading posts:', error);
            }
        }
        
        loadPosts();
    </script>
</body>
</html>
`;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Homepage
      if (pathname === '/') {
        return new Response(homepageHTML, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // API: Get all published posts
      if (pathname === '/api/posts' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
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
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching posts:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get current theme
      if (pathname === '/api/theme' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(
            'SELECT setting_value FROM site_settings WHERE setting_key = ?'
          ).bind('theme').all();
          
          const currentTheme = results.length > 0 ? results[0].setting_value : 'default';
          
          return new Response(JSON.stringify({ theme: currentTheme }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error loading theme:', error);
          return new Response(JSON.stringify({ theme: 'default' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get social links
      if (pathname === '/api/social-links' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
            SELECT id, platform, label, url, icon_svg, sort_order, visible
            FROM social_links 
            WHERE visible = 1
            ORDER BY sort_order ASC
          `).all();
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching social links:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch social links' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get single post by slug
      if (pathname.startsWith('/api/posts/') && request.method === 'GET') {
        const slug = pathname.split('/')[3];
        if (!slug) {
          return new Response('Post slug required', { status: 400 });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              p.*,
              i.b2_url as featured_image_url,
              i.alt_text as featured_image_alt,
              i.width as featured_image_width,
              i.height as featured_image_height
            FROM posts p
            LEFT JOIN images i ON p.featured_image_id = i.id
            WHERE p.slug = ? AND p.published = 1
          `).bind(slug).all();
          
          if (results.length === 0) {
            return new Response('Post not found', { status: 404 });
          }
          
          const post = results[0];
          
          // Get gallery images for this post
          const { results: images } = await env.DB.prepare(`
            SELECT i.*, pi.sort_order 
            FROM images i
            JOIN post_images pi ON i.id = pi.image_id
            WHERE pi.post_id = ? AND i.id != COALESCE(?, 0)
            ORDER BY pi.sort_order
          `).bind(post.id, post.featured_image_id).all();
          
          return new Response(JSON.stringify({ ...post, images }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching post:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get about page
      if (pathname === '/api/about' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
            SELECT 
              a.*,
              i.b2_url as profile_image_url,
              i.alt_text as profile_image_alt
            FROM about_page a
            LEFT JOIN images i ON a.profile_image_id = i.id
            ORDER BY a.id DESC
            LIMIT 1
          `).all();
          
          if (results.length === 0) {
            return new Response('About page not found', { status: 404 });
          }
          
          return new Response(JSON.stringify(results[0]), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching about page:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch about page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get gallery images for homepage
      if (pathname === '/api/gallery' && request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare(`
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
          
          return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching gallery:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // API: Get EXIF data for an image
      if (pathname.startsWith('/api/images/') && pathname.endsWith('/exif') && request.method === 'GET') {
        const imageId = pathname.split('/')[3];
        if (!imageId) {
          return new Response('Image ID required', { status: 400 });
        }
        
        try {
          const { results } = await env.DB.prepare(`
            SELECT * FROM image_exif WHERE image_id = ?
          `).bind(imageId).all();
          
          if (results.length === 0) {
            return new Response('EXIF data not found', { status: 404 });
          }
          
          const exifData = results[0];
          
          // Parse raw EXIF if needed
          if (exifData.raw_exif) {
            try {
              exifData.raw_exif_parsed = JSON.parse(exifData.raw_exif);
            } catch (e) {
              // Keep as string if parsing fails
            }
          }
          
          return new Response(JSON.stringify(exifData), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching EXIF data:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch EXIF data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Serve individual post pages
      if (pathname.startsWith('/post/')) {
        return new Response(postPageHTML, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // Serve about page
      if (pathname === '/about') {
        return new Response(aboutPageHTML, {
          headers: { 'Content-Type': 'text/html' }
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