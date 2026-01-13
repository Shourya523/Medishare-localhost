import sharp from 'sharp';
import getDataUri from './dataURI'; // Import the getDataUri function

interface FileData {
  originalname: string;
  buffer: Buffer;
}

export const optimizeImage = async (file: FileData): Promise<string | null> => {
  try {
    // Step 1: Optimize the image using sharp
    const optimizedBuffer = await sharp(file.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' }) // Resize to a max width of 800px (maintain aspect ratio)
      .toFormat('jpeg', { quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    const dataUri = await getDataUri({
      originalname: file.originalname,
      buffer: optimizedBuffer,
    });

    return dataUri;
  } catch (error) {
    console.error('Error optimizing image:', (error as Error).message);
    return null;
  }
};
