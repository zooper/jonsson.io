import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { getDatabase, initDatabase } from '../src/database.js';
import { uploadImageToB2, initB2 } from '../src/storage.js';
import { extractExifData } from '../src/exif.js';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// Helper function to clean and format content
function cleanContent(content) {
    if (!content) return '';
    
    // Remove CDATA wrapper
    content = content.replace(/^\s*<!\[CDATA\[(.*)\]\]>\s*$/s, '$1');
    
    // Convert to simple HTML - remove complex Squarespace markup
    content = content.replace(/<article[^>]*>/g, '');
    content = content.replace(/<\/article>/g, '');
    content = content.replace(/<section[^>]*>/g, '<div>');
    content = content.replace(/<\/section>/g, '</div>');
    content = content.replace(/<div[^>]*class="[^"]*gallery[^"]*"[^>]*>.*?<\/div>/gs, '');
    
    // Clean up images - convert to simple img tags and collect URLs
    const imageUrls = [];
    content = content.replace(/<img[^>]*src="([^"]+)"[^>]*>/g, (match, src) => {
        // Convert Squarespace URLs to original format
        let cleanSrc = src.replace(/\?format=original$/, '');
        cleanSrc = cleanSrc.replace(/\?format=\d+w$/, '');
        imageUrls.push(cleanSrc);
        return `<img src="${cleanSrc}" alt="">`;
    });
    
    // Remove empty divs and clean up
    content = content.replace(/<div[^>]*>\s*<\/div>/g, '');
    content = content.replace(/\s+/g, ' ').trim();
    
    return { content, imageUrls };
}

// Create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
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
        
        // Upload to B2
        const uploadResult = await uploadImageToB2(
            buffer,
            organizedFilename,
            metadata.format === 'jpeg' ? 'image/jpeg' : `image/${metadata.format}`
        );
        
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
        
        return { imageId, url: uploadResult.url };
        
    } catch (error) {
        console.error(`Error processing image ${imageUrl}:`, error);
        return null;
    }
}

async function importSquarespaceXML() {
    const xmlPath = path.join(__dirname, '../temp/Squarespace-Wordpress-Export-07-30-2025.xml');
    
    if (!fs.existsSync(xmlPath)) {
        console.error('XML file not found at:', xmlPath);
        return;
    }
    
    console.log('Reading XML file...');
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    
    // Parse XML
    const parser = new XMLParser({
        ignoreAttributes: false,
        parseAttributeValue: true,
        parseTagValue: true,
        trimValues: true
    });
    
    const xmlData = parser.parse(xmlContent);
    const items = xmlData.rss.channel.item;
    
    console.log(`Found ${items.length} items in XML`);
    
    let importedPosts = 0;
    let skippedItems = 0;
    let imageMap = new Map(); // Map original URLs to new image IDs
    
    // Filter to only blog posts (not pages or attachments)
    const posts = items.filter(item => {
        const postType = item['wp:post_type'];
        const status = item['wp:status'];
        return postType === 'post' && status === 'publish';
    });
    
    console.log(`Found ${posts.length} blog posts to import`);
    
    for (const item of posts) {
        try {
            const title = item.title || 'Untitled';
            const content = item['content:encoded'] || '';
            const pubDate = new Date(item.pubDate);
            const postName = item['wp:post_name'] || createSlug(title);
            
            console.log(`\\nProcessing post: "${title}" (${pubDate.toDateString()})`);
            
            // Clean content and extract image URLs
            const { content: cleanedContent, imageUrls } = cleanContent(content);
            
            // Process and upload images
            const processedImages = [];
            for (const imageUrl of imageUrls) {
                const imageResult = await processImage(imageUrl, pubDate);
                if (imageResult) {
                    processedImages.push(imageResult);
                    imageMap.set(imageUrl, imageResult.imageId);
                }
            }
            
            // Update content with new image URLs
            let finalContent = cleanedContent;
            for (const [originalUrl, imageId] of imageMap) {
                const newImage = processedImages.find(img => img.imageId === imageId);
                if (newImage) {
                    finalContent = finalContent.replace(
                        new RegExp(originalUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'),
                        newImage.url
                    );
                }
            }
            
            // Create slug
            const slug = createSlug(title);
            
            // Select featured image (first image if available)
            const featuredImageId = processedImages.length > 0 ? processedImages[0].imageId : null;
            
            // Insert post
            const postResult = db.prepare(`
                INSERT INTO posts (title, content, slug, published, featured_image_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                title,
                finalContent,
                slug,
                1, // published
                featuredImageId,
                pubDate.toISOString(),
                pubDate.toISOString()
            );
            
            const postId = postResult.lastInsertRowid;
            
            // Link remaining images to post
            for (let i = 1; i < processedImages.length; i++) {
                db.prepare(`
                    INSERT INTO post_images (post_id, image_id, sort_order)
                    VALUES (?, ?, ?)
                `).run(postId, processedImages[i].imageId, i);
            }
            
            console.log(`✅ Imported: "${title}" with ${processedImages.length} images`);
            importedPosts++;
            
        } catch (error) {
            console.error(`❌ Error importing post "${item.title}":`, error);
            skippedItems++;
        }
    }
    
    console.log(`\\n🎉 Import complete!`);
    console.log(`📝 Imported posts: ${importedPosts}`);
    console.log(`⚠️  Skipped items: ${skippedItems}`);
    console.log(`🖼️  Total images processed: ${imageMap.size}`);
}

// Run the import
console.log('🚀 Starting Squarespace import...');
importSquarespaceXML().catch(console.error);