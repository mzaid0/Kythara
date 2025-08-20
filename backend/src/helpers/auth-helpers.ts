import { Response } from "express"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"

interface GenerateTokenProps {
    userId: string
    name: string | null
    email: string
    role: "USER" | "SUPER_ADMIN"
}

interface SetTokensInCookiesProps {
    res: Response
    accessToken: string
    refreshToken: string
}

export const generateToken = ({ userId, name, email, role, }: GenerateTokenProps) => {

    const accessToken = jwt.sign({
        userId, name, email, role
    }, process.env.JWT_SECRET as string, {
        expiresIn: "15m"
    })

    const refreshToken: string = uuid()

    return { accessToken, refreshToken }
}

export async function setTokensInCookies({ res, accessToken, refreshToken }: SetTokensInCookiesProps) {

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

}