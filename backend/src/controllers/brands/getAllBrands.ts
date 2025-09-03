import { Brand } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../configs/prisma";

interface BrandQueryParams {
    search?: string
}

export const getAllBrands = async (req: Request, res: Response) => {

    try {

        const { search } = req.query as BrandQueryParams

        let query = {}

        if (search) {
            query = {
                name: {
                    contains: search.trim(),
                    mode: "insensitive"
                }
            }
        }

        const brands: Brand[] = await prisma.brand.findMany({
            where: query,
            orderBy: { createdAt: "desc" },
            take: 20
        })

        return res.json(brands)

    } catch (error) {
        console.error("Error fetching brands:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}