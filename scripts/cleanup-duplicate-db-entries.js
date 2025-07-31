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

console.log('🧹 Cleaning up duplicate image entries...');

// Find all duplicate image entries
const duplicates = db.prepare(`
    SELECT original_filename, COUNT(*) as count
    FROM images 
    GROUP BY original_filename 
    HAVING count > 1
    ORDER BY count DESC
`).all();

console.log(`Found ${duplicates.length} duplicate image sets:`);

await b2.authorize();
let deletedImages = 0;

for (const duplicate of duplicates) {
    console.log(`\n🔍 Processing: ${duplicate.original_filename} (${duplicate.count} copies)`);
    
    // Get all instances of this image, ordered by creation date (keep newest)
    const instances = db.prepare(`
        SELECT id, b2_file_id, filename, b2_url, created_at
        FROM images 
        WHERE original_filename = ?
        ORDER BY created_at DESC
    `).all(duplicate.original_filename);
    
    // Keep the first (newest) one, delete the rest
    const toKeep = instances[0];
    const toDelete = instances.slice(1);
    
    console.log(`  ✅ Keeping: ${toKeep.filename} (created ${toKeep.created_at})`);
    
    for (const imageToDelete of toDelete) {
        console.log(`  🗑️  Deleting: ${imageToDelete.filename} (created ${imageToDelete.created_at})`);
        
        // Check if this image is used as featured image anywhere
        const usedAsFeatured = db.prepare(`
            SELECT id, title FROM posts WHERE featured_image_id = ?
        `).get(imageToDelete.id);
        
        if (usedAsFeatured) {
            // Update the post to use the kept image instead
            db.prepare(`
                UPDATE posts SET featured_image_id = ? WHERE featured_image_id = ?
            `).run(toKeep.id, imageToDelete.id);
            console.log(`    🔄 Updated featured image reference in "${usedAsFeatured.title}"`);
        }
        
        // Delete from B2
        try {
            await b2.deleteFileVersion({
                fileId: imageToDelete.b2_file_id,
                fileName: imageToDelete.filename
            });
            console.log(`    ✅ Deleted from B2: ${imageToDelete.filename}`);
        } catch (b2Error) {
            console.log(`    ⚠️  B2 deletion failed: ${b2Error.message}`);
        }
        
        // Delete EXIF data
        db.prepare('DELETE FROM image_exif WHERE image_id = ?').run(imageToDelete.id);
        
        // Delete from images table
        db.prepare('DELETE FROM images WHERE id = ?').run(imageToDelete.id);
        
        deletedImages++;
        console.log(`    ✅ Deleted from database`);
    }
}

console.log(`\n🎉 Cleanup complete!`);
console.log(`🗑️  Deleted ${deletedImages} duplicate image entries`);

// Verify no more duplicates
const remainingDuplicates = db.prepare(`
    SELECT original_filename, COUNT(*) as count
    FROM images 
    GROUP BY original_filename 
    HAVING count > 1
`).all();

if (remainingDuplicates.length === 0) {
    console.log(`✅ No duplicate entries remaining`);
} else {
    console.log(`⚠️  ${remainingDuplicates.length} duplicate sets still remain`);
}

// Show final image count
const totalImages = db.prepare('SELECT COUNT(*) as count FROM images').get();
console.log(`📊 Total images in database: ${totalImages.count}`);