import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { getDatabase, initDatabase } from '../src/database.js';
import { extractExifData } from '../src/exif.js';
import sharp from 'sharp';
import path from 'path';
import B2 from 'backblaze-b2';

// Initialize database
await initDatabase();
const db = getDatabase();

// Initialize B2 with exact .env credentials
const b2 = new B2({
    applicationKeyId: '001ed8b9e4334cf000000001d',
    applicationKey: 'K001xupBl2zRMXfUsKujwCs/0sA5dkk'
});
const bucketId = '2eede8aba95e44a373e40c1f';
const bucketName = 'webstaticfiles';

console.log('🔍 Importing missing post images from Squarespace XML...');

// Read and parse XML
const xmlPath = '/Users/jonsson/dev/private/jonsson.io/temp/Squarespace-Wordpress-Export-07-30-2025.xml';
const xmlContent = fs.readFileSync(xmlPath, 'utf8');

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    cdataPropName: '#cdata'
});

const xmlData = parser.parse(xmlContent);
const items = xmlData.rss.channel.item;

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
async function processImage(imageUrl, postDate, originalFilename) {
    try {
        console.log(`  Downloading: ${originalFilename}`);
        
        // Download image
        const buffer = await downloadImage(imageUrl);
        
        // Get image metadata
        const metadata = await sharp(buffer).metadata();
        const width = metadata.width;
        const height = metadata.height;
        
        // Generate organized filename
        const year = postDate.getFullYear();
        const month = String(postDate.getMonth() + 1).padStart(2, '0');
        const ext = path.extname(originalFilename);
        const baseName = path.basename(originalFilename, ext);
        const organizedFilename = `blog/images/${year}/${month}/${baseName}${ext}`;
        
        // Upload to B2
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
        
        // Extract EXIF data
        let exifData = null;
        try {
            exifData = await extractExifData(buffer);
        } catch (exifError) {
            console.log(`    No EXIF data for ${originalFilename}`);
        }
        
        // Save to database
        const result = db.prepare(`
            INSERT INTO images (filename, original_filename, alt_text, caption, b2_file_id, b2_url, width, height, file_size, mime_type, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            organizedFilename,
            originalFilename,
            '',
            '',
            uploadResponse.data.fileId,
            publicUrl,
            width,
            height,
            buffer.length,
            metadata.format === 'jpeg' ? 'image/jpeg' : `image/${metadata.format}`,
            postDate.toISOString()
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
        
        console.log(`    ✅ Uploaded: ${organizedFilename}`);
        return { imageId, url: publicUrl, originalUrl: imageUrl };
        
    } catch (error) {
        console.error(`    ❌ Error processing ${originalFilename}:`, error.message);
        return null;
    }
}

// Posts to process
const postsToProcess = [
    {
        title: 'Jersey City Marathon 2024',
        dbId: 4,
        images: [
            'HM0A7522.jpg', 'HM0A7539.jpg', 'HM0A7561.jpg', 'HM0A7588.jpg',
            'HM0A7596.jpg', 'HM0A7622.jpg', 'HM0A7648.jpg', 'HM0A7668.jpg', 'HM0A7700.jpg'
        ]
    },
    {
        title: 'Full Moon Over Manhattan',
        dbId: 3,
        images: [
            'HM0A7092-Enhanced-NR.jpg', 'HM0A7093-Enhanced-NR.jpg', 
            'HM0A7094-Enhanced-NR.jpg', 'HM0A7095-Enhanced-NR.jpg'
        ]
    },
    {
        title: 'Liberty State Park',
        dbId: 5,
        images: [
            '5-HM0A7172.jpg', '4-HM0A7178.jpg', '3-HM0A7184.jpg',
            '2-HM0A7198.jpg', '1-HM0A7202.jpg'
        ]
    }
];

// Find the posts in XML and extract image URLs
console.log('📋 Processing posts:');
let totalImported = 0;
let firstImageIds = {}; // Track first image of each post for featured image

for (const postInfo of postsToProcess) {
    console.log(`\n🔍 Processing: ${postInfo.title}`);
    
    // Find post in XML
    const xmlPost = items.find(item => 
        item.title === postInfo.title && item['wp:post_type'] === 'post'
    );
    
    if (!xmlPost) {
        console.log(`  ❌ Post not found in XML`);
        continue;
    }
    
    const postDate = new Date(xmlPost['wp:post_date']);
    console.log(`  📅 Post date: ${postDate.toLocaleDateString()}`);
    
    // Get current post from database
    const dbPost = db.prepare('SELECT id, content FROM posts WHERE id = ?').get(postInfo.dbId);
    if (!dbPost) {
        console.log(`  ❌ Post not found in database`);
        continue;
    }
    
    // Extract all Squarespace image URLs from XML content
    const content = xmlPost['content:encoded']['#cdata'] || xmlPost['content:encoded'] || '';
    const imageRegex = /https:\/\/images\.squarespace-cdn\.com\/[^"'\s]+\.(?:jpg|jpeg|png|gif)/gi;
    const imageUrls = content.match(imageRegex) || [];
    
    console.log(`  Found ${imageUrls.length} image URLs in XML content`);
    
    if (imageUrls.length === 0) {
        console.log(`  ⚠️  No images found in XML content`);
        continue;
    }
    
    let postImages = [];
    let firstImageId = null;
    
    // Process each image
    for (const imageUrl of imageUrls) {
        // Extract filename from URL
        const urlParts = imageUrl.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const originalFilename = lastPart.split('?')[0]; // Remove query parameters
        
        const imageResult = await processImage(imageUrl, postDate, originalFilename);
        
        if (imageResult) {
            postImages.push(imageResult);
            totalImported++;
            
            // Track first image for featured image
            if (!firstImageId) {
                firstImageId = imageResult.imageId;
            }
        }
    }
    
    if (postImages.length > 0) {
        // Update post content with new image URLs
        let updatedContent = dbPost.content;
        let hasChanges = false;
        
        // If content is mostly empty, create a simple gallery
        if (dbPost.content.trim().length < 200) {
            const imageHtml = postImages.map(img => 
                `<img src="${img.url}" alt="" loading="lazy">`
            ).join('\n');
            updatedContent = `${dbPost.content}\n<div class="image-gallery">\n${imageHtml}\n</div>`;
            hasChanges = true;
        }
        
        // Update database
        if (hasChanges) {
            db.prepare(`
                UPDATE posts 
                SET content = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `).run(updatedContent, postInfo.dbId);
            console.log(`  📝 Updated post content with ${postImages.length} images`);
        }
        
        // Set featured image to first imported image
        if (firstImageId) {
            db.prepare(`
                UPDATE posts 
                SET featured_image_id = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `).run(firstImageId, postInfo.dbId);
            console.log(`  🖼️  Set featured image: ${postImages[0].originalUrl.split('/').pop()}`);
            firstImageIds[postInfo.title] = firstImageId;
        }
    }
}

console.log(`\n🎉 Import complete!`);
console.log(`📊 Total images imported: ${totalImported}`);

// Show final status
console.log(`\n📋 Final post status:`);
const finalPosts = db.prepare(`
    SELECT 
        p.id,
        p.title,
        p.featured_image_id,
        i.original_filename as featured_image_name,
        (SELECT COUNT(*) FROM images WHERE content LIKE '%' || b2_url || '%') as image_count
    FROM posts p
    LEFT JOIN images i ON p.featured_image_id = i.id
    WHERE p.id > 2
    ORDER BY p.title
`).all();

finalPosts.forEach(post => {
    const featuredStatus = post.featured_image_id ? `✅ ${post.featured_image_name}` : '❌ No featured image';
    console.log(`  - ${post.title}: ${featuredStatus}`);
});