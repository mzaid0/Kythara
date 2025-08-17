import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { generateToken, setTokensInCookies } from "../../helpers/auth-helpers";

interface CookieTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {

    const { refreshToken } = (req.cookies || {}) as CookieTokens;

    if (!refreshToken) {
        res.status(400).json({
            success: false,
            message: "Invalid refresh token "
        })
        return
    }

    try {

        const user = await prisma.user.findFirst({
            where: { refreshToken }
        })

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not found"
            })
            return
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken({
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        })

        await setTokensInCookies({ res, accessToken, refreshToken: newRefreshToken })

        res.status(200).json({
            success: true,
            message: "Refresh token refreshed successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Refresh token error" })

    }

}