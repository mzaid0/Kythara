import { NextFunction, Request, Response } from "express";

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {

    if (req.user && req.user.role === "SUPER_ADMIN") {
        next()
    }
    else {
        res.status(401).json({
            success: false,
            message: "Access Denied!",
        });
        return
    }

}