import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { initDatabase } from './database.js';
import { setupRoutes } from './routes.js';

dotenv.config();

// For Cloudflare Workers, we don't need to compute __dirname the same way
const __dirname = '';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use('/static', express.static('./static'));
app.use('/admin', express.static('./admin'));

// Initialize database
await initDatabase();

// Setup routes
setupRoutes(app);

app.listen(PORT, () => {
  console.log(`Photoblog server running on http://localhost:${PORT}`);
});