import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";
import { Product } from "@prisma/client";

interface ResponseBody {
    success: boolean
    message: string
    product: Product
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {

    try {
        const { name, brand, description, category, colors, gender, price, sizes, stock, images } = req.body as Product;

        const newProduct = await prisma.product.create({
            data: {
                name,
                brand,
                description,
                category,
                gender,
                colors: typeof colors === 'string' ? JSON.parse(colors) : colors,
                sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
                price: Number(price),
                stock: Number(stock),
                soldCount: 0,
                rating: null,
                images: typeof images === 'string' ? JSON.parse(images) : images,
                isFeatured: false
            }
        })

        const responseBody: ResponseBody = {
            success: true,
            message: "Product created successfully",
            product: newProduct
        }

        res.status(201).json(responseBody);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
}