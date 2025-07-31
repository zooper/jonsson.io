-- Database schema for jonsson.io photoblog
-- For use with Cloudflare D1

-- Enable foreign keys (D1 supports this)
PRAGMA foreign_keys = ON;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  slug TEXT UNIQUE NOT NULL,
  featured_image_id INTEGER,
  published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (featured_image_id) REFERENCES images (id)
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  b2_file_id TEXT,
  b2_url TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create EXIF data table
CREATE TABLE IF NOT EXISTS image_exif (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id INTEGER NOT NULL,
  camera_make TEXT,
  camera_model TEXT,
  lens_make TEXT,
  lens_model TEXT,
  focal_length REAL,
  focal_length_35mm INTEGER,
  aperture REAL,
  shutter_speed TEXT,
  iso INTEGER,
  flash TEXT,
  exposure_mode TEXT,
  white_balance TEXT,
  metering_mode TEXT,
  date_taken DATETIME,
  gps_latitude REAL,
  gps_longitude REAL,
  gps_altitude REAL,
  orientation INTEGER,
  color_space TEXT,
  software TEXT,
  artist TEXT,
  copyright TEXT,
  description TEXT,
  keywords TEXT,
  rating INTEGER,
  raw_exif TEXT, -- JSON string of all EXIF data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE
);

-- Create post_images junction table for multiple images per post
CREATE TABLE IF NOT EXISTS post_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  image_id INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE,
  UNIQUE(post_id, image_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
  UNIQUE(post_id, tag_id)
);

-- Create gallery table for homepage gallery
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE,
  UNIQUE(image_id)
);

-- Create admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create about page table
CREATE TABLE IF NOT EXISTS about_page (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT 'About',
  lead_text TEXT,
  content TEXT,
  profile_image_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_image_id) REFERENCES images (id)
);

-- Create site settings table for themes and other settings
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create social links table
CREATE TABLE IF NOT EXISTS social_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_svg TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default theme if none exists
INSERT OR IGNORE INTO site_settings (setting_key, setting_value) 
VALUES ('theme', 'default');

-- Insert default about content if none exists  
INSERT OR IGNORE INTO about_page (id, title, lead_text, content) 
VALUES (1, 'About', 
  'I''m a photographer passionate about capturing authentic moments and telling visual stories through my lens.',
  'My work focuses on the intersection of light, emotion, and time – freezing fleeting moments that might otherwise be forgotten. Each photograph is an invitation to see the world through my eyes, to discover beauty in the ordinary and extraordinary alike.

Based between urban landscapes and natural environments, I find inspiration in the contrast between human-made and organic forms, always seeking to capture the essence of a moment rather than just its appearance.');

-- Insert default social links if none exist
INSERT OR IGNORE INTO social_links (id, platform, label, url, icon_svg, sort_order) 
VALUES 
  (1, 'instagram', 'Instagram', 'https://instagram.com/jonsson', 
   'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z', 
   1),
  (2, 'email', 'Email', 'mailto:hello@jonsson.io', 
   'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', 
   2);