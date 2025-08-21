import { Request, Response } from "express";
import cloudinary from "../../configs/cloudinary";
import { prisma } from "../../configs/prisma";
import { unlinkSync } from "fs";
import { Product } from "@prisma/client";

interface ResponseBody {
    success: boolean
    message: string
    product: Product
}

export const createProduct = async (req: Request, res: Response) => {

    try {

        const { name, brand, description, category, colors, gender, price, sizes, stock } = req.body as Product

        const files = req.files as Express.Multer.File[]

        const uploadImagesPromise = files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "kythara"
            })
        })

        const uploadResults = await Promise.all(uploadImagesPromise)

        const images = uploadResults.map(image => image.secure_url)

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
                images,
                isFeatured: false
            }
        })

        files.forEach(file => unlinkSync(file.path))

        const responseBody: ResponseBody = {
            success: true,
            message: "Product created successfully!",
            product: newProduct
        }

        res.status(201).json(responseBody)

    } catch (error) {
        console.error("Error creating product:", error)
        res.status(500).json({
            success: false,
            message: "Failed to create product"
        })
    }
}