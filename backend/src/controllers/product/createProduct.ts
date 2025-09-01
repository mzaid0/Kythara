import { Gender, Product } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";

interface ProductInput {
    name: string;
    brand: string;
    description: string;
    gender: Gender;
    price: number;
    stock: number;
    isFeatured?: boolean;
    isOnSale?: boolean;
    categoryId: number;
    imageUrls: string[];
    specifications?: {
        specKey: string;
        specValue: string;
    }[];
}

interface ResponseBody {
    success: boolean;
    message: string;
    product?: Product;
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {

    try {
        const { name, brand, description, gender, price, stock, isFeatured = false, isOnSale = false, categoryId, imageUrls, specifications = [] } = req.body as ProductInput;


        if (!imageUrls || imageUrls.length === 0) {
            res.status(400).json({
                success: false,
                message: "At least one image URL is required"
            } as ResponseBody);
            return;
        }

        const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!categoryExists) {
            res.status(400).json({
                success: false,
                message: "Category not found"
            } as ResponseBody);
            return;
        }

        const createdProduct = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    name,
                    brand,
                    description,
                    gender,
                    price,
                    stock,
                    isFeatured,
                    isOnSale,
                    categoryId,
                    images: {
                        connectOrCreate: imageUrls.map(url => ({
                            where: { url },
                            create: { url }
                        }))
                    }
                }
            });

            if (specifications.length > 0) {
                await tx.productSpecification.createMany({
                    data: specifications.map(spec => ({
                        specKey: spec.specKey,
                        specValue: spec.specValue,
                        productId: product.id
                    }))
                });
            }

            return product;
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product:createdProduct
        } as ResponseBody);

    } catch (error) {
        console.error("Product creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        } as ResponseBody);
    }
};