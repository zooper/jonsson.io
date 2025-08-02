# jonsson.io - Photography Homepage

A modern, clean photography portfolio website built with Cloudflare Workers and Backblaze B2 storage.

## Features

- **Modern Design**: Clean, responsive design that works beautifully on all devices
- **Fast Performance**: Built on Cloudflare Workers for global edge performance
- **Backblaze B2 Integration**: Cost-effective photo storage and delivery
- **Lightbox Gallery**: Smooth photo viewing experience with keyboard navigation
- **Mobile Responsive**: Optimized for mobile, tablet, and desktop viewing
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Cloudflare Workers
- **Storage**: Backblaze B2
- **Fonts**: Google Fonts (Inter & Playfair Display)
- **Deployment**: Cloudflare Workers via Wrangler

## Setup Instructions

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Cloudflare account
- Backblaze B2 account

### 2. Clone and Install

```bash
git clone <your-repo>
cd jonsson.io
npm install
```

### 3. Backblaze B2 Setup

1. **Create a Backblaze B2 Account**: Sign up at [backblaze.com](https://www.backblaze.com/b2/cloud-storage.html)

2. **Create a Bucket**:
   - Go to B2 Cloud Storage → Buckets
   - Click "Create a Bucket"
   - Choose a unique bucket name (e.g., "jonsson-photos")
   - Set bucket type to "Public" if you want direct access to images
   - Note your bucket ID and name

3. **Generate Application Keys**:
   - Go to App Keys
   - Click "Add a New Application Key"
   - Choose your bucket or "All" for full access
   - Note your keyID and applicationKey

4. **Upload Your Photos**:
   - Upload photos to a `photos/` folder in your bucket
   - Supported formats: JPG, JPEG, PNG, GIF, WebP, BMP
   - File names will be converted to photo titles automatically

### 4. Configure Environment Variables

Edit `wrangler.toml` and uncomment/update the Backblaze B2 variables:

```toml
[vars]
ENVIRONMENT = "development"
B2_KEY_ID = "your-actual-key-id"
B2_APPLICATION_KEY = "your-actual-application-key"
B2_BUCKET_ID = "your-actual-bucket-id"
B2_BUCKET_NAME = "your-actual-bucket-name"
```

**Important**: For production, use Cloudflare Workers secrets instead:

```bash
npx wrangler secret put B2_KEY_ID
npx wrangler secret put B2_APPLICATION_KEY
npx wrangler secret put B2_BUCKET_ID
npx wrangler secret put B2_BUCKET_NAME
```

### 5. Customize Content

Edit the content in `src/index.js` to personalize:

- Update the hero title and subtitle
- Modify the about section text
- Change contact email and social links
- Update meta tags and site title

### 6. Development

```bash
# Start local development server
npx wrangler dev

# Your site will be available at http://localhost:8787
```

### 7. Deploy

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy

# Your site will be available at https://jonsson-homepage.your-subdomain.workers.dev
```

### 8. Custom Domain (Optional)

1. Go to your Cloudflare dashboard
2. Navigate to Workers & Pages → your-worker
3. Click "Custom Domains" → "Add Custom Domain"
4. Enter your domain (e.g., jonsson.io)
5. Follow DNS setup instructions

## Project Structure

```
jonsson.io/
├── src/
│   ├── index.js          # Main Cloudflare Workers entry point
│   └── storage.js        # Backblaze B2 integration
├── public/               # Static HTML files (not used in Workers)
├── static/
│   ├── css/
│   │   └── style.css     # All styles
│   └── js/
│       └── gallery.js    # Gallery functionality
├── wrangler.toml         # Cloudflare Workers configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## API Endpoints

- `GET /api/photos` - Returns all photos from Backblaze B2

## Customization

### Adding New Sections

To add new sections to the homepage:

1. Update the HTML in `src/index.js` STATIC_FILES['/']
2. Add corresponding CSS styles
3. Update navigation links if needed

### Styling Changes

All styles are in the embedded CSS within `src/index.js`. Key CSS custom properties you can modify:

- Colors: Update the gradient and color scheme
- Fonts: Change Google Fonts imports and font-family declarations
- Layout: Modify grid and flexbox properties

### Photo Organization

The system automatically:
- Fetches photos from the `photos/` folder in your B2 bucket
- Converts filenames to titles (e.g., "sunset_beach.jpg" → "Sunset Beach")
- Sorts photos by upload date (newest first)
- Filters only image file types

## Performance Optimization

- Images are loaded with lazy loading
- CSS and JS are inlined for minimal requests
- Cloudflare Workers provides global edge caching
- B2 images can be served through Cloudflare for additional caching

## Troubleshooting

### Photos Not Loading

1. Check B2 credentials in wrangler.toml
2. Verify bucket permissions (should be public for direct access)
3. Ensure photos are in the `photos/` folder
4. Check browser developer console for API errors

### Deployment Issues

1. Ensure you're logged in to Cloudflare: `npx wrangler auth login`
2. Check that your account has Workers quota available
3. Verify wrangler.toml configuration

### CORS Issues

If accessing from a different domain, you may need to add CORS headers to the API responses.

## License

MIT License - feel free to use this as a starting point for your own photography website!

## Contributing

This is a personal portfolio project, but suggestions and improvements are welcome via issues.