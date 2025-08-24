import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";
import { Product } from "@prisma/client";

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

        const { name, brand, description, category, colors, gender, price, sizes, stock, isFeatured, images } = req.body as Product;

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
                images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : existingProduct.images,
                isFeatured: isFeatured !== undefined ? isFeatured : existingProduct.isFeatured
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
        });
    }
}