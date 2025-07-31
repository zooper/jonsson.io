import { getDatabase, initDatabase } from '../src/database.js';
import B2 from 'backblaze-b2';

// Initialize database
await initDatabase();
const db = getDatabase();

// Initialize B2 with exact .env credentials
const b2 = new B2({
    applicationKeyId: '001ed8b9e4334cf000000001d',
    applicationKey: 'K001xupBl2zRMXfUsKujwCs/0sA5dkk'
});

console.log('🗑️  Removing remaining moment post "2024-06"...');

const post = db.prepare(`SELECT id, title, content FROM posts WHERE title = '2024-06'`).get();

if (!post) {
    console.log('Post not found. Already deleted?');
    process.exit(0);
}

await b2.authorize();

// Extract image URLs from post content
const imageRegex = /<img[^>]+src="([^"]*webstaticfiles[^"]*)"/g;
const imageMatches = [...post.content.matchAll(imageRegex)];

console.log(`Found ${imageMatches.length} images to delete:`);

for (const match of imageMatches) {
    const imageUrl = match[1];
    console.log(`  Deleting: ${imageUrl}`);
    
    try {
        // Extract filename from URL
        const urlParts = new URL(imageUrl);
        const filename = urlParts.pathname.substring(1); // Remove leading slash
        
        // Find image in database
        const image = db.prepare(`
            SELECT id, b2_file_id, filename 
            FROM images 
            WHERE b2_url = ? OR filename = ?
        `).get(imageUrl, filename);
        
        if (image) {
            // Delete from B2
            try {
                await b2.deleteFileVersion({
                    fileId: image.b2_file_id,
                    fileName: image.filename
                });
                console.log(`    ✅ Deleted from B2`);
            } catch (b2Error) {
                console.log(`    ⚠️  B2 deletion failed: ${b2Error.message}`);
            }
            
            // Delete EXIF data
            db.prepare('DELETE FROM image_exif WHERE image_id = ?').run(image.id);
            
            // Delete from images table
            db.prepare('DELETE FROM images WHERE id = ?').run(image.id);
            
            console.log(`    ✅ Deleted from database`);
        } else {
            console.log(`    ⚠️  Image not found in database`);
        }
    } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
    }
}

// Delete the post
db.prepare('DELETE FROM posts WHERE id = ?').run(post.id);
console.log(`✅ Deleted post: "${post.title}"`);

console.log('\n🎉 Complete! Final remaining imported posts:');
const remainingPosts = db.prepare(`
    SELECT id, title, created_at 
    FROM posts 
    WHERE id > 2 
    ORDER BY created_at DESC
`).all();

remainingPosts.forEach(post => {
    const date = new Date(post.created_at).toLocaleDateString();
    console.log(`  - ${post.title} (${date})`);
});