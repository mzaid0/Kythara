import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";
import { Brand } from "@prisma/client";

export const createBrand = async (req: Request, res: Response) => {

    try {

        const { name } = req.body as { name: string }

        if (!name || name.trim().length === 0) {
            res.status(400).json({ message: "Brand name is required." });
            return
        }

        const existingBrand = await prisma.brand.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: "insensitive"
                }
            }
        })

        if (existingBrand) {
            res.status(409).json({ message: "Brand with this name already exists." });
            return
        }

        const newBrand: Brand = await prisma.brand.create({
            data: {
                name: name.trim()
            }
        })

        return res.status(201).json({ message: "Brand created successfully.", brand: newBrand });

    } catch (error) {
        console.error("Error creating brand:", error);
        return res.status(500).json({ message: "Internal server error." });
    }

}