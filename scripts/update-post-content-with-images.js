import { getDatabase, initDatabase } from '../src/database.js';

// Initialize database
await initDatabase();
const db = getDatabase();

console.log('📝 Updating post content with imported images...');

// Posts that need image content added
const postsToUpdate = [
    {
        title: 'Jersey City Marathon 2024',
        id: 4,
        description: 'Marathon photography with Canon 50mm and 24-105mm lenses'
    },
    {
        title: 'Full Moon Over Manhattan',
        id: 3, 
        description: 'Full moon photography over Manhattan skyline'
    },
    {
        title: 'Liberty State Park',
        id: 5,
        description: 'Early morning dog walk photography with Canon EF 50mm 1.8'
    }
];

for (const postInfo of postsToUpdate) {
    console.log(`\n🔍 Processing: ${postInfo.title}`);
    
    // Get current post
    const post = db.prepare('SELECT id, content FROM posts WHERE id = ?').get(postInfo.id);
    if (!post) {
        console.log(`  ❌ Post not found`);
        continue;
    }
    
    // Find images that belong to this post (by date and pattern)
    const postDate = new Date(postInfo.id === 4 ? '2024-04-14' : postInfo.id === 3 ? '2023-08-26' : '2023-08-24');
    const year = postDate.getFullYear();
    const month = String(postDate.getMonth() + 1).padStart(2, '0');
    
    const images = db.prepare(`
        SELECT id, original_filename, b2_url, width, height
        FROM images 
        WHERE filename LIKE ? 
        AND created_at LIKE ?
        ORDER BY original_filename
    `).all(`blog/images/${year}/${month}/%`, `${year}-%`);
    
    console.log(`  Found ${images.length} images for this post`);
    
    if (images.length === 0) {
        continue;
    }
    
    // Create image gallery HTML
    const imageGalleryHtml = images.map(img => {
        return `<img src="${img.b2_url}" alt="" loading="lazy" style="max-width: 100%; height: auto; margin: 1rem 0;">`;
    }).join('\n');
    
    // Update post content
    const newContent = `${post.content}
    
<div class="post-images">
${imageGalleryHtml}
</div>`;
    
    db.prepare(`
        UPDATE posts 
        SET content = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `).run(newContent, postInfo.id);
    
    console.log(`  ✅ Added ${images.length} images to post content`);
}

console.log(`\n🎉 Post content update complete!`);

// Show final content status
console.log(`\n📊 Final content status:`);
const finalPosts = db.prepare(`
    SELECT id, title, LENGTH(content) as content_length
    FROM posts 
    WHERE id > 2
    ORDER BY title
`).all();

finalPosts.forEach(post => {
    console.log(`  - ${post.title}: ${post.content_length} characters`);
});