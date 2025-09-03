import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";

export const updateBrand = async (req: Request, res: Response) => {

    const { id } = req.params as { id: string }

    const { name } = req.body as { name?: string }

    if (!name || name.trim().length === 0) {
        res.status(400).json({ message: "Invalid brand name." });
        return
    }

    try {

        const duplicateBrand = await prisma.brand.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: "insensitive"
                },
                NOT: { id: Number(id) }
            }
        });

        if (duplicateBrand) {
            res.status(409).json({ message: "Brand with this name already exists." });
            return;
        }

        const updatedBrand = await prisma.brand.update({
            where: { id: Number(id) },
            data: { name: name.trim() }
        });

        res.status(200).json({ message: "Brand updated successfully.", brand: updatedBrand });

    } catch (error) {
        console.error("Error updating brand:", error);
        res.status(500).json({ message: "Internal server error." });
    }

}