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
        const startTime = Date.now();
        let response;
        let responseCode = 200;
        
        try {
            const url = new URL(request.url);
            const pathname = url.pathname;

            // Admin routes
            if (pathname.startsWith('/admin')) {
                response = await handleAdminRequest(request, env, pathname);
                responseCode = response.status;
                return response;
            }
            
            // API Routes only - static files handled by Cloudflare Assets
            if (pathname.startsWith('/api/')) {
                response = await handleApiRequest(request, env, pathname);
                responseCode = response.status;
                
                // Track visitor data for non-admin API calls
                const responseTime = Date.now() - startTime;
                await trackVisitor(request, env, responseCode, responseTime);
                
                return response;
            }

            // Let Cloudflare Assets handle static files
            // This includes /, /static/css/style.css, /static/js/gallery.js, etc.
            response = await env.ASSETS.fetch(request);
            responseCode = response.status;
            
            // Handle 404 errors with custom page
            if (response.status === 404) {
                try {
                    const custom404Request = new Request(new URL('/404.html', request.url));
                    const custom404Response = await env.ASSETS.fetch(custom404Request);
                    
                    if (custom404Response.ok) {
                        // Return custom 404 page with proper 404 status
                        response = new Response(custom404Response.body, {
                            status: 404,
                            statusText: 'Not Found',
                            headers: {
                                'Content-Type': 'text/html',
                                'Cache-Control': 'public, max-age=300'
                            }
                        });
                    }
                } catch (error) {
                    console.error('Failed to serve custom 404 page:', error);
                    // Fall back to default 404 if custom page fails
                }
            }
            
            // Track visitor data for public pages (exclude admin)
            const responseTime = Date.now() - startTime;
            await trackVisitor(request, env, responseCode, responseTime);

            return response;

        } catch (error) {
            console.error('Worker error:', error);
            responseCode = 500;
            response = new Response('Internal Server Error', { status: 500 });
            
            // Track error responses too
            const responseTime = Date.now() - startTime;
            await trackVisitor(request, env, responseCode, responseTime);
            
            return response;
        }
    }
};

