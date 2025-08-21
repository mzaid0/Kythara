import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";
import { Product } from "@prisma/client";
import cloudinary from "../../configs/cloudinary";
import { unlinkSync } from "fs";

interface GetProductParams {
    id: string;
}

interface ResponseBody {
    success: boolean
    message: string
    product: Product
}

export const updateProduct = async (req: Request<GetProductParams>, res: Response): Promise<void> => {

    try {
        const { id } = req.params;

        const productId = Number(id);

        const { name, brand, description, category, colors, gender, price, sizes, stock, isFeatured } = req.body;

        const files = req.files as Express.Multer.File[];

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

        let images = existingProduct.images;

        if (files && files.length > 0) {
            if (existingProduct.images && existingProduct.images.length > 0) {
                const deletePromises = existingProduct.images.map(imageUrl => {
                    const publicId = imageUrl.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        return cloudinary.uploader.destroy(`kythara/${publicId}`);
                    }
                });
                await Promise.all(deletePromises.filter(Boolean));
            }

            const uploadResults = await Promise.all(
                files.map(file => cloudinary.uploader.upload(file.path, { folder: "kythara" }))
            );
            images = uploadResults.map(result => result.secure_url);
            files.forEach(file => unlinkSync(file.path));
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: name || existingProduct.name,
                brand: brand || existingProduct.brand,
                description: description || existingProduct.description,
                category: category || existingProduct.category,
                gender: gender || existingProduct.gender,
                colors: colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : existingProduct.colors,
                sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : existingProduct.sizes,
                price: price ? Number(price) : existingProduct.price,
                stock: stock !== undefined ? Number(stock) : existingProduct.stock,
                isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingProduct.isFeatured,
                images
            }
        });

        const responseBody: ResponseBody = {
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        }

        res.status(200).json(responseBody);

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};