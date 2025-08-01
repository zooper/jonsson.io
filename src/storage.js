/**
 * Backblaze B2 Storage Integration
 */

export class B2Storage {
    constructor(env) {
        this.keyId = env.B2_APPLICATION_KEY_ID;
        this.applicationKey = env.B2_APPLICATION_KEY;
        this.bucketId = env.B2_BUCKET_ID;
        this.bucketName = env.B2_BUCKET_NAME;
        this.authToken = null;
        this.downloadUrl = null;
        this.apiUrl = null;
    }

    async authenticate() {
        // Always re-authenticate for uploads to avoid token expiry issues
        // if (this.authToken && this.downloadUrl && this.apiUrl) {
        //     return;
        // }

        const credentials = btoa(`${this.keyId}:${this.applicationKey}`);
        
        const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to authenticate with Backblaze B2');
        }

        const data = await response.json();
        this.authToken = data.authorizationToken;
        this.downloadUrl = data.downloadUrl;
        this.apiUrl = data.apiUrl;
    }

    async listFiles(prefix = '', limit = 100) {
        await this.authenticate();

        const response = await fetch(`${this.apiUrl}/b2api/v2/b2_list_file_names`, {
            method: 'POST',
            headers: {
                'Authorization': this.authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bucketId: this.bucketId,
                prefix: prefix,
                maxFileCount: limit
            })
        });

        if (!response.ok) {
            throw new Error('Failed to list files from Backblaze B2');
        }

        const data = await response.json();
        return data.files.map(file => ({
            id: file.fileId,
            name: file.fileName,
            size: file.contentLength,
            uploadTimestamp: file.uploadTimestamp,
            url: `${this.downloadUrl}/file/${this.bucketName}/${file.fileName}`,
            exif: this.extractExifFromFileInfo(file.fileInfo || {}),
            rawFileInfo: file.fileInfo || {} // Keep raw data for debugging
        }));
    }

    async getFileInfo(fileName) {
        await this.authenticate();
        
        const files = await this.listFiles(fileName, 1);
        return files.find(file => file.name === fileName);
    }

    getPublicUrl(fileName) {
        return `${this.downloadUrl}/file/${this.bucketName}/${fileName}`;
    }

    // Helper method to check if file is an image
    isImage(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    // Extract EXIF data from B2 file info
    extractExifFromFileInfo(fileInfo) {
        const exif = {};
        
        // Camera info
        if (fileInfo.camera_make || fileInfo.camera_model) {
            exif.camera = {
                make: fileInfo.camera_make || '',
                model: fileInfo.camera_model || ''
            };
        }
        
        // Lens info
        if (fileInfo.lens_model || fileInfo.focal_length || fileInfo.aperture) {
            exif.lens = {
                model: fileInfo.lens_model || '',
                focalLength: fileInfo.focal_length || '',
                aperture: fileInfo.aperture || ''
            };
        }
        
        // Camera settings
        if (fileInfo.shutter_speed || fileInfo.iso || fileInfo.aperture || fileInfo.focal_length) {
            exif.settings = {
                shutterSpeed: fileInfo.shutter_speed || '',
                iso: fileInfo.iso || '',
                aperture: fileInfo.aperture || '',
                focalLength: fileInfo.focal_length || ''
            };
        }
        
        // GPS data
        if (fileInfo.gps_lat || fileInfo.gps_lng) {
            exif.gps = {
                latitude: fileInfo.gps_lat ? parseFloat(fileInfo.gps_lat) : null,
                longitude: fileInfo.gps_lng ? parseFloat(fileInfo.gps_lng) : null,
                altitude: fileInfo.gps_alt ? parseFloat(fileInfo.gps_alt) : null
            };
        }
        
        // Date taken
        if (fileInfo.date_taken) {
            exif.dateTaken = fileInfo.date_taken;
        }
        
        return Object.keys(exif).length > 0 ? exif : null;
    }

    // Generate thumbnail URL (if you have a thumbnail generation service)
    getThumbnailUrl(fileName, width = 400, height = 300) {
        // This would depend on your thumbnail generation setup
        // For now, return the original URL
        return this.getPublicUrl(fileName);
    }

    // Upload a file to B2
    async uploadFile(fileData, fileName, contentType = 'application/octet-stream') {
        await this.authenticate();

        // Get upload URL
        const uploadUrlResponse = await fetch(`${this.apiUrl}/b2api/v2/b2_get_upload_url`, {
            method: 'POST',
            headers: {
                'Authorization': this.authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bucketId: this.bucketId
            })
        });

        if (!uploadUrlResponse.ok) {
            throw new Error('Failed to get B2 upload URL');
        }

        const uploadData = await uploadUrlResponse.json();

        // Calculate SHA1 hash
        const sha1Hash = await this.calculateSHA1(fileData);

        // Prepare headers with EXIF metadata
        // B2 requires proper URL encoding - replace spaces and special chars
        const encodedFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_\/]/g, '');
        const headers = {
            'Authorization': uploadData.authorizationToken,
            'X-Bz-File-Name': encodedFileName,
            'Content-Type': contentType,
            'Content-Length': fileData.byteLength.toString(),
            'X-Bz-Content-Sha1': sha1Hash,
            'X-Bz-Info-src_last_modified_millis': Date.now().toString()
        };

        // No longer storing EXIF in B2 headers - using D1 database instead

        // Upload file
        const uploadResponse = await fetch(uploadData.uploadUrl, {
            method: 'POST',
            headers: headers,
            body: fileData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('B2 upload failed:', uploadResponse.status, uploadResponse.statusText, errorText);
            throw new Error(`B2 upload failed (${uploadResponse.status}): ${errorText}`);
        }

        const result = await uploadResponse.json();
        
        return {
            fileId: result.fileId,
            fileName: result.fileName,
            url: `${this.downloadUrl}/file/${this.bucketName}/${encodedFileName}`,
            uploadTimestamp: Date.now()
        };
    }

    // Calculate SHA1 hash for B2
    async calculateSHA1(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Delete a file from B2
    async deleteFile(fileId, fileName) {
        await this.authenticate();

        console.log('Attempting to delete file:', { fileId, fileName });

        const response = await fetch(`${this.apiUrl}/b2api/v2/b2_delete_file_version`, {
            method: 'POST',
            headers: {
                'Authorization': this.authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileId: fileId,
                fileName: fileName
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('B2 delete failed:', response.status, response.statusText, errorText);
            throw new Error(`Failed to delete file from B2: ${errorText}`);
        }

        const result = await response.json();
        console.log('File deleted successfully:', result);
        return result;
    }
}