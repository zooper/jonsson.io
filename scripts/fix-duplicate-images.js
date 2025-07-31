import { getDatabase, initDatabase } from '../src/database.js';

// Initialize database
await initDatabase();
const db = getDatabase();

console.log('🔧 Fixing duplicate and incorrect images in posts...');

// First, let's see what images each post should have based on the import we did
const correctImageMappings = {
    3: { // Full Moon Over Manhattan
        title: 'Full Moon Over Manhattan',
        correctImages: [
            'HM0A7092-Enhanced-NR.jpg',
            'HM0A7093-Enhanced-NR.jpg', 
            'HM0A7094-Enhanced-NR.jpg',
            'HM0A7095-Enhanced-NR.jpg',
            'HM0A7096-Enhanced-NR.jpg',
            'HM0A7097-Enhanced-NR.jpg'
        ]
    },
    5: { // Liberty State Park
        title: 'Liberty State Park',
        correctImages: [
            '5-HM0A7172.jpg',
            '4-HM0A7178.jpg',
            '3-HM0A7184.jpg',
            '2-HM0A7198.jpg',
            '1-HM0A7202.jpg'
        ]
    },
    4: { // Jersey City Marathon 2024
        title: 'Jersey City Marathon 2024',
        correctImages: [
            'HM0A7522.jpg',
            'HM0A7539.jpg',
            'HM0A7561.jpg',
            'HM0A7588.jpg',
            'HM0A7596.jpg',
            'HM0A7622.jpg',
            'HM0A7648.jpg',
            'HM0A7668.jpg',
            'HM0A7700.jpg'
        ]
    }
};

for (const [postId, postInfo] of Object.entries(correctImageMappings)) {
    console.log(`\n🔍 Fixing: ${postInfo.title}`);
    
    // Get current post
    const post = db.prepare('SELECT id, content FROM posts WHERE id = ?').get(parseInt(postId));
    if (!post) {
        console.log(`  ❌ Post not found`);
        continue;
    }
    
    // Find the correct images for this post
    const correctImages = [];
    for (const filename of postInfo.correctImages) {
        const image = db.prepare(`
            SELECT id, original_filename, b2_url
            FROM images 
            WHERE original_filename = ?
            LIMIT 1
        `).get(filename);
        
        if (image) {
            correctImages.push(image);
        } else {
            console.log(`  ⚠️  Image not found: ${filename}`);
        }
    }
    
    console.log(`  Found ${correctImages.length} correct images`);
    
    if (correctImages.length === 0) {
        continue;
    }
    
    // Get the original text content (before the <div class="post-images"> section)
    const originalContent = post.content.split('<div class="post-images">')[0].trim();
    
    // Create new image gallery HTML with correct images
    const imageGalleryHtml = correctImages.map(img => {
        return `<img src="${img.b2_url}" alt="" loading="lazy" style="max-width: 100%; height: auto; margin: 1rem 0;">`;
    }).join('\n');
    
    // Create clean content with correct images
    const newContent = `${originalContent}
    
<div class="post-images">
${imageGalleryHtml}
</div>`;
    
    // Update post content
    db.prepare(`
        UPDATE posts 
        SET content = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `).run(newContent, parseInt(postId));
    
    // Set featured image to first correct image
    if (correctImages.length > 0) {
        db.prepare(`
            UPDATE posts 
            SET featured_image_id = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).run(correctImages[0].id, parseInt(postId));
        
        console.log(`  ✅ Updated with ${correctImages.length} correct images`);
        console.log(`  🖼️  Set featured image: ${correctImages[0].original_filename}`);
    }
}

console.log(`\n🎉 Image correction complete!`);

// Show final status
console.log(`\n📊 Final post status:`);
const finalPosts = db.prepare(`
    SELECT 
        p.id,
        p.title,
        p.featured_image_id,
        i.original_filename as featured_image_name,
        LENGTH(p.content) as content_length
    FROM posts p
    LEFT JOIN images i ON p.featured_image_id = i.id
    WHERE p.id > 2
    ORDER BY p.title
`).all();

finalPosts.forEach(post => {
    const featuredStatus = post.featured_image_id ? `${post.featured_image_name}` : 'No featured image';
    console.log(`  - ${post.title}: ${featuredStatus} (${post.content_length} chars)`);
});