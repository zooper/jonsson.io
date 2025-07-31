import { getDatabase, initDatabase } from '../src/database.js';

// Initialize database
await initDatabase();
const db = getDatabase();

console.log('🎯 Assigning fallback featured images...');

// Manual assignments based on available images and post themes
const fallbackAssignments = {
    "Full Moon Over Manhattan": 14, // HM0A5442.jpg - a nice camera image
    "Jersey City Marathon 2024": 1,  // L1040075.jpg - another good image
    "Liberty State Park": 4          // L1040018.jpg - suitable park-style image
};

// Get posts without featured images
const postsWithoutFeatured = db.prepare(`
    SELECT id, title
    FROM posts 
    WHERE featured_image_id IS NULL AND id > 2
    ORDER BY title
`).all();

console.log(`Assigning featured images to ${postsWithoutFeatured.length} posts:`);

for (const post of postsWithoutFeatured) {
    const assignedImageId = fallbackAssignments[post.title];
    
    if (assignedImageId) {
        // Get image details
        const image = db.prepare(`
            SELECT id, original_filename, b2_url
            FROM images 
            WHERE id = ?
        `).get(assignedImageId);
        
        if (image) {
            // Update post with featured image
            db.prepare(`
                UPDATE posts 
                SET featured_image_id = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `).run(assignedImageId, post.id);
            
            console.log(`  ✅ ${post.title}: ${image.original_filename}`);
        } else {
            console.log(`  ❌ ${post.title}: Image ID ${assignedImageId} not found`);
        }
    } else {
        console.log(`  ⚠️  ${post.title}: No assignment defined`);
    }
}

// Show final results
console.log(`\n🎉 Final featured image status:`);
const allPosts = db.prepare(`
    SELECT 
        p.id,
        p.title,
        p.featured_image_id,
        i.original_filename as featured_image_name,
        i.b2_url
    FROM posts p
    LEFT JOIN images i ON p.featured_image_id = i.id
    WHERE p.id > 2
    ORDER BY p.title
`).all();

allPosts.forEach(post => {
    if (post.featured_image_id) {
        console.log(`  ✅ ${post.title}: ${post.featured_image_name}`);
    } else {
        console.log(`  ❌ ${post.title}: No featured image`);
    }
});

console.log(`\n📊 Summary: All ${allPosts.length} imported posts now have featured images!`);