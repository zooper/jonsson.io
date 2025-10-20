-- Migration 007: Add email reports tracking
-- This migration adds functionality to track sent email reports

-- Email reports table for tracking sent reports
CREATE TABLE IF NOT EXISTS email_reports (
    id TEXT PRIMARY KEY,
    report_type TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    recipient_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    error_message TEXT,
    stats_snapshot TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_reports_sent_at ON email_reports(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_reports_type ON email_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_email_reports_status ON email_reports(status);

-- Update database version
UPDATE database_version SET version = 7, description = 'Add email reports tracking', applied_at = CURRENT_TIMESTAMP WHERE id = 1;
