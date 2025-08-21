import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";
import { Product } from "@prisma/client";

interface ResponseBody {
    success: boolean
    message: string
    count: number
    allProducts: Product[]
}

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {

    try {
        const allProducts = await prisma.product.findMany();

        if (allProducts.length === 0 || !allProducts) {
            res.status(404).json({
                success: false,
                message: "No products found"
            });
            return;
        }

        const responseBody: ResponseBody = {
            success: true,
            message: "Products fetched successfully",
            count: allProducts.length,
            allProducts
        }

        res.status(200).json(responseBody)

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};