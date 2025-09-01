import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";
import { Product } from "@prisma/client";

interface GetProductParams {
    id: string;
}

interface ResponseBody {
    success: boolean;
    message: string;
    product?: Product;
}

export const updateProduct = async (req: Request<GetProductParams>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productId = Number(id);

        const { name, brand, description, gender, price, stock, isFeatured, isOnSale, categoryId, imageUrls, specifications } = req.body;

        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                images: true,
                specifications: true
            }
        });

        if (!existingProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            } as ResponseBody);
            return;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: name || existingProduct.name,
                brand: brand || existingProduct.brand,
                description: description || existingProduct.description,
                gender: gender || existingProduct.gender,
                price: price ? Number(price) : existingProduct.price,
                stock: stock !== undefined ? Number(stock) : existingProduct.stock,
                isFeatured: isFeatured !== undefined ? isFeatured : existingProduct.isFeatured,
                isOnSale: isOnSale !== undefined ? isOnSale : existingProduct.isOnSale,
                categoryId: categoryId ? Number(categoryId) : existingProduct.categoryId,
                images: imageUrls ? {
                    set: [],
                    connectOrCreate: imageUrls.map((url: string) => ({
                        where: { url },
                        create: { url }
                    }))
                } : undefined,
                specifications: specifications ? {
                    deleteMany: {},
                    create: specifications.map((spec: any) => ({
                        specKey: spec.specKey,
                        specValue: spec.specValue
                    }))
                } : undefined
            }
        });

        const responseBody: ResponseBody = {
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        };

        res.status(200).json(responseBody);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update product"
        } as ResponseBody);
    }
};