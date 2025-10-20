-- Migration 006: Add photo view tracking
-- This migration adds functionality to track when users view photos in full-size/lightbox mode

-- Photo views table for tracking individual photo views
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_photo_views_photo_id ON photo_views(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_views_viewed_at ON photo_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_photo_views_session_id ON photo_views(session_id);

-- Update database version
UPDATE database_version SET version = 6, description = 'Add photo view tracking', applied_at = CURRENT_TIMESTAMP WHERE id = 1;
