import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function axiosServer(): Promise<AxiosInstance> {

    const cookieStore = await cookies();

    const allCookies: RequestCookie[] = cookieStore.getAll();

    const cookieHeader: string = allCookies.map((cookie: RequestCookie) => `${cookie.name}=${cookie.value}`).join('; ');

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
        headers: {
            "Content-Type": "application/json",
            ...(cookieHeader && { "Cookie": cookieHeader })
        },
        timeout: 30000,
        withCredentials: true
    });
}