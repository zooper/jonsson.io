import { build } from 'esbuild';
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

console.log('Building for', isProduction ? 'production' : 'development');

// Build configuration
const buildConfig = {
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outdir: 'dist',
  sourcemap: !isProduction,
  minify: isProduction,
  external: ['better-sqlite3'],
};

// Copy static files
async function copyStaticFiles() {
  const staticDirs = ['public', 'admin', 'static'];
  
  for (const dir of staticDirs) {
    try {
      await copyDirectory(dir, `dist/${dir}`);
      console.log(`Copied ${dir}/ to dist/${dir}/`);
    } catch (error) {
      console.warn(`Warning: Could not copy ${dir}:`, error.message);
    }
  }
}

async function copyDirectory(src, dest) {
  try {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      const entryStat = await stat(srcPath);
      
      if (entryStat.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy directory ${src}: ${error.message}`);
  }
}

// Main build process
async function buildProject() {
  try {
    console.log('Building JavaScript bundle...');
    await build(buildConfig);
    console.log('JavaScript bundle built successfully');
    
    console.log('Copying static files...');
    await copyStaticFiles();
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProject();