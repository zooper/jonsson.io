-- Photos table for storing photo metadata and EXIF data
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  title TEXT,
  description TEXT,
  b2_file_id TEXT NOT NULL,
  b2_filename TEXT NOT NULL,
  url TEXT NOT NULL,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Camera EXIF data
  camera_make TEXT,
  camera_model TEXT,
  camera_software TEXT,
  
  -- Lens EXIF data
  lens_model TEXT,
  focal_length TEXT,
  aperture TEXT,
  
  -- Camera settings
  shutter_speed TEXT,
  iso TEXT,
  
  -- GPS data
  gps_latitude REAL,
  gps_longitude REAL,
  gps_altitude REAL,
  
  -- Location data (resolved from GPS)
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  location_full_address TEXT,
  
  -- Date/time
  date_taken DATETIME,
  
  -- File metadata
  file_size INTEGER,
  content_type TEXT
);

-- Settings table for storing site configuration
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default theme
INSERT OR IGNORE INTO settings (key, value) VALUES ('active_theme', 'modern');

-- AI Quotes table for storing generated quotes with associated images
CREATE TABLE IF NOT EXISTS ai_quotes (
  id TEXT PRIMARY KEY,
  photo_id TEXT NOT NULL,
  quote TEXT NOT NULL,
  is_active INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_photos_upload_date ON photos(upload_date);
CREATE INDEX IF NOT EXISTS idx_photos_camera_make ON photos(camera_make);
CREATE INDEX IF NOT EXISTS idx_photos_b2_file_id ON photos(b2_file_id);
CREATE INDEX IF NOT EXISTS idx_ai_quotes_photo_id ON ai_quotes(photo_id);
CREATE INDEX IF NOT EXISTS idx_ai_quotes_active ON ai_quotes(is_active);