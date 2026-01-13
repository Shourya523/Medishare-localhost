import { uploadImage } from './cloudinary.config';  
import { optimizeImage } from './sharp.config';  

export const processAndUploadFile = async (file: File): Promise<string | null> => {
  try {
    // Step 1: Optimize the image (resize and compress)
    const optimizedImageDataUri: string | null = (await optimizeImage(file)) ?? null;
    if (!optimizedImageDataUri) {
      throw new Error('Image optimization failed');
    }

    // Step 2: Upload the optimized image to Cloudinary
    const uploadedImageUrl: string | null = (await uploadImage(optimizedImageDataUri)) ?? null;
    if (!uploadedImageUrl) {
      throw new Error('Image upload failed');
    }

    // Return the secure URL of the uploaded image
    return uploadedImageUrl;
  } catch (error) {
    console.error('Error in processing and uploading file:', (error as Error).message);
    return null;
  }
};
