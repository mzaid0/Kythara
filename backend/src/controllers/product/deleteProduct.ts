import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";
import { Product } from "@prisma/client";
import cloudinary from "../../configs/cloudinary";

interface GetProductParams {
    id: string;
}

interface ResponseBody {
    success: boolean
    message: string
    product: Product
}

export const deleteProduct = async (req: Request<GetProductParams>, res: Response): Promise<void> => {
    
    try {
        const { id } = req.params;

        const productId = Number(id);

        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }

        if (existingProduct.images && existingProduct.images.length > 0) {

            const deletePromises = existingProduct.images.map(imageUrl => {

                const publicId = imageUrl.split('/').pop()?.split('.')[0];

                if (publicId) {
                    return cloudinary.uploader.destroy(`kythara/${publicId}`);
                }

            });

            await Promise.all(deletePromises);
        }

        const deletedProduct = await prisma.product.delete({
            where: { id: productId }
        });

        const responseBody: ResponseBody = {
            success: true,
            message: "Product deleted successfully",
            product: deletedProduct
        }

        res.status(200).json(responseBody);

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};