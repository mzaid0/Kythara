import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

type Role = "USER" | "SUPER_ADMIN";

type JwtPayload = {
    userId: string;
    name: string | null;
    email: string;
    role: Role;
    exp?: number;
    iat?: number;
};

const publicRoutes = ["/register", "/login"]
const superAdminRoutes = ["/super-admin", "/super-admin/:path*"]
const userRoutes = ["/"]

async function verifyJwt(token: string) {

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
}

export async function middleware(request: NextRequest) {

    const accessToken = request.cookies.get("accessToken")?.value
    const { pathname } = request.nextUrl

    if (accessToken) {

        try {
            const user = await verifyJwt(accessToken);

            if (publicRoutes.includes(pathname)) {
                return NextResponse.redirect(new URL(user.role === "SUPER_ADMIN" ? "/super-admin" : "/", request.url))
            }

            if (user.role === "SUPER_ADMIN" && userRoutes.some((route) => pathname.startsWith(route))) {
                return NextResponse.redirect(new URL("/super-admin", request.url))
            }

            if (user.role === "USER" && superAdminRoutes.some((route) => pathname.startsWith(route))) {
                return NextResponse.redirect(new URL("/", request.url))
            }

            return NextResponse.next()

        } catch (e) {
            console.log("Token verification failed", e)

            try {
                const refreshResponse = await fetch("http://localhost:4000/api/auth/refresh-token", {
                    method: "POST",
                    headers: {
                        'Cookie': request.headers.get('cookie') || ''
                    }
                })

                if (refreshResponse.ok) {

                    const data = await refreshResponse.json().catch(() => null)

                    if (data && data.accessToken) {
                        const response = NextResponse.next()
                        response.cookies.set("accessToken", data.accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax'
                        })
                        return response
                    }

                    const setCookieHeader = refreshResponse.headers.get("Set-Cookie")

                    if (setCookieHeader) {

                        const tokenMatch = setCookieHeader.match(/accessToken=([^;]+)/)
                        if (tokenMatch) {
                            const response = NextResponse.next()
                            response.cookies.set("accessToken", tokenMatch[1], {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax'
                            })
                            return response
                        }
                    }
                }

                const response = NextResponse.redirect(new URL("/login", request.url))
                response.cookies.delete("accessToken")
                response.cookies.delete("refreshToken")
                return response

            } catch (refreshError) {
                console.log("Refresh token failed", refreshError)
                const response = NextResponse.redirect(new URL("/login", request.url))
                response.cookies.delete("accessToken")
                response.cookies.delete("refreshToken")
                return response
            }
        }
    }

    if (!publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|.*\\..*).*)',
    ],
};