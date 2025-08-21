import { Product } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";

interface GetProductParams {
    id: string;
}

interface ResponseBody {
    success: boolean
    message: string
    product: Product
}

export const getProductById = async (req: Request<GetProductParams>, res: Response): Promise<void> => {
    
    try {

        const { id } = req.params;

        const productId = Number(id);

        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        });

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }

        const responseBody: ResponseBody = {
            success: true,
            message: "Product fetched successfully",
            product
        }

        res.status(200).json(responseBody);

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};