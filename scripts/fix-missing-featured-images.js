import { getDatabase, initDatabase } from '../src/database.js';

// Initialize database
await initDatabase();
const db = getDatabase();

console.log('🔧 Fixing missing featured images...');

// Get posts without featured images
const postsWithoutFeatured = db.prepare(`
    SELECT id, title, created_at, content
    FROM posts 
    WHERE featured_image_id IS NULL AND id > 2
    ORDER BY title
`).all();

console.log(`Found ${postsWithoutFeatured.length} posts without featured images:`);

// Manual mapping based on post titles and likely image matches
const manualImageMapping = {
    "Full Moon Over Manhattan": "HM0A7094", // Moon photo filename pattern
    "Jersey City Marathon 2024": "HM0A77", // Marathon photos likely HM0A77xx series
    "Liberty State Park": "HM0A71" // Liberty State Park photos likely HM0A71xx series
};

for (const post of postsWithoutFeatured) {
    console.log(`\nProcessing: "${post.title}"`);
    console.log(`  Post date: ${new Date(post.created_at).toLocaleDateString()}`);
    
    const searchPattern = manualImageMapping[post.title];
    
    if (searchPattern) {
        // Search for images matching the pattern
        const candidates = db.prepare(`
            SELECT id, original_filename, filename, b2_url, created_at
            FROM images 
            WHERE (original_filename LIKE ? OR filename LIKE ?)
            ORDER BY created_at ASC
            LIMIT 5
        `).all(`%${searchPattern}%`, `%${searchPattern}%`);
        
        if (candidates.length > 0) {
            console.log(`  Found ${candidates.length} candidate images:`);
            candidates.forEach((img, idx) => {
                const imgDate = new Date(img.created_at).toLocaleDateString();
                console.log(`    ${idx + 1}. ${img.original_filename} (${imgDate})`);
            });
            
            // Use the first candidate as featured image
            const selectedImage = candidates[0];
            
            db.prepare(`
                UPDATE posts 
                SET featured_image_id = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `).run(selectedImage.id, post.id);
            
            console.log(`  ✅ Set featured image: ${selectedImage.original_filename}`);
        } else {
            console.log(`  ❌ No images found matching pattern: ${searchPattern}`);
        }
    } else {
        console.log(`  ⚠️  No manual mapping defined for this post`);
    }
}

// Alternative: Show all available images around the post dates for manual review
console.log(`\n📊 Available images by date for reference:`);
const allImages = db.prepare(`
    SELECT id, original_filename, created_at
    FROM images 
    WHERE original_filename NOT LIKE '%IMG_%'
    ORDER BY created_at DESC
    LIMIT 20
`).all();

allImages.forEach(img => {
    const imgDate = new Date(img.created_at).toLocaleDateString();
    console.log(`  ${img.original_filename} (${imgDate})`);
});

// Show final results
console.log(`\n📊 Final featured image status:`);
const allPosts = db.prepare(`
    SELECT 
        p.id,
        p.title,
        p.featured_image_id,
        i.original_filename as featured_image_name
    FROM posts p
    LEFT JOIN images i ON p.featured_image_id = i.id
    WHERE p.id > 2
    ORDER BY p.title
`).all();

allPosts.forEach(post => {
    const status = post.featured_image_id ? `✅ ${post.featured_image_name}` : '❌ No featured image';
    console.log(`  - ${post.title}: ${status}`);
});