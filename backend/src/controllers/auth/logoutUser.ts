import { Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response) => {

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    res.status(200).json({
        success: true,
        message: "User Loggout successfully"
    })

}