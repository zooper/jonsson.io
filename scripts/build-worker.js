#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read all static files and create a static files object
function readStaticFiles() {
  const staticFiles = {};
  
  // Read public HTML files
  const publicFiles = ['index.html', 'post.html'];
  for (const file of publicFiles) {
    const filePath = path.join(__dirname, '..', 'public', file);
    if (fs.existsSync(filePath)) {
      staticFiles[`/${file}`] = fs.readFileSync(filePath, 'utf8');
    }
  }
  
  // Read admin HTML files
  const adminPath = path.join(__dirname, '..', 'admin');
  if (fs.existsSync(adminPath)) {
    const adminFiles = fs.readdirSync(adminPath);
    for (const file of adminFiles) {
      if (file.endsWith('.html')) {
        const filePath = path.join(adminPath, file);
        staticFiles[`/admin/${file}`] = fs.readFileSync(filePath, 'utf8');
      }
    }
  }
  
  // Read static files (CSS, JS, etc.)
  const staticPath = path.join(__dirname, '..', 'static');
  if (fs.existsSync(staticPath)) {
    function readDirectory(dirPath, basePath = '/static') {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          readDirectory(filePath, `${basePath}/${file}`);
        } else {
          const content = fs.readFileSync(filePath, 'utf8');
          staticFiles[`${basePath}/${file}`] = content;
        }
      }
    }
    readDirectory(staticPath);
  }
  
  return staticFiles;
}

// Main build function
function buildWorker() {
  console.log('Building Cloudflare Worker with static files...');
  
  // Read the current worker source
  const workerPath = path.join(__dirname, '..', 'src', 'index.js');
  let workerSource = fs.readFileSync(workerPath, 'utf8');
  
  // Read all static files
  const staticFiles = readStaticFiles();
  console.log(`Found ${Object.keys(staticFiles).length} static files`);
  
  // Create the static files object as a string
  const staticFilesStr = JSON.stringify(staticFiles, null, 2);
  
  // Replace the empty STATIC_FILES object with the actual files
  workerSource = workerSource.replace(
    'const STATIC_FILES = {};',
    `const STATIC_FILES = ${staticFilesStr};`
  );
  
  // Write the built worker
  const outputPath = path.join(__dirname, '..', 'dist', 'worker.js');
  const distDir = path.dirname(outputPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, workerSource);
  console.log(`Worker built successfully: ${outputPath}`);
  
  // Also update the source file for immediate deployment
  fs.writeFileSync(workerPath, workerSource);
  console.log(`Source file updated: ${workerPath}`);
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildWorker();
}

export { buildWorker };