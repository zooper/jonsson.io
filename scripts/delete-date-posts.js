#!/usr/bin/env node

/**
 * Delete posts with generic date titles from D1 database
 */

import { execSync } from 'child_process';

// Posts with date-only titles to delete
const datePostIds = [
  55, 54, 53, 52, 51, 50, 49, 48, 47, 46,
  45, 44, 43, 42, 41, 40, 39, 38, 37, 36,
  35, 34, 33
];

async function deleteDatePosts() {
  console.log(`Deleting ${datePostIds.length} posts with date-only titles...`);
  
  try {
    for (const postId of datePostIds) {
      console.log(`Deleting post ID ${postId}...`);
      
      // Delete the post using wrangler d1 execute
      const deleteCommand = `wrangler d1 execute jonsson-photoblog-prod --command "DELETE FROM posts WHERE id = ${postId}"`;
      
      try {
        execSync(deleteCommand, { stdio: 'inherit' });
        console.log(`✓ Deleted post ID ${postId}`);
      } catch (error) {
        console.error(`✗ Failed to delete post ID ${postId}:`, error.message);
      }
    }
    
    console.log('\nCleanup completed!');
    console.log('Verifying remaining posts...');
    
    // List remaining posts
    const listCommand = `wrangler d1 execute jonsson-photoblog-prod --command "SELECT id, title FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 10"`;
    execSync(listCommand, { stdio: 'inherit' });
    
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

deleteDatePosts();