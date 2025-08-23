import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

type Role = "USER" | "SUPER_ADMIN";

type JwtPayload = {
    userId: string;
    name: string | null;
    email: string;
    role: Role;
    exp?: number;
    iat?: number;
};

const publicRoutes = ["/register", "/login"];

async function verifyJwt(token: string) {

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
}

export async function middleware(request: NextRequest) {

    const accessToken = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;

    const isPublic = publicRoutes.includes(pathname);

    const isRoot = pathname === "/";

    const isSuperAdminArea = pathname === "/super-admin" || pathname.startsWith("/super-admin/");

    if (accessToken) {

        try {
            const user = await verifyJwt(accessToken);

            if (isPublic) {
                return NextResponse.redirect(new URL(user.role === "SUPER_ADMIN" ? "/super-admin" : "/", request.url));
            }

            if (user.role === "SUPER_ADMIN") {
                if (isRoot) return NextResponse.redirect(new URL("/super-admin", request.url));
                return NextResponse.next();
            }

            if (user.role === "USER" && isSuperAdminArea) {
                return NextResponse.redirect(new URL("/", request.url));
            }

            return NextResponse.next();

        } catch {

            try {
                const refreshResponse = await fetch("http://localhost:4000/api/auth/refresh-token", {
                    method: "POST",
                    headers: { Cookie: request.headers.get("cookie") || "" },
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json().catch(() => null);
                    if (data?.accessToken) {
                        const response = NextResponse.next();
                        response.cookies.set("accessToken", data.accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                        });
                        return response;
                    }

                    const setCookie = refreshResponse.headers.get("Set-Cookie");

                    if (setCookie) {
                        const m = setCookie.match(/accessToken=([^;]+)/);
                        if (m) {
                            const response = NextResponse.next();
                            response.cookies.set("accessToken", m[1], {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                                sameSite: "lax",
                            });
                            return response;
                        }
                    }
                }

                const resp = NextResponse.redirect(new URL("/login", request.url));
                resp.cookies.delete("accessToken");
                resp.cookies.delete("refreshToken");
                return resp;

            } catch {
                const resp = NextResponse.redirect(new URL("/login", request.url));
                resp.cookies.delete("accessToken");
                resp.cookies.delete("refreshToken");
                return resp;
            }
        }
    }

    if (!isPublic) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg|.*\\..*).*)"],
};
