import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";

export const deleteBrand = async (req: Request, res: Response) => {

    try {

        const { id } = req.params as { id: string }

        const findBrand = await prisma.brand.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!findBrand) {
            res.status(404).json({ message: "Brand not found." });
            return
        }

        await prisma.brand.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({ message: "Brand deleted successfully." });

    } catch (error) {
        console.error("Error deleting brand:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}