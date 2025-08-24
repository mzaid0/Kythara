import { Request, Response } from "express";
import cloudinary from "../../configs/cloudinary";
import { Readable } from "stream";

interface ResponseBody {
    success: boolean;
    message: string;
    imageUrls?: string[];
}

const uploadFromBuffer = (buffer: Buffer, folder: string): Promise<any> => {

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });

        const readableStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            },
        });

        readableStream.pipe(uploadStream);
    });
};

export const uploadImages = async (req: Request, res: Response): Promise<void> => {

    try {
        const files = (req.files as Express.Multer.File[]) || [];

        if (files.length === 0) {
            res.status(400).json({
                success: false,
                message: "No image files provided",
            } as ResponseBody);
            return;
        }

        const results = await Promise.all(files.map((file) => uploadFromBuffer(file.buffer, "kythara")));

        const imageUrls = results.map((r) => r.secure_url);

        res.status(200).json({
            success: true,
            message:
                files.length === 1
                    ? "Image uploaded successfully"
                    : `${files.length} images uploaded successfully`,
            imageUrls,
        } as ResponseBody);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload image(s)",
        } as ResponseBody);
    }
};
