import B2 from 'backblaze-b2';
import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';
import { extractExifData } from './exif.js';

let b2Instance;

export function initB2() {
  if (!b2Instance) {
    const applicationKeyId = process.env.B2_APPLICATION_KEY_ID || process.env.B2_ACCOUNT_ID;
    const applicationKey = process.env.B2_APPLICATION_KEY || process.env.B2_ACCOUNT_KEY;
    
    if (!applicationKeyId) {
      throw new Error('B2_APPLICATION_KEY_ID or B2_ACCOUNT_ID environment variable is required');
    }
    
    if (!applicationKey) {
      throw new Error('B2_APPLICATION_KEY or B2_ACCOUNT_KEY environment variable is required');
    }
    
    
    b2Instance = new B2({
      applicationKeyId: applicationKeyId,
      applicationKey: applicationKey
    });
  }
  return b2Instance;
}

export async function uploadImageToB2(buffer, originalFilename, mimeType) {
  const b2 = initB2();
  
  try {
    // Authorize with B2
    await b2.authorize();
    
    // Generate unique filename with blog folder structure
    const ext = path.extname(originalFilename);
    const hash = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Organize by year/month: blog/images/2024/12/filename
    const filename = `blog/images/${year}/${month}/${timestamp}-${hash}${ext}`;
    
    // Extract EXIF data from original image before processing
    let exifData = null;
    if (mimeType.startsWith('image/')) {
      exifData = await extractExifData(buffer);
    }
    
    // Process image with Sharp (resize, optimize, but preserve EXIF)
    let processedBuffer = buffer;
    let metadata = {};
    
    if (mimeType.startsWith('image/')) {
      const image = sharp(buffer);
      metadata = await image.metadata();
      
      // For formats that support EXIF, preserve it during processing
      const keepExif = mimeType === 'image/jpeg' || mimeType === 'image/tiff';
      
      // Resize if too large (max 2000px width)
      if (metadata.width > 2000) {
        let processedImage = image
          .resize(2000, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true });
        
        if (keepExif) {
          processedImage = processedImage.keepExif();
        }
        
        processedBuffer = await processedImage.toBuffer();
      } else {
        let processedImage = image
          .jpeg({ quality: 85, progressive: true });
        
        if (keepExif) {
          processedImage = processedImage.keepExif();
        }
        
        processedBuffer = await processedImage.toBuffer();
      }
      
      // Get updated metadata after processing
      const processedImage = sharp(processedBuffer);
      metadata = await processedImage.metadata();
    }
    
    // Get upload URL
    const uploadUrl = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID
    });
    
    // Upload file
    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: filename,
      data: processedBuffer,
      mime: mimeType,
      info: {
        originalName: originalFilename
      }
    });
    
    // For us-west-001 region, use the proper URL format
    // Since your bucket is public, we should be able to access it directly
    const publicUrl = `https://${process.env.B2_BUCKET_NAME}.s3.us-west-001.backblazeb2.com/${filename}`;
    
    
    return {
      fileId: uploadResponse.data.fileId,
      filename: filename,
      originalFilename: originalFilename,
      url: publicUrl,
      width: metadata.width || null,
      height: metadata.height || null,
      fileSize: processedBuffer.length,
      mimeType: mimeType,
      exifData: exifData
    };
    
  } catch (error) {
    console.error('Error uploading to B2:', error);
    throw new Error('Failed to upload image to storage');
  }
}

export async function deleteImageFromB2(fileId, filename) {
  const b2 = initB2();
  
  try {
    await b2.authorize();
    
    await b2.deleteFileVersion({
      fileId: fileId,
      fileName: filename
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting from B2:', error);
    throw new Error('Failed to delete image from storage');
  }
}

export async function generateThumbnail(buffer, width = 300, height = 300) {
  try {
    return await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw new Error('Failed to generate thumbnail');
  }
}