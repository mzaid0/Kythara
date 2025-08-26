import { z } from "zod"

export const productSchema = z.object({

    name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name must be at most 100 characters long"),

    brand: z.string().min(2, "Brand must be at least 2 characters long").max(50, "Brand must be at most 50 characters long"),

    description: z.string().min(10, "Description must be at least 10 characters long").max(500, "Description must be at most 500 characters long"),

    category: z.string().min(2, "Category must be at least 2 characters long").max(50, "Category must be at most 50 characters long"),

    gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS_BOYS", "KIDS_GIRLS", "KIDS_UNISEX"], {
        message: "Gender is required"
    }),

    sizes: z.array(z.string().min(1)).min(1, "At least one size is required"),

    colors: z.array(z.string().min(1)).min(1, "At least one color is required"),

    price: z.number().min(0, "Price must be a positive number"),

    stock: z.number().min(0, "Stock must be a positive number"),

    soldCount: z.number().min(0, "Sold count must be a positive number").default(0),

    rating: z.number().optional(),

    images: z.array(z.string().min(1)).min(1, "At least one image is required"),

    isFeatured: z.boolean().optional(),

    status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"], {
        message: "Status is required"
    })
})

export type ProductValues = z.infer<typeof productSchema>