import { z } from "zod"

export const productSchema = z.object({

    name:
        z.string()
            .min(2, "Name must be at least 2 characters long")
            .max(100, "Name must be at most 100 characters long"),

    brand:
        z.string()
            .min(2, "Brand must be at least 2 characters long")
            .max(50, "Brand must be at most 50 characters long"),

    description:
        z.string()
            .min(10, "Description must be at least 10 characters long")
            .max(500, "Description must be at most 500 characters long"),

    gender:
        z.enum(["MEN", "WOMEN", "MEN_AND_WOMEN", "KIDS_BOY", "KIDS_GIRL", "KIDS_BOYS_AND_GIRL"], {
            message: "Gender is required"
        }),

    price:
        z.number()
            .min(0, "Price must be a positive number"),

    stock:
        z.number()
            .min(0, "Stock must be a positive number"),

    soldCount:
        z.number()
            .min(0, "Sold count must be a positive number")
            .default(0),

    rating:
        z.number()
            .min(0)
            .max(5)
            .optional(),

    isFeatured:
        z.boolean()
            .default(false),

    isOnSale:
        z.boolean()
            .default(false),

    status:
        z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"])
            .default("ACTIVE"),

    categoryId:
        z.number()
            .min(1, "Category ID is required"),

    imageUrls:
        z.array(z.string().url("Invalid image URL"))
            .min(1, "At least one image is required"),

    specifications:
        z.array(z.object({
            specKey: z.string().min(1, "Specification key is required"),
            specValue: z.string().min(1, "Specification value is required")
        })).optional().default([])
})

export type ProductSchemaValidator = z.infer<typeof productSchema>
export type ProductSchemaValues = z.input<typeof productSchema>