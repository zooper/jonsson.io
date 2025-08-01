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
        await photoDb.savePhoto({
            id: crypto.randomUUID(),
            filename: file.name,
            b2FileId: uploadResult.fileId,
            b2Filename: uploadResult.fileName,
            url: uploadResult.url,
            fileSize: file.size,
            contentType: file.type,
            exifData: exifData,
            location: location
        });
        
        return new Response(JSON.stringify({
            success: true,
            filename: uploadResult.fileName,
            url: uploadResult.url,
            fileId: uploadResult.fileId,
            message: 'Photo uploaded successfully'
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
        
        if (!uploadResult.success) {
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
        // Get current profile picture URL
        const currentProfilePicture = await getSetting(env.DB, 'profile_picture');
        
        if (currentProfilePicture) {
            // Initialize storage for deletion
            const storage = new B2Storage(env);
            await storage.authenticate();
            
            // Extract filename from URL and attempt to delete
            try {
                const fileName = currentProfilePicture.split('/').pop();
                await storage.deleteFile(fileName);
            } catch (deleteError) {
                console.warn('Could not delete profile image from storage:', deleteError);
                // Continue anyway to remove the setting
            }
        }
        
        // Remove profile picture setting
        await setSetting(env.DB, 'profile_picture', null);
        
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
            skills: aboutSkills ? JSON.parse(aboutSkills) : ['Portrait Photography', 'Street Photography', 'Landscape', 'Documentary'],
            profilePicture: profilePicture
        };
        
        // Contact settings
        const contactTitle = await getSetting(env.DB, 'contact_title') || "Let's Create Together";
        const contactSubtitle = await getSetting(env.DB, 'contact_subtitle') || "Ready to capture your story? Let's talk about bringing your vision to life.";
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