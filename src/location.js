/**
 * Location service for reverse geocoding GPS coordinates
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

export class LocationService {
    constructor() {
        // Using OpenStreetMap Nominatim - free reverse geocoding service
        this.baseUrl = 'https://nominatim.openstreetmap.org/reverse';
    }

    /**
     * Convert GPS coordinates to location information
     */
    async reverseGeocode(latitude, longitude) {
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            return null;
        }

        try {
            const url = `${this.baseUrl}?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'jonsson.io Photography Gallery'
                }
            });

            if (!response.ok) {
                console.error('Geocoding API error:', response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            
            if (!data || !data.address) {
                console.log('No address data found for coordinates');
                return null;
            }

            const address = data.address;
            
            // Extract location components
            const location = {
                city: this.extractCity(address),
                state: this.extractState(address),
                country: address.country || '',
                fullAddress: data.display_name || '',
                rawAddress: address
            };

            return location;

        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            return null;
        }
    }

    /**
     * Extract city name from address components
     */
    extractCity(address) {
        // Try different city-level components in order of preference
        return address.city || 
               address.town || 
               address.village || 
               address.municipality || 
               address.suburb || 
               address.neighbourhood || 
               '';
    }

    /**
     * Extract state/region from address components
     */
    extractState(address) {
        // Try different state-level components
        return address.state || 
               address.region || 
               address.province || 
               address.county || 
               '';
    }

    /**
     * Format location for display
     */
    formatLocationDisplay(location) {
        if (!location) return null;

        const parts = [];
        
        if (location.city) parts.push(location.city);
        if (location.state) parts.push(location.state);
        if (location.country) parts.push(location.country);
        
        return parts.length > 0 ? parts.join(', ') : null;
    }

    /**
     * Get a short location description (city, state/country)
     */
    getShortLocation(location) {
        if (!location) return null;

        if (location.city && location.state) {
            return `${location.city}, ${location.state}`;
        } else if (location.city && location.country) {
            return `${location.city}, ${location.country}`;
        } else if (location.state && location.country) {
            return `${location.state}, ${location.country}`;
        } else if (location.city) {
            return location.city;
        } else if (location.country) {
            return location.country;
        }
        
        return null;
    }
}