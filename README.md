# jonsson.io Photoblog

A modern photoblog built with Node.js, designed to replace Squarespace hosting. Features a clean, minimalist design optimized for photography showcase and blog posts.

## Features

- **Photoblog Homepage**: Clean, grid-based layout for showcasing photography
- **Admin Interface**: Easy-to-use admin panel for creating posts and uploading images
- **Image Storage**: Integrated with Backblaze B2 for reliable, cost-effective image storage
- **Responsive Design**: Mobile-first design that works on all devices
- **Fast Performance**: Optimized for speed with modern web technologies
- **Cloudflare Integration**: Ready for deployment on Cloudflare Pages and Workers

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: SQLite with better-sqlite3
- **Image Storage**: Backblaze B2
- **Image Processing**: Sharp
- **Deployment**: Cloudflare Pages + Workers
- **Frontend**: Vanilla JavaScript, modern CSS

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your Backblaze B2 credentials and other settings
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Homepage: http://localhost:3000
   - Admin interface: http://localhost:3000/admin

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_PATH=./photoblog.db

# Backblaze B2 Configuration
B2_APPLICATION_KEY_ID=your_application_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_ID=your_bucket_id
B2_BUCKET_NAME=your_bucket_name

# Server Configuration
PORT=3000
NODE_ENV=development

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_key
```

## Backblaze B2 Setup

1. Create a Backblaze B2 account
2. Create a new bucket for your images
3. Generate application keys with read/write permissions
4. Add the credentials to your `.env` file

## Deployment to Cloudflare

### Prerequisites
- Cloudflare account
- Wrangler CLI installed: `npm install -g wrangler`

### Deploy to Cloudflare Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages**:
   ```bash
   wrangler pages deploy dist
   ```

3. **Set up environment variables** in Cloudflare dashboard

### Deploy Workers (if needed)

```bash
wrangler deploy
```

## Database Schema

The application uses SQLite with the following main tables:

- `posts`: Blog posts with title, content, slug, publication status
- `images`: Image metadata with Backblaze B2 file information
- `post_images`: Junction table linking posts to multiple images
- `tags`: Tag system for organizing posts
- `admin_sessions`: Admin authentication sessions

## Project Structure

```
├── src/
│   ├── index.js          # Main server entry point
│   ├── database.js       # Database schema and initialization
│   ├── routes.js         # API routes and handlers
│   └── storage.js        # Backblaze B2 integration
├── public/               # Homepage static files
├── admin/                # Admin interface
├── static/               # CSS and JavaScript assets
├── functions/            # Cloudflare Pages Functions
├── scripts/              # Build scripts
└── dist/                 # Build output (generated)
```

## API Endpoints

### Public API
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:slug` - Get single post by slug

### Admin API (requires authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/posts` - Get all posts (including unpublished)
- `POST /api/admin/posts` - Create new post
- `POST /api/admin/upload` - Upload image to Backblaze B2

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## License

MIT License - see LICENSE file for details.