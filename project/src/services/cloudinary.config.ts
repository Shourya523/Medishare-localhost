import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: import.meta.env.VITE_CLOUD_NAME as string, 
    api_key: import.meta.env.VITE_CLOUDINARY_API_KEY as string, 
    api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET as string
});

export const uploadImage = async (imageURL: string | null): Promise<string | null> => {
    if (!imageURL) return null;

    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(imageURL);

        console.log("✅ Image uploaded successfully:", cloudinaryResponse);

        return cloudinaryResponse.secure_url;
    } catch (error) {
        console.error("❌ Error in Cloudinary upload:", error);
        return null;
    }
};