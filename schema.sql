-- Database schema for jonsson.io photography website
-- Current version: 6

-- Database version tracking
CREATE TABLE IF NOT EXISTS database_version (
    id INTEGER PRIMARY KEY,
    version INTEGER NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Insert current version if not exists
INSERT OR IGNORE INTO database_version (id, version, description)
VALUES (1, 6, 'Add photo view tracking');

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
  content_type TEXT,
  
  -- Map visibility control
  show_on_map INTEGER DEFAULT 1
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

-- Visitor analytics tables
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
);

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
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_photos_upload_date ON photos(upload_date);
CREATE INDEX IF NOT EXISTS idx_photos_camera_make ON photos(camera_make);
CREATE INDEX IF NOT EXISTS idx_photos_b2_file_id ON photos(b2_file_id);
CREATE INDEX IF NOT EXISTS idx_ai_quotes_photo_id ON ai_quotes(photo_id);
CREATE INDEX IF NOT EXISTS idx_ai_quotes_active ON ai_quotes(is_active);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_start ON visitor_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_country ON visitor_sessions(country_code);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_device ON visitor_sessions(device_type);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_response_code ON page_views(response_code);

-- Magic link tokens for authentication
CREATE TABLE IF NOT EXISTS magic_links (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at);

-- Photo views table for tracking when users view photos in lightbox/full-size mode
CREATE TABLE IF NOT EXISTS photo_views (
  id TEXT PRIMARY KEY,
  photo_id TEXT NOT NULL,
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  session_id TEXT,
  user_agent TEXT,
  country_code TEXT,
  country_name TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_photo_views_photo_id ON photo_views(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_views_viewed_at ON photo_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_photo_views_session_id ON photo_views(session_id);