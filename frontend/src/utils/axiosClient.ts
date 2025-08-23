"use client"
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

export const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
})

axiosClient.interceptors.response.use(

    (response) => response,

    async (error: AxiosError) => {

        console.log("Response error:", error.response?.status, error.response?.data);

        const originalRequest = error.config as RetryableConfig

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

            originalRequest._retry = true

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                return axiosClient(originalRequest);

            } catch (refreshError: unknown) {
                console.log("Refresh failed:", refreshError);

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)