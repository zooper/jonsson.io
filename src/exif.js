/**
 * EXIF Data Extraction for Photography Metadata
 * Extracts camera, lens, and GPS data from uploaded images
 */

export class ExifExtractor {
    constructor() {
        // EXIF tag mappings
        this.tags = {
            // Camera info
            make: 0x010f,           // Camera manufacturer
            model: 0x0110,          // Camera model
            software: 0x0131,       // Software used
            
            // Lens info
            lensModel: 0xa434,      // Lens model
            lensMake: 0xa433,       // Lens manufacturer
            focalLength: 0x920a,    // Focal length
            fNumber: 0x829d,        // F-number
            
            // Exposure settings
            exposureTime: 0x829a,   // Shutter speed
            iso: 0x8827,            // ISO speed
            exposureMode: 0xa402,   // Exposure mode
            whiteBalance: 0xa403,   // White balance
            
            // GPS data
            gpsLatitudeRef: 0x0001,
            gpsLatitude: 0x0002,
            gpsLongitudeRef: 0x0003,
            gpsLongitude: 0x0004,
            gpsAltitudeRef: 0x0005,
            gpsAltitude: 0x0006,
            
            // Date/time
            dateTime: 0x0132,       // Date and time
            dateTimeOriginal: 0x9003, // Original date/time
        };
    }

    /**
     * Extract EXIF data from image ArrayBuffer
     */
    async extractExif(imageBuffer) {
        try {
            const dataView = new DataView(imageBuffer);
            
            // Check if it's a JPEG file
            if (dataView.getUint16(0) !== 0xFFD8) {
                console.log('Not a JPEG file, skipping EXIF extraction');
                return null;
            }

            // Find EXIF marker
            let offset = 2;
            while (offset < dataView.byteLength - 4) {
                const marker = dataView.getUint16(offset);
                
                if (marker === 0xFFE1) { // EXIF marker
                    console.log('Found EXIF marker at offset:', offset);
                    const segmentLength = dataView.getUint16(offset + 2);
                    console.log('EXIF segment length:', segmentLength);
                    
                    const exifData = this.parseExifData(dataView, offset);
                    console.log('Raw EXIF data extracted:', exifData);
                    
                    const formatted = this.formatExifData(exifData);
                    console.log('Formatted EXIF data:', formatted);
                    
                    return formatted;
                }
                
                // Move to next marker
                const segmentLength = dataView.getUint16(offset + 2);
                if (segmentLength < 2) break; // Invalid segment length
                offset += 2 + segmentLength;
            }
            
            console.log('No EXIF data found in image');
            return null;
        } catch (error) {
            console.error('EXIF extraction error:', error);
            return null;
        }
    }

    /**
     * Parse EXIF data from DataView
     */
    parseExifData(dataView, offset) {
        const exifData = {};
        
        try {
            // Skip to EXIF header
            offset += 4; // Skip segment length
            
            // Check for "Exif\0\0" header
            const exifHeader = new Uint8Array(dataView.buffer, offset, 6);
            const expectedHeader = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]);
            
            if (!this.arrayEquals(exifHeader, expectedHeader)) {
                return exifData;
            }
            
            offset += 6;
            
            // Read TIFF header
            const byteOrder = dataView.getUint16(offset);
            const isLittleEndian = byteOrder === 0x4949;
            
            // Read IFD offset
            const ifdOffset = this.readUint32(dataView, offset + 4, isLittleEndian);
            
