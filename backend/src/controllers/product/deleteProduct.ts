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

export const deleteProduct = async (req: Request<GetProductParams>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const productId = Number(id);

        if (!productId) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID"
            } as ResponseBody);
            return;
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            } as ResponseBody);
            return;
        }

        const deletedProduct = await prisma.$transaction(async (tx) => {
            await tx.productSpecification.deleteMany({
                where: { productId: productId }
            });

            const product = await tx.product.delete({
                where: { id: productId }
            });

            return product;
        });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product: deletedProduct
        } as ResponseBody);

    } catch (error) {
        console.error("Product deletion error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        } as ResponseBody);
    }
};