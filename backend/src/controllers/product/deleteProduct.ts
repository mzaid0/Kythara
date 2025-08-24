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

        const deletedProduct = await prisma.product.delete({
            where: { id: productId }
        });

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product: deletedProduct
        } as ResponseBody);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
}