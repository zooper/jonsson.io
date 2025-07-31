import { getDatabase, initDatabase } from '../src/database.js';

// Initialize database
await initDatabase();
const db = getDatabase();

console.log('🖼️  Setting featured images for imported posts...');

// Featured image mapping from XML analysis
const featuredImageMapping = {
    "Full Moon Over Manhattan": "HM0A7094-Enhanced-NR.jpg",
    "Jersey City Marathon 2024": "HM0A7700.jpg", 
    "Liberty State Park": "5-HM0A7172.jpg",
    "Little Island": "HM0A6922.jpg",
    "One year with the FujiFilm X-T30 II": "DSCF2401.jpg",
    "Play ball": "HM0A7022.jpg"
};

// Get all remaining imported posts
const posts = db.prepare(`
    SELECT id, title, content 
    FROM posts 
    WHERE id > 2 
    ORDER BY title
`).all();

console.log(`Found ${posts.length} posts to process:`);

let updatedPosts = 0;
let fallbackPosts = 0;

for (const post of posts) {
    console.log(`\nProcessing: "${post.title}"`);
    
    let featuredImageId = null;
    
    // Check if we have a featured image from XML
    const expectedFilename = featuredImageMapping[post.title];
    
    if (expectedFilename) {
        // Try to find the image by original filename
        const image = db.prepare(`
            SELECT id, filename, original_filename, b2_url
            FROM images 
            WHERE original_filename LIKE ? OR filename LIKE ?
            LIMIT 1
        `).get(`%${expectedFilename}%`, `%${expectedFilename}%`);
        
        if (image) {
            featuredImageId = image.id;
            console.log(`  ✅ Found XML featured image: ${image.original_filename}`);
        } else {
            console.log(`  ⚠️  XML featured image not found: ${expectedFilename}`);
        }
    }
    
    // If no XML featured image found, use first image from post content
    if (!featuredImageId) {
        console.log(`  🔍 Looking for first image in post content...`);
        
        // Extract first image URL from content
        const imageRegex = /<img[^>]+src="([^"]*webstaticfiles[^"]*)"/;
        const match = post.content.match(imageRegex);
        
        if (match) {
            const imageUrl = match[1];
            console.log(`  Found image URL: ${imageUrl}`);
            
            // Find image in database by URL
            const image = db.prepare(`
                SELECT id, filename, original_filename
                FROM images 
                WHERE b2_url = ?
                LIMIT 1
            `).get(imageUrl);
            
            if (image) {
                featuredImageId = image.id;
                console.log(`  ✅ Using first image as featured: ${image.original_filename}`);
                fallbackPosts++;
            }
        }
    }
    
    // Update post with featured image
    if (featuredImageId) {
        db.prepare(`
            UPDATE posts 
            SET featured_image_id = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).run(featuredImageId, post.id);
        
        updatedPosts++;
        console.log(`  ✅ Updated post with featured image ID: ${featuredImageId}`);
    } else {
        console.log(`  ❌ No suitable featured image found`);
    }
}

console.log(`\n🎉 Featured image setup complete!`);
console.log(`📝 Posts updated: ${updatedPosts}`);
console.log(`🖼️  XML featured images: ${updatedPosts - fallbackPosts}`);
console.log(`🔄 Fallback to first image: ${fallbackPosts}`);

// Show final results
console.log(`\n📊 Final post status:`);
const finalPosts = db.prepare(`
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

finalPosts.forEach(post => {
    const status = post.featured_image_id ? `✅ ${post.featured_image_name}` : '❌ No featured image';
    console.log(`  - ${post.title}: ${status}`);
});