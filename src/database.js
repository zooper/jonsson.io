/**
 * Database service for photo metadata and EXIF data using Cloudflare D1
 */

export class PhotoDatabase {
    constructor(db) {
        this.db = db;
    }

    /**
     * Save photo with EXIF data to database
     */
    async savePhoto(photoData) {
        const {
            id,
            filename,
            b2FileId,
            b2Filename,
            url,
            fileSize,
            contentType,
            exifData,
            location
        } = photoData;

        const stmt = this.db.prepare(`
            INSERT INTO photos (
                id, filename, title, description, b2_file_id, b2_filename, url, file_size, content_type,
                camera_make, camera_model, camera_software,
                lens_model, focal_length, aperture,
                shutter_speed, iso,
                gps_latitude, gps_longitude, gps_altitude,
                location_city, location_state, location_country, location_full_address,
                date_taken
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        await stmt.bind(
            id,
            filename,
            photoData.title || null,
            photoData.description || null,
            b2FileId,
            b2Filename,
            url,
            fileSize,
            contentType,
            // Camera data
            exifData?.camera?.make || null,
            exifData?.camera?.model || null,
            exifData?.camera?.software || null,
            // Lens data
            exifData?.lens?.model || null,
            exifData?.lens?.focalLength || null,
            exifData?.lens?.aperture || null,
            // Settings
            exifData?.settings?.shutterSpeed || null,
            exifData?.settings?.iso || null,
            // GPS
            exifData?.gps?.latitude || null,
            exifData?.gps?.longitude || null,
            exifData?.gps?.altitude || null,
            // Location
            location?.city || null,
            location?.state || null,
            location?.country || null,
            location?.fullAddress || null,
            // Date - ensure it's a valid timestamp format for SQLite
            exifData?.timestamp ? new Date(exifData.timestamp).toISOString() : null
        ).run();
    }

    /**
     * Get all photos with metadata (legacy method for backward compatibility)
     */
    async listPhotos(limit = 100) {
        const result = await this.listPhotosWithPagination(1, limit);
        return result.photos;
    }

    /**
     * Get photos with pagination support
     */
    async listPhotosWithPagination(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        
        // Get total count
        const countStmt = this.db.prepare(`SELECT COUNT(*) as total FROM photos`);
        const countResult = await countStmt.first();
        const total = countResult.total;
        
        // Get paginated photos
        const stmt = this.db.prepare(`
            SELECT * FROM photos 
            ORDER BY upload_date DESC 
            LIMIT ? OFFSET ?
        `);
        
        const result = await stmt.bind(limit, offset).all();
        const photos = result.results.map(row => this.formatPhotoFromRow(row));
        
        const totalPages = Math.ceil(total / limit);
        
        return {
            photos,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Get a single photo by B2 file ID
     */
    async getPhotoByB2FileId(b2FileId) {
        const stmt = this.db.prepare(`
            SELECT * FROM photos 
            WHERE b2_file_id = ?
        `);
        
        const result = await stmt.bind(b2FileId).first();
        
        return result ? this.formatPhotoFromRow(result) : null;
    }

    /**
     * Delete photo from database
     */
    async deletePhoto(b2FileId) {
        const stmt = this.db.prepare(`
            DELETE FROM photos 
            WHERE b2_file_id = ?
        `);
        
        await stmt.bind(b2FileId).run();
    }

    /**
     * Update EXIF data for existing photo
     */
    async updatePhotoExif(b2FileId, exifData, location = null) {
        const stmt = this.db.prepare(`
            UPDATE photos SET
                camera_make = ?, camera_model = ?, camera_software = ?,
                lens_model = ?, focal_length = ?, aperture = ?,
                shutter_speed = ?, iso = ?,
                gps_latitude = ?, gps_longitude = ?, gps_altitude = ?,
                location_city = ?, location_state = ?, location_country = ?, location_full_address = ?,
                date_taken = ?
            WHERE b2_file_id = ?
        `);

        await stmt.bind(
            // Camera data
            exifData?.camera?.make || null,
            exifData?.camera?.model || null,
            exifData?.camera?.software || null,
            // Lens data
            exifData?.lens?.model || null,
            exifData?.lens?.focalLength || null,
            exifData?.lens?.aperture || null,
            // Settings
            exifData?.settings?.shutterSpeed || null,
            exifData?.settings?.iso || null,
            // GPS
            exifData?.gps?.latitude || null,
            exifData?.gps?.longitude || null,
            exifData?.gps?.altitude || null,
            // Location
            location?.city || null,
            location?.state || null,
            location?.country || null,
            location?.fullAddress || null,
            // Date - ensure it's a valid timestamp format for SQLite
            exifData?.timestamp ? new Date(exifData.timestamp).toISOString() : null,
            // Where clause
            b2FileId
        ).run();
    }

    /**
     * Update photo metadata (title, description)
     */
    async updatePhotoMetadata(b2FileId, updates) {
        // Build dynamic SQL based on which fields are being updated
        const fields = [];
        const values = [];
        
        if ('title' in updates) {
            fields.push('title = ?');
            values.push(updates.title || null);
        }
        
        if ('description' in updates) {
            fields.push('description = ?');
            values.push(updates.description || null);
        }
        
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        
        const sql = `UPDATE photos SET ${fields.join(', ')} WHERE b2_file_id = ?`;
        values.push(b2FileId);
        
        const stmt = this.db.prepare(sql);
        await stmt.bind(...values).run();
    }

    /**
     * Format database row into photo object
     */
    formatPhotoFromRow(row) {
        // Priority for title: 1) Manual title, 2) Manual description, 3) Location, 4) Filename
        let title;
        
        if (row.title && row.title.trim()) {
            // Use manual title if provided (highest priority)
            title = row.title.trim();
        } else if (row.description && row.description.trim()) {
            // Use manual description as title if provided
            title = row.description.trim();
        } else if (row.location_city) {
            // Use city as title
            title = row.location_city;
        } else if (row.location_state || row.location_country) {
            // Use state/country if no city
            const locationParts = [];
            if (row.location_state) locationParts.push(row.location_state);
            if (row.location_country) locationParts.push(row.location_country);
            title = locationParts.join(', ');
        } else {
            // Fallback to filename extraction
            title = this.extractTitleFromFilename(row.filename);
        }
        
        return {
            id: row.b2_file_id, // Use B2 file ID as the external ID
            title: title,
            description: row.description || '',
            url: row.url,
            thumbnail_url: row.url, // Use same URL for now
            uploadDate: row.upload_date,
            exif: this.formatExifFromRow(row)
        };
    }

    /**
     * Format EXIF data from database row
     */
    formatExifFromRow(row) {
        const exif = {};

        // Camera info
        if (row.camera_make || row.camera_model) {
            exif.camera = {
                make: row.camera_make || '',
                model: row.camera_model || '',
                software: row.camera_software || ''
            };
        }

        // Lens info
        if (row.lens_model || row.focal_length || row.aperture) {
            exif.lens = {
                model: row.lens_model || '',
                focalLength: row.focal_length || '',
                aperture: row.aperture || ''
            };
        }

        // Settings
        if (row.shutter_speed || row.iso || row.aperture || row.focal_length) {
            exif.settings = {
                shutterSpeed: row.shutter_speed || '',
                iso: row.iso || '',
                aperture: row.aperture || '',
                focalLength: row.focal_length || ''
            };
        }

        // GPS
        if (row.gps_latitude || row.gps_longitude || row.gps_altitude) {
            exif.gps = {
                latitude: row.gps_latitude,
                longitude: row.gps_longitude,
                altitude: row.gps_altitude
            };
        }

        // Location
        if (row.location_city || row.location_state || row.location_country) {
            exif.location = {
                city: row.location_city || '',
                state: row.location_state || '',
                country: row.location_country || '',
                fullAddress: row.location_full_address || '',
                displayName: this.formatLocationDisplay(row)
            };
        }

        // Date taken - format for display
        if (row.date_taken) {
            try {
                const date = new Date(row.date_taken);
                if (!isNaN(date.getTime())) {
                    exif.dateTaken = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } else {
                    exif.dateTaken = row.date_taken;
                }
            } catch (e) {
                exif.dateTaken = row.date_taken;
            }
        }

        return Object.keys(exif).length > 0 ? exif : null;
    }

    /**
     * Format location for display
     */
    formatLocationDisplay(row) {
        const parts = [];
        
        if (row.location_city) parts.push(row.location_city);
        if (row.location_state) parts.push(row.location_state);
        if (row.location_country) parts.push(row.location_country);
        
        return parts.length > 0 ? parts.join(', ') : null;
    }

    /**
     * Extract title from filename
     */
    extractTitleFromFilename(filename) {
        // Remove path and extension
        let name = filename.split('/').pop().split('.')[0];
        
        // Remove timestamp patterns (like 20250801T195712-k3j9x2)
        name = name.replace(/\d{8}T\d{6}-[a-z0-9]+$/g, '');
        
        // Clean up extra hyphens
        name = name.replace(/[-_]+/g, ' ').trim();
        
        // Convert to title case
        return name
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim() || 'Untitled';
    }
}