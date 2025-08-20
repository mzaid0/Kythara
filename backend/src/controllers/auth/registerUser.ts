import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { prisma } from "../../configs/prisma"

interface RegisterUserBody {
    name: string
    email: string
    password: string
}

interface ResponseBody {
    success: boolean
    message: string
    userId: string
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {

    try {

        const { name, email, password } = req.body as RegisterUserBody

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exist"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER"
            }
        })

        const responseBody: ResponseBody = {
            success: true,
            message: "User registered successfully",
            userId: user.id
        }

        res.status(201).json(responseBody)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Registration failed" })
    }

}