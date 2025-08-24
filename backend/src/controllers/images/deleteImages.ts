import { Request, Response } from "express";
import cloudinary from "../../configs/cloudinary";

interface ResponseBody {
    success: boolean;
    message: string;
    deletedImages?: string[];
}

interface DeleteImagesBody {
    imageUrl?: string;
    imageUrls?: string[];
}

const getPublicIdFromUrl = (url: string): string => {

    const parts = url.split('/');

    const filename = parts[parts.length - 1];

    const folderName = parts[parts.length - 2];

    return `${folderName}/${filename.split('.')[0]}`;
};

export const deleteImages = async (req: Request, res: Response): Promise<void> => {

    try {
        const { imageUrl, imageUrls } = req.body as DeleteImagesBody;

        if (imageUrl && !imageUrls) {

            const publicId = getPublicIdFromUrl(imageUrl);

            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result === 'ok') {
                res.status(200).json({
                    success: true,
                    message: "Image deleted successfully",
                    deletedImages: [imageUrl]
                } as ResponseBody);
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Failed to delete image"
                } as ResponseBody);
            }
            return;
        }

        if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {

            const publicIds = imageUrls.map(url => getPublicIdFromUrl(url));

            const results = await Promise.all(
                publicIds.map(id => cloudinary.uploader.destroy(id))
            );

            const allSuccessful = results.every(result => result.result === 'ok');

            if (allSuccessful) {
                res.status(200).json({
                    success: true,
                    message: "All images deleted successfully",
                    deletedImages: imageUrls
                } as ResponseBody);
            }
            else {
                
                const successfulDeletes = results.map((result, index) => result.result === 'ok' ? imageUrls[index] : null)
                .filter(Boolean) as string[];

                res.status(207).json({
                    success: true,
                    message: "Some images could not be deleted",
                    deletedImages: successfulDeletes
                } as ResponseBody);
            }
            return;
        }

        res.status(400).json({
            success: false,
            message: "No image URLs provided"
        } as ResponseBody);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to delete image(s)"
        } as ResponseBody);
    }
};
