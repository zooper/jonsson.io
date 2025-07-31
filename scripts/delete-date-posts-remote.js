#!/usr/bin/env node

/**
 * Delete posts with generic date titles from remote D1 database
 */

import { execSync } from 'child_process';

// Posts with date-only titles to delete
const datePostIds = [
  55, 54, 53, 52, 51, 50, 49, 48, 47, 46,
  45, 44, 43, 42, 41, 40, 39, 38, 37, 36,
  35, 34, 33
];

async function deleteDatePostsRemote() {
  console.log(`Deleting ${datePostIds.length} posts with date-only titles from REMOTE database...`);
  
  try {
    // Delete all posts in a single command for efficiency
    const idsToDelete = datePostIds.join(',');
    const deleteCommand = `wrangler d1 execute jonsson-photoblog-prod --remote --command "DELETE FROM posts WHERE id IN (${idsToDelete})"`;
    
    console.log('Executing batch delete...');
    execSync(deleteCommand, { stdio: 'inherit' });
    console.log('✓ Batch delete completed');
    
    console.log('\nVerifying remaining posts...');
    
    // List remaining posts
    const listCommand = `wrangler d1 execute jonsson-photoblog-prod --remote --command "SELECT id, title FROM posts WHERE published = 1 ORDER BY created_at DESC"`;
    execSync(listCommand, { stdio: 'inherit' });
    
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

deleteDatePostsRemote();