async function handleAdminRequest(request, env, pathname) {
    // Admin request received
    
    // Authentication check for API routes (skip magic link endpoints)
    if (pathname.startsWith('/admin/api/') && 
        !pathname.includes('/request-magic-link') && 
        !pathname.includes('/verify-magic-link')) {
        
        const authHeader = request.headers.get('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response('Unauthorized', { status: 401 });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer '
        
        // JWT validation only
        const isValidJWT = await validateJWT(token, env);
        if (!isValidJWT) {
            return new Response('Unauthorized', { status: 401 });
        }
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
            
        case '/admin/api/dashboard-stats':
            if (request.method === 'GET') {
                return handleGetDashboardStats(request, env);
            }
            break;
            
            
        case '/admin/api/request-magic-link':
            if (request.method === 'POST') {
                return handleRequestMagicLink(request, env);
            }
            break;
            
        case '/admin/api/verify-magic-link':
            if (request.method === 'POST') {
                return handleVerifyMagicLink(request, env);
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
            
        case '/admin/api/visitor-analytics':
            if (request.method === 'GET') {
                return handleGetVisitorAnalytics(request, env);
            }
            break;
            
        case '/admin/api/generate-test-visitors':
            if (request.method === 'POST') {
                return handleGenerateTestVisitors(request, env);
            }
            break;
            
        case '/admin/api/database-version':
            if (request.method === 'GET') {
                return handleGetDatabaseVersion(request, env);
            }
            break;
            
        case '/admin/api/database-upgrade':
            if (request.method === 'POST') {
                return handleDatabaseUpgrade(request, env);
            }
            break;
            
        case '/admin/api/cloudflare-analytics':
            if (request.method === 'GET') {
                return handleCloudflareAnalytics(request, env);
            }
            break;
            
        case '/admin/api/photos/map-visibility':
            if (request.method === 'PUT') {
                return handleUpdatePhotoMapVisibility(request, env);
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
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response('Unauthorized', { status: 401 });
        }
        
        const token = authHeader.substring(7);
        
        // JWT validation only
        const isValidJWT = await validateJWT(token, env);
        if (!isValidJWT) {
            return new Response('Unauthorized', { status: 401 });
        }
    }

    try {
        switch (pathname) {
            case '/api/photos':
                return handlePhotosRequest(storage, request, env.DB);
            
            case '/api/photos/map':
                return handlePhotosMapRequest(env.DB);
            
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
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        
        // Validate parameters
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, Math.min(100, limit)); // Limit between 1-100
        
        // Get photos from database with pagination
        const photoDb = new PhotoDatabase(db);
        const result = await photoDb.listPhotosWithPagination(validPage, validLimit);
        
        return new Response(JSON.stringify(result), {
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

async function handlePhotosMapRequest(db) {
    try {
        const photoDb = new PhotoDatabase(db);
        const photos = await photoDb.getPhotosForMap();
        
        return new Response(JSON.stringify({
            photos: photos,
            total: photos.length
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=600' // Cache for 10 minutes
            }
        });
    } catch (error) {
        console.error('Error loading photos for map:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to load photos for map',
            photos: []
        }), {
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
    const storage = new B2Storage(env);
    const exifExtractor = new ExifExtractor();
    const photoDb = new PhotoDatabase(env.DB);
    const locationService = new LocationService();
    
    try {
        // Get the uploaded file from FormData
        const formData = await request.formData();
        const file = formData.get('photo');
        
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
        
        // Processing upload...
        
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
            // No EXIF data found, using filename-based metadata
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
            // Generating AI quote for newly uploaded photo
            
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
                // AI quote generated and saved
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
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '25');
        
        // Validate parameters  
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, Math.min(100, limit)); // Limit between 1-100
        
        const photoDb = new PhotoDatabase(env.DB);
        const result = await photoDb.listPhotosWithPagination(validPage, validLimit);
        
        return new Response(JSON.stringify(result), {
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

async function handleUpdatePhotoMapVisibility(request, env) {
    const photoDb = new PhotoDatabase(env.DB);
    
    try {
        const { photoId, showOnMap } = await request.json();
        
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
        
        // Update map visibility
        await photoDb.updatePhotoMapVisibility(photoId, showOnMap);
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Photo map visibility updated successfully'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error updating photo map visibility:', error);
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


// Magic Link Authentication Functions
async function handleRequestMagicLink(request, env) {
    try {
        const { email } = await request.json();
        
        if (!email) {
            return new Response(JSON.stringify({ 
                error: 'Email is required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Verify this is the admin email
        const adminEmail = env.ADMIN_EMAIL;
        if (!adminEmail || email.toLowerCase() !== adminEmail.toLowerCase()) {
            return new Response(JSON.stringify({ 
                error: 'Invalid email address' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Generate secure token
        const token = crypto.randomUUID() + '-' + crypto.randomUUID();
        const tokenId = crypto.randomUUID();
        
        // Set expiration to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        
        // Get request info
        const clientIP = request.headers.get('CF-Connecting-IP') || 
                        request.headers.get('X-Forwarded-For') || 
                        'unknown';
        const userAgent = request.headers.get('User-Agent') || '';
        
        // Clean up expired tokens first
        await env.DB.prepare(`
            DELETE FROM magic_links 
            WHERE expires_at < CURRENT_TIMESTAMP
        `).run();
        
        // Store magic link token
        await env.DB.prepare(`
            INSERT INTO magic_links (id, email, token, expires_at, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(tokenId, email, token, expiresAt, clientIP, userAgent).run();
        
        // Send email with magic link
        const magicLink = `${new URL(request.url).origin}/admin/?token=${token}`;
        await sendMagicLinkEmail(email, magicLink, env);
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Magic link sent to your email address'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Magic link request error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to send magic link' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleVerifyMagicLink(request, env) {
    try {
        const { token } = await request.json();
        
        if (!token) {
            return new Response(JSON.stringify({ 
                error: 'Token is required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Find and verify token
        const magicLink = await env.DB.prepare(`
            SELECT id, email, expires_at, used_at 
            FROM magic_links 
            WHERE token = ?
        `).bind(token).first();
        
        if (!magicLink) {
            return new Response(JSON.stringify({ 
                error: 'Invalid or expired magic link' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Check if already used
        if (magicLink.used_at) {
            return new Response(JSON.stringify({ 
                error: 'Magic link has already been used' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Check if expired
        const now = new Date();
        const expiresAt = new Date(magicLink.expires_at);
        if (now > expiresAt) {
            return new Response(JSON.stringify({ 
                error: 'Magic link has expired' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Mark as used
        await env.DB.prepare(`
            UPDATE magic_links 
            SET used_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).bind(magicLink.id).run();
        
        // Generate JWT session token
        const sessionToken = await generateJWT(magicLink.email, env);
        
        return new Response(JSON.stringify({
            success: true,
            token: sessionToken,
            message: 'Authentication successful'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Magic link verification error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to verify magic link' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function sendMagicLinkEmail(email, magicLink, env) {
    const emailData = {
        from: 'noreply@jonsson.io',
        to: [email],
        subject: 'Admin Login - Jonsson.io Photography',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
                    .content { background: #f8fafc; padding: 30px; border-radius: 12px; margin: 20px 0; }
                    .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; }
                    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
                    .warning { background: #fef3cd; border: 1px solid #fbbf24; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">jonsson.io</div>
                        <h1>Admin Login Request</h1>
                    </div>
                    
                    <div class="content">
                        <p>Hello,</p>
                        <p>You requested access to the admin dashboard for your photography website. Click the button below to log in:</p>
                        
                        <p style="text-align: center; margin: 30px 0;">
                            <a href="${magicLink}" class="button">Access Admin Dashboard</a>
                        </p>
                        
                        <div class="warning">
                            <strong>Security Notice:</strong>
                            <ul>
                                <li>This link expires in 10 minutes</li>
                                <li>It can only be used once</li>
                                <li>If you didn't request this, please ignore this email</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated message from your photography website admin system.</p>
                        <p>The link will expire at ${new Date(Date.now() + 10 * 60 * 1000).toLocaleString()}</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Admin Login Request - Jonsson.io Photography

You requested access to the admin dashboard. Click this link to log in:
${magicLink}

Security Notice:
- This link expires in 10 minutes
- It can only be used once  
- If you didn't request this, please ignore this email

Link expires at: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleString()}
        `
    };
    
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to send email: ${error}`);
    }
    
    return response.json();
}

async function generateJWT(email, env) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    const payload = {
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        iss: 'jonsson.io-admin'
    };
    
    // Base64url encoding (URL-safe base64 without padding)
    const encodedHeader = base64urlEncode(JSON.stringify(header));
    const encodedPayload = base64urlEncode(JSON.stringify(payload));
    
    const secret = env.JWT_SECRET;
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    
    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
    );
    
    const encodedSignature = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)));
    
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function base64urlEncode(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function base64urlDecode(str) {
    // Convert back to standard base64
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding
    const pad = str.length % 4;
    if (pad) {
        str += '='.repeat(4 - pad);
    }
    return atob(str);
}

async function validateJWT(token, env) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return false;
        }
        
        const [encodedHeader, encodedPayload, encodedSignature] = parts;
        
        // Verify signature
        const secret = env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }
        
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );
        
        // Decode signature using base64url decoding
        const signature = new Uint8Array(
            base64urlDecode(encodedSignature)
                .split('')
                .map(c => c.charCodeAt(0))
        );
        
        const isValidSignature = await crypto.subtle.verify(
            'HMAC',
            key,
            signature,
            new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
        );
        
        if (!isValidSignature) {
            return false;
        }
        
        // Parse and validate payload using base64url decoding
        const payload = JSON.parse(base64urlDecode(encodedPayload));
        
        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return false;
        }
        
        // Check issuer
        if (payload.iss !== 'jonsson.io-admin') {
            return false;
        }
        
        // Check email is admin email
        const adminEmail = env.ADMIN_EMAIL;
        if (!adminEmail || payload.email !== adminEmail) {
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.error('JWT validation error:', error);
        return false;
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
        // Removing profile picture setting (file remains in storage)
        
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

// Dashboard Stats Function
async function handleGetDashboardStats(request, env) {
    try {
        // Get total counts directly from database
        const [photosCount, quotesCount, themesResponse] = await Promise.all([
            env.DB.prepare('SELECT COUNT(*) as count FROM photos').first(),
            env.DB.prepare('SELECT COUNT(*) as count FROM ai_quotes').first(),
            getSetting(env.DB, 'active_theme')
        ]);

        const totalPhotos = photosCount?.count || 0;
        const totalQuotes = quotesCount?.count || 0;
        const estimatedStorage = totalPhotos * 2.5; // Rough estimate: 2.5MB per photo
        const activeTheme = themesResponse || 'modern';

        return new Response(JSON.stringify({
            photos: totalPhotos,
            quotes: totalQuotes,
            storage: `${estimatedStorage.toFixed(1)}MB`,
            theme: activeTheme
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return new Response(JSON.stringify({
            error: error.message
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
                // Generating quote for photo
                
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

// Visitor Analytics Functions

async function isAdminRequest(request, env) {
    // Check if request has valid JWT token
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    
    const token = authHeader.substring(7);
    
    try {
        return await validateJWT(token, env);
    } catch (error) {
        return false;
    }
}

async function trackVisitor(request, env, responseCode = 200, responseTime = 0) {
    try {
        const url = new URL(request.url);
        
        // Skip tracking for admin pages, admin API calls, and asset files
        if (url.pathname.startsWith('/admin') || 
            url.pathname.startsWith('/static') ||
            url.pathname.includes('.css') ||
            url.pathname.includes('.js') ||
            url.pathname.includes('.ico') ||
            url.pathname.includes('.png') ||
            url.pathname.includes('.jpg') ||
            url.pathname.includes('.jpeg') ||
            url.pathname.includes('.gif') ||
            url.pathname.includes('.svg') ||
            url.pathname.includes('.woff') ||
            url.pathname.includes('.ttf')) {
            return;
        }
        
        // Skip tracking if request is from admin user
        if (await isAdminRequest(request, env)) {
            return;
        }

        // Get visitor info from Cloudflare's request object
        const cf = request.cf || {};
        const userAgent = request.headers.get('User-Agent') || '';
        const referer = request.headers.get('Referer') || '';
        
        // Hash IP for privacy (GDPR compliant)
        const clientIP = request.headers.get('CF-Connecting-IP') || 
                        request.headers.get('X-Forwarded-For') || 
                        'unknown';
        const ipHash = await hashIP(clientIP);
        
        // Parse user agent for device info
        const deviceInfo = parseUserAgent(userAgent);
        
        // Check if this is an existing session (within last 30 minutes)
        const existingSession = await env.DB.prepare(`
            SELECT id, page_views FROM visitor_sessions 
            WHERE ip_hash = ? AND session_start > datetime('now', '-30 minutes')
            ORDER BY session_start DESC LIMIT 1
        `).bind(ipHash).first();
        
        let sessionId;
        
        if (existingSession) {
            // Update existing session with latest browser info if available
            sessionId = existingSession.id;
            
            await env.DB.prepare(`
                UPDATE visitor_sessions 
                SET page_views = page_views + 1, 
                    session_end = CURRENT_TIMESTAMP,
                    browser = ?,
                    device_type = ?,
                    os = ?,
                    user_agent = ?
                WHERE id = ?
            `).bind(deviceInfo.browser, deviceInfo.deviceType, deviceInfo.os, userAgent, sessionId).run();
            
        } else {
            // Create new session
            sessionId = crypto.randomUUID();
            
            await env.DB.prepare(`
                INSERT INTO visitor_sessions (
                    id, ip_hash, session_start, session_end, user_agent, 
                    country_code, country_name, city, region, browser, 
                    device_type, os, referrer, page_views
                ) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            `).bind(
                sessionId, ipHash, userAgent,
                cf.country || 'Unknown',
                cf.country || 'Unknown', 
                cf.city || 'Unknown',
                cf.region || 'Unknown',
                deviceInfo.browser,
                deviceInfo.deviceType,
                deviceInfo.os,
                referer
            ).run();
        }
        
        // Record page view with response code and timing
        const pageViewId = crypto.randomUUID();
        await env.DB.prepare(`
            INSERT INTO page_views (id, session_id, page_url, page_title, viewed_at, response_code, response_time_ms)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
        `).bind(pageViewId, sessionId, url.pathname, getPageTitle(url.pathname), responseCode, responseTime).run();
        
    } catch (error) {
        // Don't fail the request if analytics tracking fails
        console.error('Visitor tracking error:', error);
    }
}

async function hashIP(ip) {
    // Hash IP address for privacy compliance
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + 'salt_for_privacy');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase();
    
    // Browser detection - improved patterns
    let browser = 'Unknown';
    if (ua.includes('firefox/') && !ua.includes('seamonkey')) {
        browser = 'Firefox';
    } else if (ua.includes('edg/')) {
        browser = 'Edge';
    } else if (ua.includes('chrome/') && !ua.includes('edg/') && !ua.includes('opr/')) {
        browser = 'Chrome';
    } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
        browser = 'Safari';
    } else if (ua.includes('opr/') || ua.includes('opera/')) {
        browser = 'Opera';
    } else if (ua.includes('curl/')) {
        browser = 'cURL';
    } else if (ua.includes('wget/')) {
        browser = 'Wget';
    }
    
    // Device type detection - improved patterns
    let deviceType = 'Desktop';
    if (ua.includes('mobile') || ua.includes('android') && ua.includes('mobile')) {
        deviceType = 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))) {
        deviceType = 'Tablet';
    }
    
    // OS detection - improved patterns  
    let os = 'Unknown';
    if (ua.includes('windows nt')) {
        const version = ua.match(/windows nt ([\d.]+)/);
        if (version) {
            const ntVersion = version[1];
            if (ntVersion === '10.0') os = 'Windows 10/11';
            else if (ntVersion === '6.3') os = 'Windows 8.1';
            else if (ntVersion === '6.2') os = 'Windows 8';
            else if (ntVersion === '6.1') os = 'Windows 7';
            else os = 'Windows';
        } else {
            os = 'Windows';
        }
    } else if (ua.includes('mac os x') || ua.includes('macos')) {
        os = 'macOS';
    } else if (ua.includes('iphone os') || ua.includes('cpu os')) {
        os = 'iOS';
    } else if (ua.includes('android')) {
        const version = ua.match(/android ([\d.]+)/);
        os = version ? `Android ${version[1].split('.')[0]}` : 'Android';
    } else if (ua.includes('linux')) {
        if (ua.includes('ubuntu')) os = 'Ubuntu';
        else if (ua.includes('debian')) os = 'Debian';
        else if (ua.includes('fedora')) os = 'Fedora';
        else if (ua.includes('centos')) os = 'CentOS';
        else os = 'Linux';
    } else if (ua.includes('curl')) {
        os = 'CLI Tool';
    }
    
    return { browser, deviceType, os };
}

function getPageTitle(pathname) {
    switch (pathname) {
        case '/': return 'Gallery';
        case '/about': return 'About';
        case '/contact': return 'Contact';
        default: return 'Page';
    }
}

async function handleGetVisitorAnalytics(request, env) {
    try {
        const url = new URL(request.url);
        const period = url.searchParams.get('period') || '30'; // days
        
        // Get visitor overview stats for current period
        const overviewQuery = `
            SELECT 
                COUNT(DISTINCT id) as unique_visitors,
                SUM(page_views) as total_page_views,
                AVG(CAST((julianday(session_end) - julianday(session_start)) * 24 * 60 * 60 AS INTEGER)) as avg_duration_seconds,
                COUNT(CASE WHEN device_type = 'Mobile' THEN 1 END) * 100.0 / COUNT(*) as mobile_percentage
            FROM visitor_sessions 
            WHERE session_start > datetime('now', '-${period} days')
        `;
        
        const overview = await env.DB.prepare(overviewQuery).first();
        
        // Get comparison data from previous period for growth metrics
        const previousPeriodQuery = `
            SELECT 
                COUNT(DISTINCT id) as previous_visitors,
                SUM(page_views) as previous_page_views
            FROM visitor_sessions 
            WHERE session_start > datetime('now', '-${period * 2} days') 
            AND session_start <= datetime('now', '-${period} days')
        `;
        
        const previousPeriod = await env.DB.prepare(previousPeriodQuery).first();
        
        // Get popular pages
        const popularPages = await env.DB.prepare(`
            SELECT page_url, page_title, COUNT(*) as views
            FROM page_views pv
            JOIN visitor_sessions vs ON pv.session_id = vs.id
            WHERE vs.session_start > datetime('now', '-${period} days')
            GROUP BY page_url, page_title
            ORDER BY views DESC
            LIMIT 10
        `).all();
        
        // Get geographic distribution
        const geoData = await env.DB.prepare(`
            SELECT country_code, country_name, COUNT(*) as visitors
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-${period} days')
            GROUP BY country_code, country_name
            ORDER BY visitors DESC
            LIMIT 10
        `).all();
        
        // Get technology breakdown
        const browserData = await env.DB.prepare(`
            SELECT browser, COUNT(*) as count
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-${period} days')
            GROUP BY browser
            ORDER BY count DESC
        `).all();
        
        const deviceData = await env.DB.prepare(`
            SELECT device_type, COUNT(*) as count
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-${period} days')
            GROUP BY device_type
            ORDER BY count DESC
        `).all();
        
        const osData = await env.DB.prepare(`
            SELECT os, COUNT(*) as count
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-${period} days')
            GROUP BY os
            ORDER BY count DESC
        `).all();
        
        // Get hourly visit timeline for last 24 hours
        const timelineData = await env.DB.prepare(`
            SELECT 
                strftime('%H', session_start) as hour,
                COUNT(*) as visits
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-1 day')
            GROUP BY strftime('%H', session_start)
            ORDER BY hour
        `).all();
        
        // Get recent visitors (last 10)
        const recentVisitors = await env.DB.prepare(`
            SELECT 
                city, country_name, browser, device_type, 
                session_start, 
                CAST((julianday(session_end) - julianday(session_start)) * 24 * 60 * 60 AS INTEGER) as duration_seconds
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-1 day')
            ORDER BY session_start DESC
            LIMIT 10
        `).all();
        
        // Get current live sessions (active in last 5 minutes)
        const liveSessions = await env.DB.prepare(`
            SELECT COUNT(*) as count
            FROM visitor_sessions
            WHERE session_end > datetime('now', '-5 minutes')
        `).first();
        
        // Get response code statistics
        const responseCodeData = await env.DB.prepare(`
            SELECT response_code, COUNT(*) as count
            FROM page_views pv
            JOIN visitor_sessions vs ON pv.session_id = vs.id
            WHERE vs.session_start > datetime('now', '-${period} days')
            GROUP BY response_code
            ORDER BY count DESC
        `).all();
        
        // Get detailed response code breakdown by page
        const responseCodeDetails = await env.DB.prepare(`
            SELECT 
                response_code, 
                page_url, 
                page_title,
                COUNT(*) as count
            FROM page_views pv
            JOIN visitor_sessions vs ON pv.session_id = vs.id
            WHERE vs.session_start > datetime('now', '-${period} days')
            GROUP BY response_code, page_url, page_title
            ORDER BY response_code, count DESC
        `).all();
        
        // Get average response time
        const avgResponseTime = await env.DB.prepare(`
            SELECT AVG(response_time_ms) as avg_time
            FROM page_views pv
            JOIN visitor_sessions vs ON pv.session_id = vs.id
            WHERE vs.session_start > datetime('now', '-${period} days')
        `).first();
        
        // Get daily visitor trends for the period
        const dailyTrendsQuery = `
            SELECT 
                DATE(session_start) as date,
                COUNT(DISTINCT id) as unique_visitors,
                SUM(page_views) as page_views,
                COUNT(*) as sessions
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-${period} days')
            GROUP BY DATE(session_start)
            ORDER BY date ASC
        `;
        
        const dailyTrends = await env.DB.prepare(dailyTrendsQuery).all();
        
        // Get weekly trends (last 12 weeks)
        const weeklyTrendsQuery = `
            SELECT 
                strftime('%Y-W%W', session_start) as week,
                COUNT(DISTINCT id) as unique_visitors,
                SUM(page_views) as page_views,
                COUNT(*) as sessions
            FROM visitor_sessions
            WHERE session_start > datetime('now', '-84 days')
            GROUP BY strftime('%Y-W%W', session_start)
            ORDER BY week ASC
        `;
        
        const weeklyTrends = await env.DB.prepare(weeklyTrendsQuery).all();
        
        // Calculate growth metrics
        const currentVisitors = overview?.unique_visitors || 0;
        const previousVisitors = previousPeriod?.previous_visitors || 0;
        const currentPageViews = overview?.total_page_views || 0;
        const previousPageViews = previousPeriod?.previous_page_views || 0;
        
        const visitorGrowth = previousVisitors > 0 ? 
            Math.round(((currentVisitors - previousVisitors) / previousVisitors) * 100) : 0;
        const pageViewGrowth = previousPageViews > 0 ? 
            Math.round(((currentPageViews - previousPageViews) / previousPageViews) * 100) : 0;
        
        return new Response(JSON.stringify({
            overview: {
                totalVisitors: currentVisitors,
                pageViews: currentPageViews,
                avgDuration: formatDuration(overview?.avg_duration_seconds || 0),
                mobilePercentage: Math.round(overview?.mobile_percentage || 0),
                visitorGrowth: visitorGrowth,
                pageViewGrowth: pageViewGrowth,
                previousPeriodVisitors: previousVisitors,
                previousPeriodPageViews: previousPageViews,
                avgResponseTime: Math.round(avgResponseTime?.avg_time || 0)
            },
            liveSessions: liveSessions?.count || 0,
            popularPages: popularPages.results || [],
            geographic: geoData.results || [],
            technology: {
                browsers: browserData.results || [],
                devices: deviceData.results || [],
                os: osData.results || []
            },
            responseCodes: responseCodeData.results || [],
            responseCodeDetails: responseCodeDetails.results || [],
            timeline: timelineData.results || [],
            recentVisitors: (recentVisitors.results || []).map(visitor => ({
                ...visitor,
                formattedDuration: formatDuration(visitor.duration_seconds)
            })),
            trends: {
                daily: dailyTrends.results || [],
                weekly: weeklyTrends.results || [],
                period: parseInt(period)
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error getting visitor analytics:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Test Data Generation Function (for development only)
async function handleGenerateTestVisitors(request, env) {
    try {
        const { count = 10 } = await request.json();
        
        // Sample user agents for different browsers and devices
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
        ];
        
        const countries = [
            { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston'] },
            { code: 'GB', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool'] },
            { code: 'DE', name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'] },
            { code: 'FR', name: 'France', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse'] },
            { code: 'CA', name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] },
            { code: 'AU', name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
            { code: 'JP', name: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'] },
            { code: 'SE', name: 'Sweden', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala'] }
        ];
        
        const pages = ['/', '/about', '/contact'];
        
        const createdSessions = [];
        
        for (let i = 0; i < count; i++) {
            // Generate random session data
            const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
            const deviceInfo = parseUserAgent(userAgent);
            const country = countries[Math.floor(Math.random() * countries.length)];
            const city = country.cities[Math.floor(Math.random() * country.cities.length)];
            
            // Generate random IP hash (simulate different IPs)
            const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            const ipHash = await hashIP(randomIP);
            
            // Random session timing (last 7 days)
            const now = new Date();
            const sessionStart = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
            const sessionDuration = Math.floor(Math.random() * 600) + 30; // 30 seconds to 10 minutes
            const sessionEnd = new Date(sessionStart.getTime() + sessionDuration * 1000);
            const pageViewCount = Math.floor(Math.random() * 5) + 1; // 1-5 page views
            
            // Create session
            const sessionId = crypto.randomUUID();
            
            await env.DB.prepare(`
                INSERT INTO visitor_sessions (
                    id, ip_hash, session_start, session_end, user_agent,
                    country_code, country_name, city, region, browser,
                    device_type, os, referrer, page_views
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                sessionId, ipHash, sessionStart.toISOString(), sessionEnd.toISOString(), userAgent,
                country.code, country.name, city, country.name,
                deviceInfo.browser, deviceInfo.deviceType, deviceInfo.os,
                '', pageViewCount
            ).run();
            
            // Create page views for this session
            for (let j = 0; j < pageViewCount; j++) {
                const page = pages[Math.floor(Math.random() * pages.length)];
                const pageTitle = getPageTitle(page);
                const viewTime = new Date(sessionStart.getTime() + (j * sessionDuration * 1000 / pageViewCount));
                
                const pageViewId = crypto.randomUUID();
                await env.DB.prepare(`
                    INSERT INTO page_views (id, session_id, page_url, page_title, viewed_at)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(pageViewId, sessionId, page, pageTitle, viewTime.toISOString()).run();
            }
            
            createdSessions.push({
                sessionId,
                browser: deviceInfo.browser,
                device: deviceInfo.deviceType,
                os: deviceInfo.os,
                country: country.name,
                city,
                pageViews: pageViewCount
            });
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: `Generated ${count} test visitor sessions`,
            sessions: createdSessions
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error generating test visitors:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Database Version Management Functions
async function handleGetDatabaseVersion(request, env) {
    try {
        // Get current database version
        const currentVersion = await env.DB.prepare(`
            SELECT version, applied_at, description 
            FROM database_version 
            ORDER BY version DESC 
            LIMIT 1
        `).first();
        
        // Check if any schema changes are needed
        const targetVersion = 4; // Current target version from schema.sql
        const needsUpgrade = !currentVersion || currentVersion.version < targetVersion;
        
        // Get migration history
        const migrationHistory = await env.DB.prepare(`
            SELECT version, applied_at, description 
            FROM database_version 
            ORDER BY version DESC
        `).all();
        
        return new Response(JSON.stringify({
            current: {
                version: currentVersion?.version || 0,
                appliedAt: currentVersion?.applied_at || null,
                description: currentVersion?.description || 'No version found'
            },
            target: {
                version: targetVersion,
                description: 'Base schema with visitor analytics and response code tracking'
            },
            needsUpgrade: needsUpgrade,
            availableUpgrades: needsUpgrade ? [{
                fromVersion: currentVersion?.version || 0,
                toVersion: targetVersion,
                description: 'Update to latest schema with visitor analytics and response code tracking',
                changes: [
                    'Add visitor_sessions table',
                    'Add page_views table with response code tracking',
                    'Add database version tracking',
                    'Create optimized indexes for analytics queries'
                ]
            }] : [],
            migrationHistory: migrationHistory.results || []
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error getting database version:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'Failed to get database version information'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleDatabaseUpgrade(request, env) {
    try {
        const { targetVersion } = await request.json();
        
        if (!targetVersion || typeof targetVersion !== 'number') {
            return new Response(JSON.stringify({ 
                error: 'Target version must be specified as a number' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Get current version
        const currentVersionRow = await env.DB.prepare(`
            SELECT version FROM database_version ORDER BY version DESC LIMIT 1
        `).first();
        
        const currentVersion = currentVersionRow?.version || 0;
        
        if (currentVersion >= targetVersion) {
            return new Response(JSON.stringify({ 
                success: false,
                message: `Database is already at version ${currentVersion}, no upgrade needed to version ${targetVersion}`
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const migrations = [];
        let migratedToVersion = currentVersion;
        
        // Migration from version 0 to 3 (full schema setup)
        if (currentVersion < 3) {
            try {
                // Create visitor analytics tables
                await env.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS visitor_sessions (
                        id TEXT PRIMARY KEY,
                        ip_hash TEXT NOT NULL,
                        session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
                        session_end DATETIME,
                        user_agent TEXT,
                        country_code TEXT,
                        country_name TEXT,
                        city TEXT,
                        region TEXT,
                        browser TEXT,
                        device_type TEXT,
                        os TEXT,
                        referrer TEXT,
                        page_views INTEGER DEFAULT 0,
                        duration_seconds INTEGER DEFAULT 0
                    )
                `).run();
                migrations.push('Created visitor_sessions table');
                
                await env.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS page_views (
                        id TEXT PRIMARY KEY,
                        session_id TEXT NOT NULL,
                        page_url TEXT NOT NULL,
                        page_title TEXT,
                        viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        time_on_page INTEGER DEFAULT 0,
                        response_code INTEGER DEFAULT 200,
                        response_time_ms INTEGER DEFAULT 0,
                        FOREIGN KEY (session_id) REFERENCES visitor_sessions(id) ON DELETE CASCADE
                    )
                `).run();
                migrations.push('Created page_views table with response code tracking');
                
                // Create indexes for performance
                const indexes = [
                    'CREATE INDEX IF NOT EXISTS idx_visitor_sessions_start ON visitor_sessions(session_start)',
                    'CREATE INDEX IF NOT EXISTS idx_visitor_sessions_country ON visitor_sessions(country_code)',
                    'CREATE INDEX IF NOT EXISTS idx_visitor_sessions_device ON visitor_sessions(device_type)',
                    'CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id)',
                    'CREATE INDEX IF NOT EXISTS idx_page_views_url ON page_views(page_url)',
                    'CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at)',
                    'CREATE INDEX IF NOT EXISTS idx_page_views_response_code ON page_views(response_code)'
                ];
                
                for (const indexSQL of indexes) {
                    await env.DB.prepare(indexSQL).run();
                }
                migrations.push('Created analytics performance indexes');
                
                // Update to version 3
                await env.DB.prepare(`
                    INSERT OR REPLACE INTO database_version (id, version, description, applied_at)
                    VALUES (1, 3, 'Analytics schema upgrade - visitor tracking and response codes', CURRENT_TIMESTAMP)
                `).run();
                
                migratedToVersion = 3;
                migrations.push('Updated database to version 3');
                
            } catch (migrationError) {
                console.error('Migration error:', migrationError);
                return new Response(JSON.stringify({ 
                    error: `Migration failed: ${migrationError.message}`,
                    completedMigrations: migrations
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        // Migration from version 3 to 4 (magic links)
        if (currentVersion < 4 && targetVersion >= 4) {
            try {
                // Create magic_links table
                await env.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS magic_links (
                        id TEXT PRIMARY KEY,
                        email TEXT NOT NULL,
                        token TEXT NOT NULL UNIQUE,
                        expires_at DATETIME NOT NULL,
                        used_at DATETIME,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        ip_address TEXT,
                        user_agent TEXT
                    )
                `).run();
                migrations.push('Created magic_links table');
                
                // Create indexes for magic links
                const magicLinkIndexes = [
                    'CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token)',
                    'CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email)',
                    'CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at)'
                ];
                
                for (const indexSQL of magicLinkIndexes) {
                    await env.DB.prepare(indexSQL).run();
                }
                migrations.push('Created magic_links indexes');
                
                // Update to version 4
                await env.DB.prepare(`
                    INSERT OR REPLACE INTO database_version (id, version, description, applied_at)
                    VALUES (1, 4, 'Add magic link authentication system', CURRENT_TIMESTAMP)
                `).run();
                
                migratedToVersion = 4;
                migrations.push('Updated database to version 4');
                
            } catch (migrationError) {
                console.error('Migration to version 4 error:', migrationError);
                return new Response(JSON.stringify({ 
                    error: `Migration to version 4 failed: ${migrationError.message}`,
                    completedMigrations: migrations
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: `Database successfully upgraded from version ${currentVersion} to version ${migratedToVersion}`,
            fromVersion: currentVersion,
            toVersion: migratedToVersion,
            migrations: migrations,
            timestamp: new Date().toISOString()
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Error during database upgrade:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'Database upgrade failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Cloudflare Analytics Integration Functions
async function handleCloudflareAnalytics(request, env) {
    try {
        const url = new URL(request.url);
        const period = url.searchParams.get('period') || '30'; // days
        const zoneId = env.CLOUDFLARE_ZONE_ID;
        const apiToken = env.CLOUDFLARE_API_TOKEN;
        
        if (!zoneId || !apiToken) {
            return new Response(JSON.stringify({ 
                error: 'Cloudflare credentials not configured',
                message: 'Please set CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN environment variables'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));
        
        const since = startDate.toISOString();
        const until = endDate.toISOString();
        
        // Simplified GraphQL query to test available fields
        const query = `
        query {
            viewer {
                zones(filter: {zoneTag: "${zoneId}"}) {
                    # Basic HTTP Requests Timeline
                    httpRequests1dGroups(
                        limit: 30,
                        filter: {
                            date_geq: "${since.split('T')[0]}"
                            date_leq: "${until.split('T')[0]}"
                        }
                        orderBy: [date_ASC]
                    ) {
                        dimensions {
                            date
                        }
                        sum {
                            browserMap {
                                pageViews
                                uaBrowserFamily
                            }
                            bytes
                            cachedBytes
                            cachedRequests
                            countryMap {
                                bytes
                                requests
                                threats
                                clientCountryName
                            }
                            encryptedBytes
                            encryptedRequests
                            pageViews
                            requests
                            responseStatusMap {
                                edgeResponseStatus
                                requests
                            }
                            threats
                        }
                        uniq {
                            uniques
                        }
                    }
                }
            }
        }`;
        
        // Call Cloudflare GraphQL API
        const cfResponse = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        
        if (!cfResponse.ok) {
            const errorText = await cfResponse.text();
            console.error('Cloudflare API error:', cfResponse.status, errorText);
            return new Response(JSON.stringify({ 
                error: 'Failed to fetch Cloudflare analytics',
                details: errorText
            }), {
                status: cfResponse.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const cfData = await cfResponse.json();
        
        if (cfData.errors) {
            console.error('GraphQL errors:', cfData.errors);
            return new Response(JSON.stringify({ 
                error: 'GraphQL query failed',
                details: cfData.errors
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Process and format the data
        const zoneData = cfData.data?.viewer?.zones?.[0];
        if (!zoneData) {
            return new Response(JSON.stringify({ 
                error: 'No zone data found',
                message: 'Check your CLOUDFLARE_ZONE_ID'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Combine your database analytics with Cloudflare data
        const [dbAnalytics] = await Promise.all([
            getVisitorAnalyticsFromDB(env, period)
        ]);
        
        // Format response combining both data sources
        const analytics = {
            period: parseInt(period),
            cloudflare: {
                overview: calculateCloudflareOverview(zoneData.httpRequests1dGroups),
                timeline: formatTimelineData(zoneData.httpRequests1dGroups),
                geographic: formatGeographicData(zoneData.httpRequests1dGroups),
                security: formatSecurityData(zoneData.httpRequests1dGroups),
                performance: formatPerformanceData(zoneData.httpRequests1dGroups)
            },
            database: dbAnalytics,
            comparison: compareDataSources(zoneData.httpRequests1dGroups, dbAnalytics)
        };
        
        return new Response(JSON.stringify(analytics), {
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });
        
    } catch (error) {
        console.error('Error fetching Cloudflare analytics:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            message: 'Failed to fetch analytics data'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function getVisitorAnalyticsFromDB(env, period) {
    try {
        // Get basic overview from your existing database
        const overview = await env.DB.prepare(`
            SELECT 
                COUNT(DISTINCT id) as unique_visitors,
                SUM(page_views) as total_page_views,
                AVG(CAST((julianday(session_end) - julianday(session_start)) * 24 * 60 * 60 AS INTEGER)) as avg_duration_seconds
            FROM visitor_sessions 
            WHERE session_start > datetime('now', '-${period} days')
        `).first();
        
        return {
            overview: overview || { unique_visitors: 0, total_page_views: 0, avg_duration_seconds: 0 }
        };
    } catch (error) {
        console.error('Error getting DB analytics:', error);
        return { overview: { unique_visitors: 0, total_page_views: 0, avg_duration_seconds: 0 } };
    }
}

function calculateCloudflareOverview(timelineData) {
    if (!timelineData || timelineData.length === 0) {
        return {
            totalRequests: 0,
            totalBytes: 0,
            totalPageViews: 0,
            totalUniques: 0,
            cacheHitRate: 0,
            threatsStopped: 0,
            bandwidth: '0 Bytes'
        };
    }
    
    const totals = timelineData.reduce((acc, day) => {
        acc.requests += day.sum.requests || 0;
        acc.bytes += day.sum.bytes || 0;
        acc.pageViews += day.sum.pageViews || 0;
        acc.cachedRequests += day.sum.cachedRequests || 0;
        acc.threats += day.sum.threats || 0;
        acc.uniques += (day.uniq && day.uniq.uniques) || 0;
        return acc;
    }, {
        requests: 0,
        bytes: 0,
        pageViews: 0,
        cachedRequests: 0,
        threats: 0,
        uniques: 0
    });
    
    const cacheHitRate = totals.requests > 0 ? (totals.cachedRequests / totals.requests * 100) : 0;
    
    return {
        totalRequests: totals.requests,
        totalBytes: totals.bytes,
        totalPageViews: totals.pageViews,
        totalUniques: totals.uniques,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        threatsStopped: totals.threats,
        bandwidth: formatBytes(totals.bytes)
    };
}

function formatTimelineData(timelineData) {
    if (!timelineData) return [];
    
    return timelineData.map(day => ({
        date: day.dimensions.date,
        requests: day.sum.requests || 0,
        pageViews: day.sum.pageViews || 0,
        bytes: day.sum.bytes || 0,
        uniques: day.uniq.uniques || 0,
        threats: day.sum.threats || 0,
        cacheHitRate: day.sum.requests > 0 ? 
            Math.round((day.sum.cachedRequests / day.sum.requests) * 100) : 0
    }));
}

function formatGeographicData(timelineData) {
    if (!timelineData) return [];
    
    // Extract country data from countryMap in the timeline data
    const countryMap = new Map();
    
    timelineData.forEach(day => {
        if (day.sum.countryMap && Array.isArray(day.sum.countryMap)) {
            day.sum.countryMap.forEach(countryData => {
                const country = countryData.clientCountryName || 'Unknown';
                if (countryMap.has(country)) {
                    const existing = countryMap.get(country);
                    existing.requests += countryData.requests || 0;
                    existing.bytes += countryData.bytes || 0;
                    existing.threats += countryData.threats || 0;
                } else {
                    countryMap.set(country, {
                        country: country,
                        requests: countryData.requests || 0,
                        bytes: countryData.bytes || 0,
                        threats: countryData.threats || 0
                    });
                }
            });
        }
    });
    
    return Array.from(countryMap.values())
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 10);
}

function formatSecurityData(timelineData) {
    if (!timelineData) return { actions: [], sources: [], total: 0 };
    
    // Extract security data from timeline data
    let total = 0;
    
    timelineData.forEach(day => {
        total += day.sum.threats || 0;
    });
    
    return {
        total: total,
        actions: [{ action: 'threats', count: total }],
        sources: [{ source: 'firewall', count: total }]
    };
}

function formatPerformanceData(timelineData) {
    if (!timelineData) return { statusCodes: [], methods: [], avgResponseTime: 0 };
    
    // Extract performance data from responseStatusMap in timeline data
    const statusCodes = new Map();
    
    timelineData.forEach(day => {
        if (day.sum.responseStatusMap && Array.isArray(day.sum.responseStatusMap)) {
            day.sum.responseStatusMap.forEach(statusData => {
                const status = statusData.edgeResponseStatus || 'unknown';
                const requests = statusData.requests || 0;
                statusCodes.set(status, (statusCodes.get(status) || 0) + requests);
            });
        }
    });
    
    return {
        statusCodes: Array.from(statusCodes.entries())
            .map(([status, count]) => ({ status, count }))
            .sort((a, b) => b.count - a.count),
        methods: [{ method: 'GET', count: 0 }], // Simplified for now
        avgResponseTime: 0 // Will need separate query for response times
    };
}

function compareDataSources(cfData, dbData) {
    const cfTotal = cfData?.reduce((sum, day) => sum + (day.sum.pageViews || 0), 0) || 0;
    const dbTotal = dbData?.overview?.total_page_views || 0;
    
    return {
        cloudflarePageViews: cfTotal,
        databasePageViews: dbTotal,
        difference: cfTotal - dbTotal,
        accuracy: dbTotal > 0 ? Math.round((dbTotal / cfTotal) * 100) : 0
    };
}

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}