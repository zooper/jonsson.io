import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect to local SQLite database
const db = new Database(path.join(__dirname, '../photoblog.db'));

function escapeString(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function formatValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'string') return escapeString(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return value;
}

function generateInsertStatements(tableName, data) {
  if (data.length === 0) return '';
  
  const columns = Object.keys(data[0]);
  let sql = `-- Insert data for ${tableName}\n`;
  
  for (const row of data) {
    const values = columns.map(col => formatValue(row[col])).join(', ');
    sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
  }
  
  return sql + '\n';
}

async function exportData() {
  console.log('🚀 Exporting data from local database...');
  
  let exportSql = `-- Data export from local SQLite database to D1
-- Generated on ${new Date().toISOString()}

-- Disable foreign key checks temporarily
PRAGMA foreign_keys = OFF;

`;

  // Export in dependency order to avoid foreign key issues
  
  // 1. Export images first (no dependencies)
  const images = db.prepare('SELECT * FROM images ORDER BY id').all();
  console.log(`🖼️  Exporting ${images.length} images...`);
  exportSql += generateInsertStatements('images', images);

  // 2. Export image EXIF data (depends on images)
  const exifData = db.prepare('SELECT * FROM image_exif ORDER BY id').all();
  console.log(`📊 Exporting ${exifData.length} EXIF records...`);
  exportSql += generateInsertStatements('image_exif', exifData);

  // 3. Export posts (may reference images as featured_image_id)
  const posts = db.prepare('SELECT * FROM posts ORDER BY id').all();
  console.log(`📝 Exporting ${posts.length} posts...`);
  exportSql += generateInsertStatements('posts', posts);

  // 4. Export post_images relationships (depends on posts and images)
  const postImages = db.prepare('SELECT * FROM post_images ORDER BY id').all();
  console.log(`🔗 Exporting ${postImages.length} post-image relationships...`);
  exportSql += generateInsertStatements('post_images', postImages);

  // 5. Export gallery (depends on images)
  const gallery = db.prepare('SELECT * FROM gallery ORDER BY id').all();
  console.log(`🎨 Exporting ${gallery.length} gallery items...`);
  exportSql += generateInsertStatements('gallery', gallery);

  // 6. Export about page (may reference images) - use UPDATE instead of INSERT
  const aboutPage = db.prepare('SELECT * FROM about_page ORDER BY id').all();
  console.log(`📄 Exporting ${aboutPage.length} about page records...`);
  if (aboutPage.length > 0) {
    const page = aboutPage[0];
    exportSql += `-- Update about page\n`;
    exportSql += `UPDATE about_page SET 
      title = ${formatValue(page.title)}, 
      lead_text = ${formatValue(page.lead_text)}, 
      content = ${formatValue(page.content)}, 
      profile_image_id = ${formatValue(page.profile_image_id)}, 
      updated_at = ${formatValue(page.updated_at)}
      WHERE id = 1;\n\n`;
  }

  // 7. Export tags (no dependencies)
  const tags = db.prepare('SELECT * FROM tags ORDER BY id').all();
  console.log(`🏷️  Exporting ${tags.length} tags...`);
  exportSql += generateInsertStatements('tags', tags);

  // 8. Export post_tags (depends on posts and tags)
  const postTags = db.prepare('SELECT * FROM post_tags ORDER BY id').all();
  console.log(`🏷️  Exporting ${postTags.length} post-tag relationships...`);
  exportSql += generateInsertStatements('post_tags', postTags);

  // 9. Export site settings (excluding the theme we already set)
  const siteSettings = db.prepare('SELECT * FROM site_settings WHERE setting_key != ? ORDER BY id').all('theme');
  console.log(`⚙️  Exporting ${siteSettings.length} site settings...`);
  exportSql += generateInsertStatements('site_settings', siteSettings);

  // 10. Export social links (update existing ones and add new ones)
  const allSocialLinks = db.prepare('SELECT * FROM social_links ORDER BY id').all();
  console.log(`🔗 Exporting ${allSocialLinks.length} social links...`);
  
  for (const link of allSocialLinks) {
    if (link.id <= 2) {
      // Update existing default links
      exportSql += `-- Update social link ${link.id}\n`;
      exportSql += `UPDATE social_links SET 
        platform = ${formatValue(link.platform)}, 
        label = ${formatValue(link.label)}, 
        url = ${formatValue(link.url)}, 
        icon_svg = ${formatValue(link.icon_svg)}, 
        sort_order = ${formatValue(link.sort_order)}, 
        visible = ${formatValue(link.visible)}, 
        updated_at = ${formatValue(link.updated_at)}
        WHERE id = ${link.id};\n`;
    } else {
      // Insert new links
      const values = [link.id, link.platform, link.label, link.url, link.icon_svg, link.sort_order, link.visible, link.created_at, link.updated_at]
        .map(formatValue).join(', ');
      exportSql += `INSERT INTO social_links (id, platform, label, url, icon_svg, sort_order, visible, created_at, updated_at) VALUES (${values});\n`;
    }
  }
  exportSql += '\n';
  
  // Re-enable foreign key checks
  exportSql += '-- Re-enable foreign key checks\nPRAGMA foreign_keys = ON;\n';

  // Write to file
  const exportPath = path.join(__dirname, '../data-export.sql');
  fs.writeFileSync(exportPath, exportSql);
  
  console.log(`✅ Data exported to: ${exportPath}`);
  console.log(`📊 Summary:`);
  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Images: ${images.length}`);
  console.log(`   - EXIF records: ${exifData.length}`);
  console.log(`   - Gallery items: ${gallery.length}`);
  console.log(`   - Social links: ${allSocialLinks.length}`);
  console.log(`   - About pages: ${aboutPage.length}`);
  console.log(`   - Site settings: ${siteSettings.length}`);
  
  db.close();
  return exportPath;
}

exportData().catch(console.error);