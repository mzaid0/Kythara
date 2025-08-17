import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { generateToken, setTokensInCookies } from "../../helpers/auth-helpers";

interface LoginUserBody {
    email: string
    password: string
}

interface ResponseBody {
    success: boolean
    message: string
    user: {
        id: string
        name: string | null
        email: string
        role: "USER" | "SUPER_ADMIN"
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {

    try {

        const { email, password } = req.body as LoginUserBody

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user || (await bcrypt.compare(password, user.password))) {

            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })

            return
        }

        const { accessToken, refreshToken } = generateToken(
            {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        )

        await setTokensInCookies({ res, accessToken, refreshToken })

        const responseBody: ResponseBody = {
            success: true,
            message: "Login successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }

        res.status(200).json(responseBody)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Login failed" })
    }

}