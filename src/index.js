import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './database.js';
import { setupRoutes } from './routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Initialize database
await initDatabase();

// Setup routes
setupRoutes(app);

app.listen(PORT, () => {
  console.log(`Photoblog server running on http://localhost:${PORT}`);
});