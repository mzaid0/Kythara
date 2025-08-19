"use server"
import { protectAuthRules } from "@/arcjet/protectAuthRules"
import { request } from "@arcjet/next"

interface ErrorResponseBody {
    message: string
    success: boolean
    status: number
}

interface SuccessResponseBody {
    message: string
    success: boolean
    status: number
}

export const protectAuthActions = async (email: string): Promise<ErrorResponseBody | SuccessResponseBody> => {
    try {
        const req = await request()

        const decision = await protectAuthRules.protect(req, { email })

        if (decision.isDenied()) {

            if (decision.reason.isEmail()) {

                const emailTypes = decision.reason.emailTypes

                if (emailTypes.includes("DISPOSABLE")) {
                    return {
                        message: "Disposable email addresses are not allowed",
                        success: false,
                        status: 403
                    }
                }

                else if (emailTypes.includes("INVALID")) {
                    return {
                        message: "Invalid email address format",
                        success: false,
                        status: 400
                    }
                }

                else if (emailTypes.includes("NO_MX_RECORDS")) {
                    return {
                        message: "Email domain doesn't have valid MX records. Please try a different email.",
                        success: false,
                        status: 400
                    }
                }
            }

            else if (decision.reason.isBot()) {
                return {
                    message: "Bot activity detected. Please try again.",
                    success: false,
                    status: 403
                }
            }

            else if (decision.reason.isRateLimit()) {
                return {
                    message: "Too many attempts. Please try again later.",
                    success: false,
                    status: 429
                }
            }

            return {
                message: "Request blocked. Please try again later.",
                success: false,
                status: 403
            }
        }

        return {
            message: "Email validation passed",
            success: true,
            status: 200
        }

    } catch (error) {
        console.error("ArcJet protection error:", error)
        return {
            message: "Validation service temporarily unavailable. Please try again.",
            success: false,
            status: 503
        }
    }
}