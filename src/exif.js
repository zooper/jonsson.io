import exifr from 'exifr';

export async function extractExifData(buffer) {
  try {
    
    // Extract comprehensive EXIF data
    const exifData = await exifr.parse(buffer, {
      // Include all possible tags
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
      icc: true,
      jfif: true,
      ihdr: true, // For PNG
      // Advanced options
      mergeOutput: true,
      sanitize: false,
      reviveValues: true,
      translateKeys: true,
      translateValues: true,
      arrays: true,
      chunked: false,
      firstChunkSize: 40960,
      chunkLimit: 5
    });


    if (!exifData) {
      return null;
    }

    // Extract and normalize key photography data
    const normalized = {
      // Camera information
      camera_make: exifData.Make || null,
      camera_model: exifData.Model || null,
      lens_make: exifData.LensMake || null,
      lens_model: exifData.LensModel || exifData.Lens || null,
      
      // Photography settings
      focal_length: exifData.FocalLength || null,
      focal_length_35mm: exifData.FocalLengthIn35mmFilm || null,
      aperture: exifData.FNumber || exifData.ApertureValue || null,
      shutter_speed: formatShutterSpeed(exifData.ExposureTime || exifData.ShutterSpeedValue),
      iso: exifData.ISO || exifData.PhotographicSensitivity || null,
      
      // Flash and exposure
      flash: formatFlash(exifData.Flash),
      exposure_mode: formatExposureMode(exifData.ExposureMode),
      white_balance: formatWhiteBalance(exifData.WhiteBalance),
      metering_mode: formatMeteringMode(exifData.MeteringMode),
      
      // Date and location
      date_taken: formatDateTime(exifData.DateTimeOriginal || exifData.DateTime || exifData.CreateDate),
      gps_latitude: exifData.latitude || null,
      gps_longitude: exifData.longitude || null,
      gps_altitude: exifData.GPSAltitude || null,
      
      // Image properties
      orientation: exifData.Orientation || null,
      color_space: formatColorSpace(exifData.ColorSpace),
      
      // Creator information
      software: exifData.Software || null,
      artist: exifData.Artist || exifData.Creator || null,
      copyright: exifData.Copyright || null,
      description: exifData.ImageDescription || exifData.Description || null,
      keywords: formatKeywords(exifData.Keywords || exifData.Subject),
      rating: exifData.Rating || null,
      
      // Store complete raw EXIF data as JSON
      raw_exif: JSON.stringify(exifData)
    };

    return normalized;
    
  } catch (error) {
    console.error('EXIF extraction error:', error.message);
    return null;
  }
}

function formatShutterSpeed(exposureTime) {
  if (!exposureTime) return null;
  
  if (exposureTime >= 1) {
    return `${exposureTime}s`;
  } else {
    const fraction = Math.round(1 / exposureTime);
    return `1/${fraction}s`;
  }
}

function formatFlash(flash) {
  if (!flash && flash !== 0) return null;
  
  const flashModes = {
    0: 'No Flash',
    1: 'Flash',
    5: 'Flash, No Strobe Return',
    7: 'Flash, Strobe Return',
    9: 'Flash, Compulsory',
    13: 'Flash, Compulsory, No Strobe Return',
    15: 'Flash, Compulsory, Strobe Return',
    16: 'No Flash, Compulsory',
    24: 'No Flash, Auto',
    25: 'Flash, Auto',
    29: 'Flash, Auto, No Strobe Return',
    31: 'Flash, Auto, Strobe Return',
    32: 'No Flash Available'
  };
  
  return flashModes[flash] || `Flash (${flash})`;
}

function formatExposureMode(mode) {
  if (!mode && mode !== 0) return null;
  
  const modes = {
    0: 'Auto',
    1: 'Manual',
    2: 'Auto Bracket'
  };
  
  return modes[mode] || `Mode ${mode}`;
}

function formatWhiteBalance(wb) {
  if (!wb && wb !== 0) return null;
  
  const wbModes = {
    0: 'Auto',
    1: 'Manual'
  };
  
  return wbModes[wb] || `WB ${wb}`;
}

function formatMeteringMode(mode) {
  if (!mode && mode !== 0) return null;
  
  const modes = {
    0: 'Unknown',
    1: 'Average',
    2: 'Center-weighted Average',
    3: 'Spot',
    4: 'Multi-spot',
    5: 'Multi-segment',
    6: 'Partial',
    255: 'Other'
  };
  
  return modes[mode] || `Metering ${mode}`;
}

function formatColorSpace(colorSpace) {
  if (!colorSpace && colorSpace !== 0) return null;
  
  const spaces = {
    1: 'sRGB',
    2: 'Adobe RGB',
    65535: 'Uncalibrated'
  };
  
  return spaces[colorSpace] || `ColorSpace ${colorSpace}`;
}

function formatKeywords(keywords) {
  if (!keywords) return null;
  
  if (Array.isArray(keywords)) {
    return keywords.join(', ');
  }
  
  return keywords.toString();
}

function formatDateTime(dateTime) {
  if (!dateTime) return null;
  
  try {
    // Handle various date formats
    if (dateTime instanceof Date) {
      return dateTime.toISOString();
    }
    
    if (typeof dateTime === 'string') {
      // Handle EXIF date format: "YYYY:MM:DD HH:MM:SS"
      const normalized = dateTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
      const date = new Date(normalized);
      
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}