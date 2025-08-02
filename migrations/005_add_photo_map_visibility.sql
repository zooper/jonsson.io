-- Migration 005: Add photo map visibility control
-- Description: Add show_on_map field to photos table for privacy control

-- Add show_on_map column to photos table (defaults to 1/true for existing photos)
ALTER TABLE photos ADD COLUMN show_on_map INTEGER DEFAULT 1;

-- Update database version
UPDATE database_version 
SET version = 5, 
    description = 'Add photo map visibility control',
    applied_at = CURRENT_TIMESTAMP 
WHERE id = 1;