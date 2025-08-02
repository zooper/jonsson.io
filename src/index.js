/**
 * Cloudflare Workers entry point for jonsson.io photography homepage
 * Static files are served by Cloudflare Workers Assets
 */

import { B2Storage } from './storage.js';
import { ExifExtractor } from './exif.js';
import { PhotoDatabase } from './database.js';
import { LocationService } from './location.js';

export default {
    async fetch(request, env, ctx) {
        try {
            const url = new URL(request.url);
            const pathname = url.pathname;

            // Admin routes
            if (pathname.startsWith('/admin')) {
                return handleAdminRequest(request, env, pathname);
            }
            
            // API Routes only - static files handled by Cloudflare Assets
            if (pathname.startsWith('/api/')) {
                return handleApiRequest(request, env, pathname);
            }

            // Let Cloudflare Assets handle static files
            // This includes /, /static/css/style.css, /static/js/gallery.js, etc.
            return env.ASSETS.fetch(request);

        } catch (error) {
            console.error('Worker error:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }
};

async function handleAdminRequest(request, env, pathname) {
    console.log('Admin request:', request.method, pathname);
    
    // Simple authentication check for API routes
    if (pathname.startsWith('/admin/api/')) {
        const authHeader = request.headers.get('Authorization');
        const adminPassword = env.ADMIN_PASSWORD || 'admin123';
        
        console.log('Auth check - Header:', authHeader ? 'Present' : 'Missing', 'Expected:', `Bearer ${adminPassword}`);
        
        if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
            console.log('Authentication failed');
            return new Response('Unauthorized', { status: 401 });
        }
        
        console.log('Authentication passed');
    }
    
    // API routes
    switch (pathname) {
        case '/admin/api/upload':
            if (request.method === 'POST') {
                return handleAdminUpload(request, env);
            }
            break;
            
        case '/admin/api/photos':
            return handleAdminPhotos(request, env);
            
        case '/admin/api/delete':
            if (request.method === 'DELETE') {
                return handleAdminDelete(request, env);
            }
            break;
            
        case '/admin/api/bulk-delete':
            if (request.method === 'DELETE') {
                return handleAdminBulkDelete(request, env);
            }
            break;
            
        case '/admin/api/rescan-exif':
            if (request.method === 'POST') {
                return handleAdminRescanExif(request, env);
            }
            break;
            
        case '/admin/api/bulk-rescan-exif':
            if (request.method === 'POST') {
                return handleAdminBulkRescanExif(request, env);
            }
            break;
            
        case '/admin/api/update':
            if (request.method === 'PUT') {
                return handleAdminUpdate(request, env);
            }
            break;
            
        case '/admin/api/migrate':
            if (request.method === 'POST') {
                return handleAdminMigrate(request, env);
            }
            break;
            
        case '/admin/api/migrate-ai-quotes':
            if (request.method === 'POST') {
                return handleMigrateAIQuotes(request, env);
            }
            break;
            
        case '/admin/api/ai-status':
            if (request.method === 'GET') {
                return handleGetAIStatus(request, env);
            }
            break;
            
        case '/admin/api/auth':
            if (request.method === 'POST') {
                return handleAdminAuth(request, env);
            }
            break;
            
        case '/admin/api/themes':
            if (request.method === 'GET') {
                return handleGetThemes(request, env);
            } else if (request.method === 'POST') {
                return handleSetTheme(request, env);
            }
            break;
            
        case '/admin/api/site-settings':
            if (request.method === 'GET') {
                return handleGetSiteSettings(request, env);
            }
            break;
            
        case '/admin/api/site-settings/about':
            if (request.method === 'PUT') {
                return handleUpdateAboutSettings(request, env);
            }
            break;
            
        case '/admin/api/site-settings/contact':
            if (request.method === 'PUT') {
                return handleUpdateContactSettings(request, env);
            }
            break;
            
        case '/admin/api/upload-profile-image':
            if (request.method === 'POST') {
                return handleUploadProfileImage(request, env);
            }
            break;
            
        case '/admin/api/remove-profile-image':
            if (request.method === 'DELETE') {
                return handleRemoveProfileImage(request, env);
            }
            break;
            
        case '/admin/api/refresh-hero-quote':
            if (request.method === 'POST') {
                return handleRefreshHeroQuote(request, env);
            }
            break;
            
        case '/admin/api/update-all-quotes':
            if (request.method === 'POST') {
                return handleUpdateAllQuotes(request, env);
            }
            break;
            
        case '/admin/api/quotes':
            if (request.method === 'GET') {
                return handleGetAllQuotes(request, env);
            }
            break;
            
        case '/admin/api/quotes/update':
            if (request.method === 'PUT') {
                return handleUpdateQuote(request, env);
            }
            break;
    }
    
    // Serve static admin files
    return env.ASSETS.fetch(request);
}

async function handleApiRequest(request, env, pathname) {
    const storage = new B2Storage(env);

    // Check if endpoint requires authentication
    const protectedEndpoints = ['/api/debug', '/api/test-exif', '/api/test-upload', '/api/debug-db'];
    
    if (protectedEndpoints.includes(pathname)) {
        const authHeader = request.headers.get('Authorization');
        const adminPassword = env.ADMIN_PASSWORD || 'admin123';
        
        if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
            return new Response('Unauthorized', { status: 401 });
        }
    }

    try {
        switch (pathname) {
            case '/api/photos':
                return handlePhotosRequest(storage, request, env.DB);
            
            case '/api/debug':
                return handleDebugRequest(storage, request);
            
            case '/api/test-exif':
                return handleTestExifRequest(storage, request);
            
            case '/api/test-upload':
                return handleTestUploadRequest(storage, request);
            
            case '/api/debug-db':
                return handleDebugDbRequest(request, env);
            
            case '/api/theme':
                return handleGetCurrentTheme(request, env);
                
            case '/api/site-settings':
                return handleGetPublicSiteSettings(request, env);
                
            case '/api/hero-quote':
                return handleGetCurrentHeroQuote(request, env);
            
            default:
                return new Response('API endpoint not found', { status: 404 });
        }
    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handlePhotosRequest(storage, request, db) {
    try {
        // Get photos from database with EXIF data
        const photoDb = new PhotoDatabase(db);
        const photos = await photoDb.listPhotos(50);

        return new Response(JSON.stringify(photos), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });

    } catch (error) {
        console.error('Error fetching photos:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch photos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleDebugRequest(storage, request) {
    try {
        // Test B2 authentication and list files
        await storage.authenticate();
        
        // Get all files (not just photos/ prefix)
        const allFiles = await storage.listFiles('', 10);
        
        // Get photos specifically
        const photoFiles = await storage.listFiles('photos/', 10);
        
        return new Response(JSON.stringify({
            message: 'B2 connection successful',
            credentials: {
                keyId: storage.keyId ? 'Set' : 'Missing',
                bucketName: storage.bucketName || 'Missing',
                bucketId: storage.bucketId ? 'Set' : 'Missing'
            },
            allFiles: allFiles.length,
            photoFiles: photoFiles.length,
            sampleFiles: allFiles.map(f => ({ name: f.name, size: f.size })),
            samplePhotos: photoFiles.map(f => ({ 
                name: f.name, 
                size: f.size, 
                url: f.url,
                exif: f.exif,
                rawFileInfo: f.rawFileInfo
            }))
        }, null, 2), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'B2 connection failed',
            message: error.message,
            credentials: {
                keyId: storage.keyId ? 'Set' : 'Missing',
                bucketName: storage.bucketName || 'Missing',
                bucketId: storage.bucketId ? 'Set' : 'Missing'
            }
        }, null, 2), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function extractTitleFromFileName(fileName) {
    // Remove extension and path
    let name = fileName.split('/').pop().split('.')[0];
    
    // Remove timestamp patterns (like 20250801T195712)
    name = name.replace(/\d{8}T\d{6}/g, '');
    
    // Clean up extra hyphens/underscores
    name = name.replace(/[-_]+/g, ' ').trim();
    
    // If it's just a camera model/serial, make it cleaner
    if (name.match(/^[A-Z]\d+$/)) {
        return name; // Keep as is for camera model numbers like L1040075
    }
    
    // Convert underscores/hyphens to spaces, and title case
    return name
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim() || 'Untitled';
}

// Admin API functions - HTML is now served from static files

async function handleAdminUpload(request, env) {
    console.log('Upload handler called');
    const storage = new B2Storage(env);
    const exifExtractor = new ExifExtractor();
    const photoDb = new PhotoDatabase(env.DB);
    const locationService = new LocationService();
    
    try {
        console.log('Parsing form data...');
        // Get the uploaded file from FormData
        const formData = await request.formData();
        const file = formData.get('photo');
        console.log('File extracted from form data:', file ? `${file.name} (${file.size} bytes)` : 'null');
        
        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Generate filename with more unique timestamp
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:\-\.]/g, '').slice(0, 15); // YYYYMMDDTHHmmss
        const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 random chars
        const extension = file.name.split('.').pop().toLowerCase();
        const baseFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
        const filename = `photos/${baseFileName}-${timestamp}-${randomSuffix}.${extension}`;
        
        console.log('Upload details:', {
            originalName: file.name,
            baseFileName,
            timestamp,
            generatedFilename: filename,
            fileSize: file.size,
            fileType: file.type
        });
        
        // Convert file to ArrayBuffer
        const fileData = await file.arrayBuffer();
        
        // Extract EXIF data
        let exifData = null;
        try {
            exifData = await exifExtractor.extractExif(fileData);
        } catch (error) {
            console.error('EXIF extraction failed:', error);
            exifData = null;
        }
        
        // If no EXIF data, create basic metadata from filename
        if (!exifData || Object.keys(exifData).every(key => !exifData[key])) {
            console.log('No EXIF data found, using filename-based metadata');
            exifData = {
                camera: {
                    make: 'Unknown',
                    model: 'Unknown'
                },
                timestamp: new Date().toISOString()
            };
        }
        
        // Upload to B2 (without EXIF headers)
        const uploadResult = await storage.uploadFile(fileData, filename, file.type);
        
        // Resolve GPS coordinates to location if available
        let location = null;
        if (exifData?.gps?.latitude && exifData?.gps?.longitude) {
            location = await locationService.reverseGeocode(
                exifData.gps.latitude, 
                exifData.gps.longitude
            );
        }
        
        // Save photo metadata and EXIF to database
        const photoId = crypto.randomUUID();
        await photoDb.savePhoto({
            id: photoId,
            filename: file.name,
            b2FileId: uploadResult.fileId,
            b2Filename: uploadResult.fileName,
            url: uploadResult.url,
            fileSize: file.size,
            contentType: file.type,
            exifData: exifData,
            location: location
        });
        
        // Automatically generate AI quote for the newly uploaded photo
        let quoteGenerated = false;
        let generatedQuote = null;
        
        try {
            console.log('Generating AI quote for newly uploaded photo:', photoId);
            
            const photo = {
                id: photoId,
                url: uploadResult.url,
                title: extractTitleFromFileName(file.name),
                description: null // New uploads don't have descriptions yet
            };
            
            const quote = await generateAIQuote(photo, env);
            
            if (quote) {
                // Save the AI-generated quote
                const quoteId = crypto.randomUUID();
                await env.DB.prepare(`
                    INSERT INTO ai_quotes (id, photo_id, quote, is_active, created_at)
                    VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)
                `).bind(quoteId, photoId, quote).run();
                
                quoteGenerated = true;
                generatedQuote = quote;
                console.log('AI quote generated and saved for photo:', photoId);
            }
        } catch (quoteError) {
            // Don't fail the upload if quote generation fails
            console.error('Failed to generate quote for uploaded photo:', quoteError);
        }
        
        return new Response(JSON.stringify({
            success: true,
            filename: uploadResult.fileName,
            url: uploadResult.url,
            fileId: uploadResult.fileId,
            message: 'Photo uploaded successfully',
            quoteGenerated: quoteGenerated,
            aiQuote: generatedQuote
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Upload handler error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminPhotos(request, env) {
    try {
        const photoDb = new PhotoDatabase(env.DB);
        const photos = await photoDb.listPhotos(100);
        
        return new Response(JSON.stringify(photos), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminDelete(request, env) {
    const storage = new B2Storage(env);
    const photoDb = new PhotoDatabase(env.DB);
    
    try {
        const { photoId } = await request.json();
        
        if (!photoId) {
            return new Response(JSON.stringify({ error: 'Photo ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Get photo info from database
        const photo = await photoDb.getPhotoByB2FileId(photoId);
        
        if (!photo) {
            return new Response(JSON.stringify({ error: 'Photo not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Try to delete from B2 (handle case where file might already be deleted)
        let b2DeleteSuccess = false;
        try {
            const dbPhoto = await photoDb.db.prepare('SELECT b2_filename FROM photos WHERE b2_file_id = ?').bind(photoId).first();
            await storage.deleteFile(photoId, dbPhoto.b2_filename);
            b2DeleteSuccess = true;
        } catch (b2Error) {
            console.warn('B2 delete failed (file may already be deleted):', b2Error.message);
            // Continue with database deletion even if B2 delete fails
        }
        
        // Delete from database regardless of B2 delete result
        await photoDb.deletePhoto(photoId);
        
        return new Response(JSON.stringify({ 
            success: true,
            message: b2DeleteSuccess ? 'Photo deleted successfully' : 'Photo removed from gallery (file was already deleted from storage)',
            b2DeleteSuccess: b2DeleteSuccess
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminBulkDelete(request, env) {
    const storage = new B2Storage(env);
    
    try {
        const { photoIds } = await request.json();
        
        if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
            return new Response(JSON.stringify({ error: 'Photo IDs array required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Get all files to find the ones we need to delete
        const files = await storage.listFiles('photos/', 1000);
        
        let deletedCount = 0;
        const errors = [];
        
        // Delete each photo
        for (const photoId of photoIds) {
            try {
                const file = files.find(f => f.id === photoId);
                
                if (!file) {
                    errors.push(`Photo ${photoId} not found`);
                    continue;
                }
                
                // Delete from B2
                await storage.deleteFile(photoId, file.name);
                deletedCount++;
                
            } catch (error) {
                console.error(`Failed to delete photo ${photoId}:`, error);
                errors.push(`Failed to delete photo ${photoId}: ${error.message}`);
            }
        }
        
        const response = {
            success: true,
            deletedCount: deletedCount,
            requestedCount: photoIds.length,
            message: `Successfully deleted ${deletedCount} of ${photoIds.length} photos`
        };
        
        if (errors.length > 0) {
            response.errors = errors;
            response.success = deletedCount > 0; // Partial success if some deleted
        }
        
        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminRescanExif(request, env) {
    const storage = new B2Storage(env);
    const exifExtractor = new ExifExtractor();
    const photoDb = new PhotoDatabase(env.DB);
    const locationService = new LocationService();
    
    try {
        const { photoId } = await request.json();
        
        if (!photoId) {
            return new Response(JSON.stringify({ error: 'Photo ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Get photo from database
        const photo = await photoDb.getPhotoByB2FileId(photoId);
        
        if (!photo) {
            return new Response(JSON.stringify({ error: 'Photo not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Download the file to re-extract EXIF
        const fileResponse = await fetch(photo.url);
        if (!fileResponse.ok) {
            throw new Error('Failed to download file for EXIF extraction');
        }
        
        const fileData = await fileResponse.arrayBuffer();
        
        // Extract EXIF data
        let exifData = null;
        try {
            exifData = await exifExtractor.extractExif(fileData);
        } catch (error) {
            console.error('EXIF re-extraction failed:', error);
            exifData = null;
        }
        
        // Resolve GPS coordinates to location if available
        let location = null;
        if (exifData?.gps?.latitude && exifData?.gps?.longitude) {
            location = await locationService.reverseGeocode(
                exifData.gps.latitude, 
                exifData.gps.longitude
            );
        }
        
        // Update EXIF data in database
        if (exifData) {
            await photoDb.updatePhotoExif(photoId, exifData, location);
        }
        
        return new Response(JSON.stringify({
            success: true,
            photoId: photoId,
            exifData: exifData,
            location: location,
            message: 'EXIF data re-extracted and stored successfully'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminBulkRescanExif(request, env) {
    const storage = new B2Storage(env);
    const exifExtractor = new ExifExtractor();
    const photoDb = new PhotoDatabase(env.DB);
    const locationService = new LocationService();
    
    try {
        const { photoIds } = await request.json();
        
        if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
            return new Response(JSON.stringify({ error: 'Photo IDs array required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        let processedCount = 0;
        const results = [];
        const errors = [];
        
        // Process each photo
        for (const photoId of photoIds) {
            try {
                // Get photo from database
                const photo = await photoDb.getPhotoByB2FileId(photoId);
                
                if (!photo) {
                    errors.push(`Photo ${photoId} not found in database`);
                    continue;
                }
                
                // Download the file to re-extract EXIF
                const fileResponse = await fetch(photo.url);
                if (!fileResponse.ok) {
                    errors.push(`Failed to download ${photo.url}`);
                    continue;
                }
                
                const fileData = await fileResponse.arrayBuffer();
                
                // Extract EXIF data
                let exifData = null;
                try {
                    exifData = await exifExtractor.extractExif(fileData);
                } catch (error) {
                    console.error('EXIF extraction failed for', photo.url, ':', error);
                }
                
                // Resolve GPS coordinates to location if available
                let location = null;
                if (exifData?.gps?.latitude && exifData?.gps?.longitude) {
                    try {
                        location = await locationService.reverseGeocode(
                            exifData.gps.latitude, 
                            exifData.gps.longitude
                        );
                    } catch (locationError) {
                        console.error('Location resolution failed:', locationError);
                    }
                }
                
                // Update EXIF data in database
                let updateSuccess = false;
                if (exifData) {
                    try {
                        await photoDb.updatePhotoExif(photoId, exifData, location);
                        updateSuccess = true;
                    } catch (dbError) {
                        console.error('Database update failed for', photoId, ':', dbError);
                        errors.push(`Failed to update database for ${photoId}: ${dbError.message}`);
                    }
                }
                
                results.push({
                    photoId: photoId,
                    exifData: exifData,
                    location: location,
                    metadataUpdated: updateSuccess,
                    success: true
                });
                
                processedCount++;
                
            } catch (error) {
                console.error(`Failed to process photo ${photoId}:`, error);
                errors.push(`Failed to process photo ${photoId}: ${error.message}`);
            }
        }
        
        const response = {
            success: true,
            processedCount: processedCount,
            requestedCount: photoIds.length,
            results: results,
            message: `Successfully re-scanned EXIF for ${processedCount} of ${photoIds.length} photos`
        };
        
        if (errors.length > 0) {
            response.errors = errors;
        }
        
        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminUpdate(request, env) {
    const photoDb = new PhotoDatabase(env.DB);
    
    try {
        const { photoId, title, description } = await request.json();
        
        if (!photoId) {
            return new Response(JSON.stringify({ error: 'Photo ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Check if photo exists
        const photo = await photoDb.getPhotoByB2FileId(photoId);
        if (!photo) {
            return new Response(JSON.stringify({ error: 'Photo not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Update photo metadata - only include fields that are being updated
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        
        // Make sure we have at least one field to update
        if (Object.keys(updates).length === 0) {
            return new Response(JSON.stringify({ error: 'No fields to update' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        await photoDb.updatePhotoMetadata(photoId, updates);
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Photo updated successfully'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminMigrate(request, env) {
    try {
        const migrations = [];
        
        // Add description column to photos table (if not exists)
        try {
            await env.DB.prepare(`
                ALTER TABLE photos ADD COLUMN description TEXT
            `).run();
            migrations.push('Added description column');
        } catch (error) {
            if (error.message.includes('duplicate column name')) {
                migrations.push('Description column already exists');
            } else {
                throw error;
            }
        }
        
        // Add title column to photos table (if not exists)
        try {
            await env.DB.prepare(`
                ALTER TABLE photos ADD COLUMN title TEXT
            `).run();
            migrations.push('Added title column');
        } catch (error) {
            if (error.message.includes('duplicate column name')) {
                migrations.push('Title column already exists');
            } else {
                throw error;
            }
        }
        
        // Create AI quotes table
        try {
            await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS ai_quotes (
                    id TEXT PRIMARY KEY,
                    photo_id TEXT NOT NULL,
                    quote TEXT NOT NULL,
                    is_active INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
                )
            `).run();
            migrations.push('Created ai_quotes table');
        } catch (error) {
            if (!error.message.includes('already exists')) {
                throw error;
            }
            migrations.push('AI quotes table already exists');
        }
        
        // Create indexes for ai_quotes table
        try {
            await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_ai_quotes_photo_id ON ai_quotes(photo_id)').run();
            await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_ai_quotes_active ON ai_quotes(is_active)').run();
            migrations.push('Created AI quotes indexes');
        } catch (error) {
            migrations.push('AI quotes indexes already exist or failed to create');
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Database migration completed',
            migrations: migrations
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'Migration failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleAdminAuth(request, env) {
    try {
        const { password } = await request.json();
        const adminPassword = env.ADMIN_PASSWORD || 'admin123';
        
        if (password === adminPassword) {
            return new Response(JSON.stringify({ 
                success: true,
                message: 'Authentication successful'
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ 
                error: 'Invalid password'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleTestExifRequest(storage, request) {
    const exifExtractor = new ExifExtractor();
    
    try {
        // Get the first photo file
        const files = await storage.listFiles('photos/', 1);
        if (files.length === 0) {
            return new Response(JSON.stringify({ error: 'No photos found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const file = files[0];
        
        // Download the file
        const fileResponse = await fetch(file.url);
        if (!fileResponse.ok) {
            throw new Error('Failed to download file');
        }
        
        const fileData = await fileResponse.arrayBuffer();
        
        // Extract raw EXIF data
        const rawExifData = await exifExtractor.extractExif(fileData);
        
        return new Response(JSON.stringify({
            fileName: file.name,
            fileSize: fileData.byteLength,
            rawExifData: rawExifData,
            currentStoredData: file.exif,
            rawFileInfo: file.rawFileInfo
        }, null, 2), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'EXIF test failed',
            message: error.message
        }, null, 2), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleTestUploadRequest(storage, request) {
    try {
        // Test B2 authentication
        await storage.authenticate();
        
        // Test getting an upload URL
        const uploadUrlResponse = await fetch(`${storage.apiUrl}/b2api/v2/b2_get_upload_url`, {
            method: 'POST',
            headers: {
                'Authorization': storage.authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bucketId: storage.bucketId
            })
        });
        
        const uploadUrlData = await uploadUrlResponse.json();
        
        return new Response(JSON.stringify({
            message: 'Upload test successful',
            authToken: storage.authToken ? 'Present' : 'Missing',
            apiUrl: storage.apiUrl,
            bucketId: storage.bucketId,
            uploadUrlResponse: {
                ok: uploadUrlResponse.ok,
                status: uploadUrlResponse.status,
                statusText: uploadUrlResponse.statusText,
                data: uploadUrlData
            }
        }, null, 2), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Upload test failed',
            message: error.message,
            stack: error.stack
        }, null, 2), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleDebugDbRequest(request, env) {
    try {
        const photoDb = new PhotoDatabase(env.DB);
        
        // Get all photos from database
        const photos = await photoDb.listPhotos(10);
        
        // Also get raw database rows to see what's actually stored
        const rawRows = await photoDb.db.prepare(`
            SELECT * FROM photos 
            ORDER BY upload_date DESC 
            LIMIT 5
        `).all();
        
        return new Response(JSON.stringify({
            message: 'Database debug info',
            photoCount: photos.length,
            formattedPhotos: photos,
            rawDatabaseRows: rawRows.results
        }, null, 2), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Database debug failed',
            message: error.message,
            stack: error.stack
        }, null, 2), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Theme Management Functions

async function handleGetThemes(request, env) {
    try {
        const themes = [
            {
                id: 'modern',
                name: 'Modern',
                description: 'Contemporary design with gradients and glassmorphism',
                preview: '/static/css/themes/modern.css',
                colors: {
                    primary: '#667eea',
                    accent: '#f093fb',
                    background: '#fafafa'
                }
            },
            {
                id: 'leica',
                name: 'Leica',
                description: 'Inspired by Leica\'s iconic design language with classic red dot',
                preview: '/static/css/themes/leica.css',
                colors: {
                    primary: '#e60012',
                    accent: '#2c2c2c',
                    background: '#fafafa'
                }
            },
            {
                id: 'monochrome',
                name: 'Monochrome',
                description: 'Pure black and white photography aesthetic',
                preview: '/static/css/themes/monochrome.css',
                colors: {
                    primary: '#000000',
                    accent: '#333333',
                    background: '#ffffff'
                }
            },
            {
                id: 'vintage',
                name: 'Vintage',
                description: 'Warm, nostalgic colors inspired by film photography',
                preview: '/static/css/themes/vintage.css',
                colors: {
                    primary: '#8B4513',
                    accent: '#CD853F',
                    background: '#FDF5E6'
                }
            }
        ];

        // Get current active theme
        const currentTheme = await getSetting(env.DB, 'active_theme') || 'modern';

        return new Response(JSON.stringify({
            themes: themes,
            currentTheme: currentTheme
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleSetTheme(request, env) {
    try {
        const { themeId } = await request.json();

        if (!themeId) {
            return new Response(JSON.stringify({ error: 'Theme ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate theme exists
        const validThemes = ['modern', 'leica', 'monochrome', 'vintage'];
        if (!validThemes.includes(themeId)) {
            return new Response(JSON.stringify({ error: 'Invalid theme ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Update theme in database
        await setSetting(env.DB, 'active_theme', themeId);

        return new Response(JSON.stringify({
            success: true,
            message: 'Theme updated successfully',
            themeId: themeId
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleGetCurrentTheme(request, env) {
    try {
        const currentTheme = await getSetting(env.DB, 'active_theme') || 'modern';

        return new Response(JSON.stringify({
            themeId: currentTheme,
            cssUrl: `/static/css/themes/${currentTheme}.css`
        }), {
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60' // Cache for 1 minute
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Settings helper functions
async function getSetting(db, key) {
    try {
        const result = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
        return result ? result.value : null;
    } catch (error) {
        console.error('Error getting setting:', error);
        return null;
    }
}

async function setSetting(db, key, value) {
    try {
        await db.prepare(`
            INSERT OR REPLACE INTO settings (key, value, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
        `).bind(key, value).run();
    } catch (error) {
        console.error('Error setting value:', error);
        throw error;
    }
}

// Site Settings Management Functions
async function handleGetSiteSettings(request, env) {
    try {
        // Get all site settings from the database
        const settings = {};
        
        // About settings
        const aboutTitle = await getSetting(env.DB, 'about_title');
        const aboutLead = await getSetting(env.DB, 'about_lead');
        const aboutDescription = await getSetting(env.DB, 'about_description');
        const aboutSkills = await getSetting(env.DB, 'about_skills');
        const profilePicture = await getSetting(env.DB, 'profile_picture');
        
        if (aboutTitle || aboutLead || aboutDescription || aboutSkills || profilePicture) {
            settings.about = {
                title: aboutTitle,
                lead: aboutLead,
                description: aboutDescription,
                skills: aboutSkills ? JSON.parse(aboutSkills) : null,
                profilePicture: profilePicture
            };
        }
        
        // Contact settings
        const contactTitle = await getSetting(env.DB, 'contact_title');
        const contactSubtitle = await getSetting(env.DB, 'contact_subtitle');
        const contactEmail = await getSetting(env.DB, 'contact_email');
        const instagramHandle = await getSetting(env.DB, 'instagram_handle');
        const instagramUrl = await getSetting(env.DB, 'instagram_url');
        
        if (contactTitle || contactSubtitle || contactEmail || instagramHandle || instagramUrl) {
            settings.contact = {
                title: contactTitle,
                subtitle: contactSubtitle,
                email: contactEmail,
                instagramHandle: instagramHandle,
                instagramUrl: instagramUrl
            };
        }
        
        return new Response(JSON.stringify(settings), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error getting site settings:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleUpdateAboutSettings(request, env) {
    try {
        const settings = await request.json();
        
        // Save about settings to database
        if (settings.title !== undefined) {
            await setSetting(env.DB, 'about_title', settings.title);
        }
        if (settings.lead !== undefined) {
            await setSetting(env.DB, 'about_lead', settings.lead);
        }
        if (settings.description !== undefined) {
            await setSetting(env.DB, 'about_description', settings.description);
        }
        if (settings.skills !== undefined) {
            await setSetting(env.DB, 'about_skills', JSON.stringify(settings.skills));
        }
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error updating about settings:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleUpdateContactSettings(request, env) {
    try {
        const settings = await request.json();
        
        // Save contact settings to database
        if (settings.title !== undefined) {
            await setSetting(env.DB, 'contact_title', settings.title);
        }
        if (settings.subtitle !== undefined) {
            await setSetting(env.DB, 'contact_subtitle', settings.subtitle);
        }
        if (settings.email !== undefined) {
            await setSetting(env.DB, 'contact_email', settings.email);
        }
        if (settings.instagramHandle !== undefined) {
            await setSetting(env.DB, 'instagram_handle', settings.instagramHandle);
        }
        if (settings.instagramUrl !== undefined) {
            await setSetting(env.DB, 'instagram_url', settings.instagramUrl);
        }
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error updating contact settings:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleUploadProfileImage(request, env) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get('profileImage');
        
        if (!imageFile) {
            return new Response(JSON.stringify({ error: 'No image file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Initialize storage
        const storage = new B2Storage(env);
        await storage.authenticate();
        
        // Generate filename for profile image
        const timestamp = Date.now();
        const extension = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `profile-${timestamp}.${extension}`;
        
        // Upload to B2
        const arrayBuffer = await imageFile.arrayBuffer();
        const uploadResult = await storage.uploadFile(arrayBuffer, fileName, imageFile.type);
        
        if (!uploadResult || !uploadResult.url) {
            throw new Error('Failed to upload profile image to storage');
        }
        
        // Save profile image URL to settings
        await setSetting(env.DB, 'profile_picture', uploadResult.url);
        
        return new Response(JSON.stringify({
            success: true,
            imageUrl: uploadResult.url
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error uploading profile image:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleRemoveProfileImage(request, env) {
    try {
        // For now, just remove the setting without deleting from storage
        // TODO: Implement proper file deletion by storing fileId during upload
        console.log('Removing profile picture setting (file remains in storage)');
        
        // Remove profile picture setting
        await setSetting(env.DB, 'profile_picture', '');
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error removing profile image:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Public API endpoint for site settings (cached)
async function handleGetPublicSiteSettings(request, env) {
    try {
        // Get public site settings (non-sensitive data only)
        const settings = {};
        
        // About settings
        const aboutTitle = await getSetting(env.DB, 'about_title') || 'About';
        const aboutLead = await getSetting(env.DB, 'about_lead') || "I'm a photographer passionate about capturing the beauty of everyday moments and the extraordinary in the ordinary.";
        const aboutDescription = await getSetting(env.DB, 'about_description') || "My work focuses on natural light, authentic emotions, and the stories that unfold in front of my lens. Each photograph is a window into a moment that will never happen again exactly the same way.";
        const aboutSkills = await getSetting(env.DB, 'about_skills');
        const profilePicture = await getSetting(env.DB, 'profile_picture');
        
        settings.about = {
            title: aboutTitle,
            lead: aboutLead,
            description: aboutDescription,
            profilePicture: profilePicture
        };
        
        // Contact settings
        const contactTitle = await getSetting(env.DB, 'contact_title') || "Get In Touch";
        const contactSubtitle = await getSetting(env.DB, 'contact_subtitle') || "Feel free to reach out if you'd like to connect or have any questions about my photography.";
        const contactEmail = await getSetting(env.DB, 'contact_email') || 'hello@jonsson.io';
        const instagramHandle = await getSetting(env.DB, 'instagram_handle') || 'jonsson';
        const instagramUrl = await getSetting(env.DB, 'instagram_url') || 'https://instagram.com/jonsson';
        
        settings.contact = {
            title: contactTitle,
            subtitle: contactSubtitle,
            email: contactEmail,
            instagramHandle: instagramHandle,
            instagramUrl: instagramUrl
        };
        
        return new Response(JSON.stringify(settings), {
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });
        
    } catch (error) {
        console.error('Error getting public site settings:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// AI Quote Management Functions
async function handleGetCurrentHeroQuote(request, env) {
    try {
        // Check if we have any AI quotes available
        const quoteCount = await env.DB.prepare('SELECT COUNT(*) as count FROM ai_quotes').first();
        
        if (quoteCount.count > 0) {
            // Get a random image-quote pair from existing AI quotes
            // Each image has its own specific quote, we randomly select which pair to show
            const randomQuote = await env.DB.prepare(`
                SELECT 
                    aq.id as quote_id,
                    aq.quote,
                    aq.created_at,
                    p.id as photo_id,
                    p.url as photo_url,
                    p.title as photo_title,
                    p.description as photo_description
                FROM ai_quotes aq
                JOIN photos p ON aq.photo_id = p.id
                ORDER BY RANDOM()
                LIMIT 1
            `).first();

            if (randomQuote) {
                return new Response(JSON.stringify({
                    quote: randomQuote.quote,
                    photo: {
                        id: randomQuote.photo_id,
                        url: randomQuote.photo_url,
                        title: randomQuote.photo_title,
                        description: randomQuote.photo_description
                    },
                    lastUpdated: randomQuote.created_at,
                    isAI: true,
                    source: 'ai_generated'
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache' // Don't cache so it's random on each reload
                    }
                });
            }
        }
        
        // If no AI quotes available, generate one on-the-fly or use fallback
        const photos = await env.DB.prepare('SELECT COUNT(*) as count FROM photos').first();
        
        if (photos.count > 0) {
            // Try to generate a new quote on-the-fly for a random photo
            const randomPhoto = await env.DB.prepare(`
                SELECT id, url, title, description
                FROM photos
                ORDER BY RANDOM()
                LIMIT 1
            `).first();
            
            if (randomPhoto) {
                // Try to generate AI quote
                const quote = await generateAIQuote(randomPhoto, env);
                
                return new Response(JSON.stringify({
                    quote: quote,
                    photo: {
                        id: randomPhoto.id,
                        url: randomPhoto.url,
                        title: randomPhoto.title,
                        description: randomPhoto.description
                    },
                    lastUpdated: new Date().toISOString(),
                    isAI: env.OPENAI_API_KEY ? true : false,
                    source: env.OPENAI_API_KEY ? 'ai_live' : 'fallback'
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
            }
        }
        
        // Final fallback to default quote with no photo
        return new Response(JSON.stringify({
            quote: "Every photograph is a window into a moment that will never happen again",
            photo: null,
            lastUpdated: null,
            isAI: false,
            source: 'default'
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
    } catch (error) {
        console.error('Error getting current hero quote:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleRefreshHeroQuote(request, env) {
    try {
        // Get a random photo from the gallery
        const randomPhoto = await env.DB.prepare(`
            SELECT id, url, title, description
            FROM photos
            ORDER BY RANDOM()
            LIMIT 1
        `).first();

        if (!randomPhoto) {
            return new Response(JSON.stringify({ error: 'No photos available for quote generation' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate AI quote based on the image
        const quote = await generateAIQuote(randomPhoto, env);
        
        if (!quote) {
            return new Response(JSON.stringify({ error: 'Failed to generate AI quote' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Deactivate all existing quotes
        await env.DB.prepare('UPDATE ai_quotes SET is_active = 0').run();

        // Save the new quote
        const quoteId = crypto.randomUUID();
        await env.DB.prepare(`
            INSERT INTO ai_quotes (id, photo_id, quote, is_active, created_at)
            VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
        `).bind(quoteId, randomPhoto.id, quote).run();

        return new Response(JSON.stringify({
            success: true,
            quote: quote,
            photo: {
                id: randomPhoto.id,
                url: randomPhoto.url,
                title: randomPhoto.title,
                description: randomPhoto.description
            },
            message: 'Hero quote refreshed successfully'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error refreshing hero quote:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function generateAIQuote(photo, env) {
    try {
        // Check if OpenAI API key is available
        if (!env.OPENAI_API_KEY) {
            console.warn('OpenAI API key not configured, using fallback quote');
            return generateFallbackQuote(photo);
        }

        // Prepare the prompt for OpenAI Vision model based on actual image content
        const imageUrl = photo.url;
        let prompt = 'Analyze this photograph and generate an inspiring, poetic quote that captures what you see in the image. ';
        
        if (photo.title) {
            prompt += `The photo is titled "${photo.title}". `;
        }
        
        if (photo.description) {
            prompt += `Additional context: ${photo.description}. `;
        }
        
        prompt += 'The quote should be 1-2 sentences, thoughtful, and relate directly to what you observe in the image - the mood, composition, subject matter, lighting, or story it tells. Make it unique and memorable, avoiding generic photography clichés.';

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a thoughtful photography curator with keen visual perception who creates inspiring quotes based on what you actually see in photographs.'
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl,
                                    detail: 'high'
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 150,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            console.error('OpenAI API error:', response.status, response.statusText);
            return generateFallbackQuote(photo);
        }

        const data = await response.json();
        const quote = data.choices[0]?.message?.content?.trim();
        
        if (quote && quote.length > 10) {
            // Clean up the quote (remove quotes if AI added them)
            return quote.replace(/^["']|["']$/g, '');
        } else {
            return generateFallbackQuote(photo);
        }
        
    } catch (error) {
        console.error('Error generating AI quote:', error);
        return generateFallbackQuote(photo);
    }
}

function generateFallbackQuote(photo) {
    // Fallback quotes when AI is not available
    const fallbackQuotes = [
        "Every photograph is a window into a moment that will never happen again",
        "In photography, the smallest thing can be a great subject",
        "Light makes photography. Embrace light, admire it, love it",
        "Photography is the art of finding the extraordinary in the ordinary",
        "A picture is worth a thousand words, but a great photograph tells an entire story",
        "Through the lens, we capture not just images, but memories and emotions",
        "Photography is about seeing beyond the surface and finding the soul within",
        "Every frame holds the power to stop time and preserve a fleeting moment"
    ];
    
    // Select a random fallback quote
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
}

// AI Quotes Migration Function
async function handleMigrateAIQuotes(request, env) {
    try {
        const migrations = [];
        
        // Create AI quotes table
        try {
            await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS ai_quotes (
                    id TEXT PRIMARY KEY,
                    photo_id TEXT NOT NULL,
                    quote TEXT NOT NULL,
                    is_active INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
                )
            `).run();
            migrations.push('Created ai_quotes table');
        } catch (error) {
            if (!error.message.includes('already exists')) {
                throw error;
            }
            migrations.push('AI quotes table already exists');
        }
        
        // Create indexes
        try {
            await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_ai_quotes_photo_id ON ai_quotes(photo_id)').run();
            await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_ai_quotes_active ON ai_quotes(is_active)').run();
            migrations.push('Created AI quotes indexes');
        } catch (error) {
            migrations.push('AI quotes indexes already exist');
        }
        
        // Check if we need to generate an initial quote
        const existingQuotes = await env.DB.prepare('SELECT COUNT(*) as count FROM ai_quotes').first();
        const photos = await env.DB.prepare('SELECT COUNT(*) as count FROM photos').first();
        
        if (existingQuotes.count === 0 && photos.count > 0) {
            // Generate an initial quote automatically
            try {
                const randomPhoto = await env.DB.prepare(`
                    SELECT id, url, title, description
                    FROM photos
                    ORDER BY RANDOM()
                    LIMIT 1
                `).first();
                
                if (randomPhoto) {
                    const quote = await generateAIQuote(randomPhoto, env);
                    const quoteId = crypto.randomUUID();
                    
                    await env.DB.prepare(`
                        INSERT INTO ai_quotes (id, photo_id, quote, is_active, created_at)
                        VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
                    `).bind(quoteId, randomPhoto.id, quote).run();
                    
                    migrations.push('Generated initial AI quote for hero section');
                }
            } catch (error) {
                console.error('Failed to generate initial quote:', error);
                migrations.push('Failed to generate initial quote (will use default)');
            }
        } else if (existingQuotes.count > 0) {
            migrations.push('AI quotes already populated');
        } else {
            migrations.push('No photos available for quote generation');
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'AI quotes database migration completed',
            migrations: migrations
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('AI quotes migration error:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'AI quotes migration failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// AI Status Check Function
async function handleGetAIStatus(request, env) {
    try {
        const hasOpenAI = !!env.OPENAI_API_KEY;
        
        // Test OpenAI API if key is available
        let openAIWorking = false;
        let error = null;
        
        if (hasOpenAI) {
            try {
                // Simple test request to OpenAI to verify it's working
                const testResponse = await fetch('https://api.openai.com/v1/models', {
                    headers: {
                        'Authorization': `Bearer ${env.OPENAI_API_KEY}`
                    }
                });
                
                openAIWorking = testResponse.ok;
                if (!testResponse.ok) {
                    error = `OpenAI API error: ${testResponse.status} ${testResponse.statusText}`;
                }
            } catch (testError) {
                openAIWorking = false;
                error = `OpenAI API connection failed: ${testError.message}`;
            }
        }
        
        // Check database for existing quotes
        const quotesCount = await env.DB.prepare('SELECT COUNT(*) as count FROM ai_quotes').first();
        const photosCount = await env.DB.prepare('SELECT COUNT(*) as count FROM photos').first();
        
        return new Response(JSON.stringify({
            openai: {
                configured: hasOpenAI,
                working: openAIWorking,
                error: error
            },
            database: {
                quotes: quotesCount?.count || 0,
                photos: photosCount?.count || 0,
                ready: quotesCount?.count > 0
            },
            status: hasOpenAI && openAIWorking ? 'ai_active' : 
                   quotesCount?.count > 0 ? 'quotes_available' : 
                   'fallback_only'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error getting AI status:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            status: 'error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Quote Management Functions
async function handleGetAllQuotes(request, env) {
    try {
        const quotes = await env.DB.prepare(`
            SELECT 
                aq.id as quote_id,
                aq.quote,
                aq.created_at,
                p.id as photo_id,
                p.url as photo_url,
                p.url as photo_thumbnail,
                p.title as photo_title,
                p.description as photo_description
            FROM ai_quotes aq
            JOIN photos p ON aq.photo_id = p.id
            ORDER BY aq.created_at DESC
        `).all();
        
        return new Response(JSON.stringify({
            success: true,
            quotes: quotes.results || [],
            total: quotes.results?.length || 0
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error getting all quotes:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'Failed to get quotes'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleUpdateQuote(request, env) {
    try {
        const { quoteId, quote } = await request.json();
        
        if (!quoteId || !quote) {
            return new Response(JSON.stringify({ 
                error: 'Quote ID and quote text are required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Update the quote in database
        const result = await env.DB.prepare(`
            UPDATE ai_quotes 
            SET quote = ?, created_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(quote, quoteId).run();
        
        if (result.changes === 0) {
            return new Response(JSON.stringify({ 
                error: 'Quote not found' 
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Quote updated successfully'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error updating quote:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'Failed to update quote'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Bulk Quote Generation Function
async function handleUpdateAllQuotes(request, env) {
    try {
        // Get all photos from the gallery
        const photos = await env.DB.prepare(`
            SELECT id, url, title, description
            FROM photos
            ORDER BY upload_date DESC
        `).all();

        if (!photos.results || photos.results.length === 0) {
            return new Response(JSON.stringify({ 
                error: 'No photos available for quote generation',
                processed: 0,
                total: 0
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const allPhotos = photos.results;
        const results = [];
        const errors = [];
        let successCount = 0;

        // Clear all existing quotes to start fresh
        await env.DB.prepare('DELETE FROM ai_quotes').run();

        // Process each photo individually to generate contextual quotes
        for (const photo of allPhotos) {
            try {
                console.log(`Generating quote for photo: ${photo.title || photo.id}`);
                
                // Generate AI quote specifically based on THIS photo's content and metadata
                const quote = await generateAIQuote(photo, env);
                
                if (!quote) {
                    errors.push(`Failed to generate quote for photo: ${photo.title || photo.id}`);
                    continue;
                }

                // Save the photo-specific quote to database
                const quoteId = crypto.randomUUID();
                await env.DB.prepare(`
                    INSERT INTO ai_quotes (id, photo_id, quote, is_active, created_at)
                    VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)
                `).bind(quoteId, photo.id, quote).run();

                successCount++;
                results.push({
                    photoId: photo.id,
                    photoTitle: photo.title || 'Untitled',
                    photoDescription: photo.description || 'No description',
                    quote: quote,
                    status: 'success',
                    isAI: env.OPENAI_API_KEY ? true : false
                });

                // Add small delay to avoid rate limiting OpenAI API
                if (env.OPENAI_API_KEY) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                }

            } catch (photoError) {
                console.error(`Error processing photo ${photo.id}:`, photoError);
                errors.push(`Error processing ${photo.title || photo.id}: ${photoError.message}`);
            }
        }

        // Response with comprehensive results
        const response = {
            success: true,
            total: allPhotos.length,
            generated: successCount,
            errors: errors.length,
            message: `Successfully generated ${successCount} personalized quotes for ${allPhotos.length} photos`,
            usingAI: env.OPENAI_API_KEY ? true : false,
            sampleResults: results.slice(0, 5), // Show first 5 results as preview
            errorDetails: errors.slice(0, 5) // Show first 5 errors if any
        };

        if (errors.length > 0) {
            response.message += ` (${errors.length} errors occurred)`;
        }

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error in bulk quote update:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'Bulk quote update failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}