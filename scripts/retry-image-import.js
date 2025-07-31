import https from 'https';
import http from 'http';
import { getDatabase, initDatabase } from '../src/database.js';
import { extractExifData } from '../src/exif.js';
import sharp from 'sharp';
import path from 'path';
import B2 from 'backblaze-b2';
import crypto from 'crypto';

// Initialize B2 with exact .env credentials
const b2 = new B2({
    applicationKeyId: '001ed8b9e4334cf000000001d',
    applicationKey: 'K001xupBl2zRMXfUsKujwCs/0sA5dkk'
});
const bucketId = '2eede8aba95e44a373e40c1f';
const bucketName = 'webstaticfiles';

// Initialize database
await initDatabase();
const db = getDatabase();

// Helper function to download image
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

// Process and upload an image
async function processImage(imageUrl, uploadDate) {
    try {
        console.log(`Downloading image: ${imageUrl}`);
        
        // Download image
        const buffer = await downloadImage(imageUrl);
        
        // Get image metadata
        const metadata = await sharp(buffer).metadata();
        const width = metadata.width;
        const height = metadata.height;
        
        // Extract filename from URL
        const urlPath = new URL(imageUrl).pathname;
        const originalFilename = path.basename(urlPath);
        
        // Generate organized filename
        const year = uploadDate.getFullYear();
        const month = String(uploadDate.getMonth() + 1).padStart(2, '0');
        const ext = path.extname(originalFilename);
        const baseName = path.basename(originalFilename, ext);
        const organizedFilename = `blog/images/${year}/${month}/${baseName}${ext}`;
        
        console.log(`Uploading to: ${organizedFilename}`);
        
        // Upload to B2 directly with .env credentials
        await b2.authorize();
        
        const uploadUrl = await b2.getUploadUrl({ bucketId });
        
        const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadUrl.data.uploadUrl,
            uploadAuthToken: uploadUrl.data.authorizationToken,
            fileName: organizedFilename,
            data: buffer,
            mime: metadata.format === 'jpeg' ? 'image/jpeg' : `image/${metadata.format}`,
            info: {
                originalName: originalFilename
            }
        });
        
        const publicUrl = `https://${bucketName}.s3.us-west-001.backblazeb2.com/${organizedFilename}`;
        
        const uploadResult = {
            fileId: uploadResponse.data.fileId,
            filename: organizedFilename,
            url: publicUrl
        };
        
        // Extract EXIF data
        let exifData = null;
        try {
            exifData = await extractExifData(buffer);
        } catch (exifError) {
            console.log(`No EXIF data for ${originalFilename}`);
        }
        
        // Save to database
        const result = db.prepare(`
            INSERT INTO images (filename, original_filename, alt_text, caption, b2_file_id, b2_url, width, height, file_size, mime_type, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            uploadResult.filename,
            originalFilename,
            '',
            '',
            uploadResult.fileId,
            uploadResult.url,
            width,
            height,
            buffer.length,
            metadata.format === 'jpeg' ? 'image/jpeg' : `image/${metadata.format}`,
            uploadDate.toISOString()
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
                console.error('Error saving EXIF data:', exifError);
            }
        }
        
        return { imageId, url: uploadResult.url, originalUrl: imageUrl };
        
    } catch (error) {
        console.error(`Error processing image ${imageUrl}:`, error);
        return null;
    }
}

async function retryImageImport() {
    console.log('🔄 Starting image import retry...');
    
    // Get all posts that might have images in their content
    const posts = db.prepare(`
        SELECT id, title, content, created_at 
        FROM posts 
        WHERE content LIKE '%squarespace-cdn.com%'
        ORDER BY created_at DESC
    `).all();
    
    console.log(`Found ${posts.length} posts with potential Squarespace images`);
    
    let totalProcessed = 0;
    let successfulImages = 0;
    
    for (const post of posts) {
        console.log(`\nProcessing post: "${post.title}"`);
        
        // Extract image URLs from content
        const imageRegex = /<img[^>]+src="([^"]*squarespace-cdn\.com[^"]*)"[^>]*>/g;
        const matches = [...post.content.matchAll(imageRegex)];
        
        if (matches.length === 0) {
            console.log('  No Squarespace images found');
            continue;
        }
        
        console.log(`  Found ${matches.length} images to process`);
        
        let updatedContent = post.content;
        const postDate = new Date(post.created_at);
        
        for (const match of matches) {
            const originalUrl = match[1];
            
            // Clean up the URL (remove format parameters)
            const cleanUrl = originalUrl.replace(/\?format=original$/, '').replace(/\?format=\d+w$/, '');
            
            totalProcessed++;
            const imageResult = await processImage(cleanUrl, postDate);
            
            if (imageResult) {
                successfulImages++;
                console.log(`    ✅ Processed: ${path.basename(cleanUrl)}`);
                
                // Update content with new URL
                updatedContent = updatedContent.replace(
                    new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    imageResult.url
                );
            } else {
                console.log(`    ❌ Failed: ${path.basename(cleanUrl)}`);
            }
        }
        
        // Update post content with new image URLs
        if (updatedContent !== post.content) {
            db.prepare(`
                UPDATE posts 
                SET content = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `).run(updatedContent, post.id);
            console.log(`  📝 Updated post content with new image URLs`);
        }
    }
    
    console.log(`\n🎉 Image import retry complete!`);
    console.log(`📊 Processed ${totalProcessed} images`);
    console.log(`✅ Successfully imported: ${successfulImages}`);
    console.log(`❌ Failed: ${totalProcessed - successfulImages}`);
}

// Run the retry
console.log('🚀 Starting image import retry...');
retryImageImport().catch(console.error);