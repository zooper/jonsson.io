# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Photography portfolio website (jonsson.io) built as a Cloudflare Worker with photo management, analytics, and admin capabilities.

## Commands

### Development
- `npm run dev` or `wrangler dev` - Start local development server on http://localhost:8787
- `npm run start` - Alias for dev command
- `.dev.vars` file - Local environment variables for B2 credentials

### Testing
- `npm run test` - Run Node.js native tests for files in `test/**/*.test.js`

### Build & Deploy
- `npm run build` - Echo message (no actual build process needed for Cloudflare Workers)
- `npm run deploy` or `wrangler deploy` - Deploy to Cloudflare Workers production
- `wrangler d1 execute DB --file=schema.sql` - Initialize database schema
- `wrangler d1 execute DB --file=migrations/[filename].sql` - Run database migrations

### Secrets Management
Production secrets (use `wrangler secret put <KEY_NAME>`):
- `B2_APPLICATION_KEY_ID` - Backblaze B2 application key ID
- `B2_APPLICATION_KEY` - Backblaze B2 application key
- `B2_BUCKET_ID` - Backblaze B2 bucket ID
- `B2_BUCKET_NAME` - Backblaze B2 bucket name
- `CLOUDFLARE_ZONE_ID` - Cloudflare zone ID for analytics (optional)
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token for analytics (optional)

## Architecture

### Core Stack
- **Runtime**: Cloudflare Workers (edge computing, Node.js compatibility enabled)
- **Database**: Cloudflare D1 SQLite (current schema version: 5)
- **Storage**: Backblaze B2 for photo file storage and CDN
- **Static Assets**: Cloudflare Workers Assets binding (./public directory)
- **Domain**: jonsson.io and www.jonsson.io (configured in wrangler.toml routes)

### Source Files
- `src/index.js` (3544 lines) - Main application entry point:
  - HTTP request routing and middleware
  - Embedded static HTML/CSS/JS for both frontend and admin
  - Admin panel UI for photo management, analytics, and settings
  - REST API endpoints for photos, analytics, and admin operations
  - Security headers, CSP, and error handling
  - Magic link authentication system

- `src/database.js` (390 lines) - D1 database operations:
  - Photo metadata CRUD operations
  - Analytics queries (visitor sessions, page views)
  - Settings management
  - AI quotes management
  - Magic link token handling
  - Database versioning utilities

- `src/storage.js` (241 lines) - Backblaze B2 integration:
  - File upload with automatic authorization refresh
  - File deletion and bucket operations
  - URL generation for photo access

- `src/exif.js` (355 lines) - EXIF data extraction:
  - Camera metadata (make, model, software)
  - Lens information (model, focal length)
  - Camera settings (aperture, shutter speed, ISO)
  - GPS coordinates extraction
  - Date/time information

- `src/location.js` (120 lines) - Location services:
  - Reverse geocoding from GPS coordinates
  - Location data formatting

### Key Features

#### Frontend
- Photo gallery with lightbox and pagination
- Responsive design with mobile optimization
- Theme system (modern theme active by default)
- Custom 404 page
- AI-generated quotes with associated photos
- Visitor analytics tracking (sessions, page views, device info)

#### Admin Panel
- Photo upload with drag-and-drop support
- EXIF data viewing and editing
- Photo deletion and management
- Pagination controls (page size, navigation)
- Analytics dashboard:
  - Visitor sessions and page views
  - Photo view statistics (lightbox interactions only)
  - Geographic distribution (country, city)
  - Device type and browser analytics
  - Response time metrics
  - Most viewed photos with engagement metrics
- Recent activity notifications
- Settings management
- Magic link authentication (passwordless login)
- "View Site" navigation link

#### API Endpoints
- `/api/photos` - Photo listing with pagination
- `/api/photos/:id` - Individual photo details
- `/api/admin/*` - Admin operations (protected)
- `/api/analytics/*` - Analytics data (protected)
- `/api/settings/*` - Settings management (protected)

### Database Schema (Version 6)

Tables:
- `database_version` - Schema version tracking
- `photos` - Photo metadata, EXIF data, GPS coordinates, location data, map visibility
- `settings` - Site configuration (theme, etc.)
- `ai_quotes` - AI-generated quotes linked to photos
- `visitor_sessions` - Session tracking (IP hash, user agent, country, device type, browser, OS)
- `page_views` - Page view tracking (URL, title, time on page, response codes, response time)
- `magic_links` - Authentication tokens (email, token, expiration, usage tracking)
- `photo_views` - Photo view tracking (lightbox opens only, session, device, location)

Key indexes for performance:
- Photos: upload_date, camera_make, b2_file_id
- Analytics: session_start, country, device_type, page_url, viewed_at, response_code
- Magic links: token, email, expires_at

### Configuration Files

- `wrangler.toml` - Cloudflare Workers configuration:
  - Worker name: "jonsson-homepage"
  - Node.js compatibility enabled
  - Custom domain routes for jonsson.io
  - D1 database binding
  - Static assets binding
  - Environment variables (development, staging, production)

- `package.json` - Dependencies:
  - Runtime: exifr, fast-xml-parser, backblaze-b2
  - Dev tools: better-sqlite3 (local testing), sharp (image processing)
  - Build: esbuild

- `schema.sql` - Complete database schema with indexes

### Security Implementation

- Content Security Policy (CSP) headers with strict directives
- Input sanitization for all admin operations
- Secure credential handling via Wrangler secrets
- Error response sanitization to prevent information disclosure
- IP hashing for visitor analytics (privacy protection)
- Magic link token expiration and single-use enforcement
- User agent and referrer validation

### Recent Changes

Recent commits indicate:
- Comprehensive security hardening (CSP, input sanitization)
- Photo map functionality removed
- Admin activity tracking added
- Persistent notification bell system
- Pagination system implementation
- Cloudflare analytics integration
- Custom 404 page
- Theme loading improvements for mobile
- Zero stats display fixes