            // Parse IFD - pass the TIFF header offset for pointer calculations
            this.parseIFD(dataView, offset + ifdOffset, isLittleEndian, exifData, offset);
            
        } catch (error) {
            console.error('EXIF parsing error:', error);
        }
        
        return exifData;
    }

    /**
     * Parse Image File Directory (IFD)
     */
    parseIFD(dataView, offset, isLittleEndian, exifData, tiffHeaderOffset = 0) {
        const entryCount = this.readUint16(dataView, offset, isLittleEndian);
        offset += 2;

        for (let i = 0; i < entryCount; i++) {
            const entryOffset = offset + (i * 12);
            const tag = this.readUint16(dataView, entryOffset, isLittleEndian);
            const type = this.readUint16(dataView, entryOffset + 2, isLittleEndian);
            const count = this.readUint32(dataView, entryOffset + 4, isLittleEndian);
            const valueOffset = entryOffset + 8;

            const value = this.readTagValue(dataView, type, count, valueOffset, isLittleEndian, tiffHeaderOffset);
            
            // Store known tags
            for (const [tagName, tagId] of Object.entries(this.tags)) {
                if (tag === tagId) {
                    exifData[tagName] = value;
                    break;
                }
            }

            // Handle EXIF sub-IFD
            if (tag === 0x8769) { // EXIF IFD offset
                this.parseIFD(dataView, tiffHeaderOffset + value, isLittleEndian, exifData, tiffHeaderOffset);
            }
            
            // Handle GPS sub-IFD
            if (tag === 0x8825) { // GPS IFD offset
                this.parseIFD(dataView, tiffHeaderOffset + value, isLittleEndian, exifData, tiffHeaderOffset);
            }
        }
    }

    /**
     * Read tag value based on type
     */
    readTagValue(dataView, type, count, offset, isLittleEndian, tiffHeaderOffset = 0) {
        try {
            switch (type) {
                case 1: // BYTE
                    return dataView.getUint8(offset);
                case 2: // ASCII
                    // If count > 4, the value is a pointer to the actual string
                    if (count > 4) {
                        const stringOffset = this.readUint32(dataView, offset, isLittleEndian);
                        return this.readString(dataView, tiffHeaderOffset + stringOffset, count);
                    } else {
                        return this.readString(dataView, offset, count);
                    }
                case 3: // SHORT
                    return this.readUint16(dataView, offset, isLittleEndian);
                case 4: // LONG
                    return this.readUint32(dataView, offset, isLittleEndian);
                case 5: // RATIONAL
                    // GPS coordinates are typically stored as arrays of 3 rationals: [degrees, minutes, seconds]
                    if (count > 1) {
                        const rationalOffset = this.readUint32(dataView, offset, isLittleEndian);
                        const rationals = [];
                        
                        for (let i = 0; i < count; i++) {
                            const pos = tiffHeaderOffset + rationalOffset + (i * 8); // Each rational is 8 bytes
                            const numerator = this.readUint32(dataView, pos, isLittleEndian);
                            const denominator = this.readUint32(dataView, pos + 4, isLittleEndian);
                            rationals.push(denominator ? numerator / denominator : 0);
                        }
                        
                        return count === 1 ? rationals[0] : rationals;
                    } else {
                        const numerator = this.readUint32(dataView, offset, isLittleEndian);
                        const denominator = this.readUint32(dataView, offset + 4, isLittleEndian);
                        return denominator ? numerator / denominator : 0;
                    }
                default:
                    return null;
            }
        } catch (error) {
            return null;
        }
    }

    /**
     * Format extracted EXIF data for storage
     */
    formatExifData(rawExif) {
        const formatted = {
            camera: null,
            lens: null,
            settings: null,
            gps: null,
            timestamp: null
        };

        // Camera info - handle Leica and other manufacturers
        if (rawExif.make || rawExif.model) {
            let make = rawExif.make || '';
            let model = rawExif.model || '';
            
            // Clean up common manufacturer variations
            if (make.toLowerCase().includes('leica')) {
                make = 'Leica';
            }
            
            formatted.camera = {
                make: make,
                model: model,
                software: rawExif.software || ''
            };
        }

        // Lens info
        if (rawExif.lensModel || rawExif.focalLength) {
            formatted.lens = {
                model: rawExif.lensModel || rawExif.lensMake || '',
                focalLength: rawExif.focalLength ? Math.round(rawExif.focalLength) + 'mm' : null,
                aperture: rawExif.fNumber ? 'f/' + rawExif.fNumber.toFixed(1) : null
            };
        }

        // Camera settings
        if (rawExif.exposureTime || rawExif.iso || rawExif.fNumber || rawExif.focalLength) {
            formatted.settings = {
                shutterSpeed: rawExif.exposureTime ? this.formatShutterSpeed(rawExif.exposureTime) : null,
                iso: rawExif.iso ? 'ISO ' + rawExif.iso : null,
                aperture: rawExif.fNumber ? 'f/' + rawExif.fNumber.toFixed(1) : null,
                focalLength: rawExif.focalLength ? Math.round(rawExif.focalLength) + 'mm' : null
            };
        }

        // GPS data
        if (rawExif.gpsLatitude && rawExif.gpsLongitude) {
            const latitude = this.parseGPSCoordinate(rawExif.gpsLatitude, rawExif.gpsLatitudeRef);
            const longitude = this.parseGPSCoordinate(rawExif.gpsLongitude, rawExif.gpsLongitudeRef);
            
            formatted.gps = {
                latitude: latitude,
                longitude: longitude,
                altitude: rawExif.gpsAltitude || null
            };
        }

        // Date taken - store both raw and formatted versions
        const dateTimeOriginal = rawExif.dateTimeOriginal || rawExif.dateTime;
        if (dateTimeOriginal) {
            try {
                // Convert EXIF timestamp format (YYYY:MM:DD HH:MM:SS) to ISO
                // Need to replace only the first two colons with dashes for date part
                const dateStr = dateTimeOriginal.replace(/^(\d{4}):(\d{2}):(\d{2}) (.+)$/, '$1-$2-$3T$4');
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    // Store ISO string for database
                    formatted.timestamp = date.toISOString();
                    // Also store formatted version for display
                    formatted.dateTaken = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch (e) {
                formatted.timestamp = dateTimeOriginal;
                formatted.dateTaken = dateTimeOriginal;
            }
        }

        return formatted;
    }

    /**
     * Format shutter speed for display
     */
    formatShutterSpeed(exposureTime) {
        if (exposureTime >= 1) {
            return exposureTime.toFixed(1) + 's';
        } else {
            return '1/' + Math.round(1 / exposureTime) + 's';
        }
    }

    /**
     * Parse GPS coordinates
     */
    parseGPSCoordinate(coord, ref) {
        if (!coord) return null;
        
        let decimal;
        
        // Handle array format [degrees, minutes, seconds]
        if (Array.isArray(coord) && coord.length >= 3) {
            const degrees = coord[0];
            const minutes = coord[1];
            const seconds = coord[2];
            decimal = degrees + (minutes / 60) + (seconds / 3600);
        }
        // Handle single decimal value
        else if (typeof coord === 'number') {
            decimal = coord;
        }
        // Handle other formats
        else {
            return null;
        }
        
        // Apply direction (negative for South/West)
        if (ref === 'S' || ref === 'W') {
            decimal = -decimal;
        }
        
        return decimal;
    }

    // Utility functions
    readUint16(dataView, offset, isLittleEndian) {
        return dataView.getUint16(offset, isLittleEndian);
    }

    readUint32(dataView, offset, isLittleEndian) {
        return dataView.getUint32(offset, isLittleEndian);
    }

    readString(dataView, offset, length) {
        const bytes = new Uint8Array(dataView.buffer, offset, length - 1); // -1 to exclude null terminator
        return new TextDecoder().decode(bytes);
    }

    arrayEquals(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }
}