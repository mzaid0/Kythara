import { z } from "zod";

export const registerSchema = z.object({

    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().min(1, "Email is required").email("Enter a valid email"),

    password: z.string().min(6, "Password must be at least 6 characters"),

});
export type RegisterValues = z.infer<typeof registerSchema>;


export const loginSchema = z.object({

    email: z.string().min(1, "Email is required").email("Enter a valid email"),

    password: z.string().min(6, "Password must be at least 6 characters"),
    
});

export type LoginValues = z.infer<typeof loginSchema>;