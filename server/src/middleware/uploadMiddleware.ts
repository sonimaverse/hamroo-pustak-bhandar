import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';

// Configure Multer memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

/**
 * Upload buffer to Cloudinary or return Base64 data URI if Cloudinary credentials are not set
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'hamro_pustak_bhandar/covers'
): Promise<string> => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isCloudinaryConfigured =
    cloudName &&
    apiKey &&
    apiSecret &&
    cloudName !== 'your_cloud_name' &&
    apiKey !== 'your_api_key';

  if (!isCloudinaryConfigured) {
    console.warn(
      '⚠️ Cloudinary credentials are not configured. Saving image as Data URI payload.'
    );
    const base64 = fileBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Failed to upload image to Cloudinary: ${error.message}`));
        } else {
          resolve(result?.secure_url || result?.url || '');
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
