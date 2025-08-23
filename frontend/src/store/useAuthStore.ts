/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchErrorHandler } from "@/errors/errorHandler"
import { axiosClient } from "@/utils/axiosClient"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
    id: string
    name: string | null
    email: string
    role: "USER" | "SUPER_ADMIN"
}

interface RegisterBody {
    name: string
    email: string
    password: string
}

interface RegisterResponse {
    success: boolean
    message: string
    userId: string
}

interface LoginBody {
    email: string
    password: string
}

interface LoginResponse {
    success: boolean
    message: string
    user: User

}

interface LogoutResponse {
    success: boolean
    message: string
}

type AuthStore = {
    user: User | null
    isLoading: boolean
    error: string | null
    register: ({ name, email, password }: RegisterBody) => Promise<string | null>
    login: ({ email, password }: LoginBody) => Promise<boolean>
    logout: () => Promise<string | null>
    refreshAccessToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthStore>()(

    persist(
        (set, get) => ({

            user: null,
            isLoading: false,
            error: null,

            register: async ({ name, email, password }) => {

                set({ isLoading: true, error: null })

                try {

                    const response = await axiosClient.post<RegisterResponse>("/auth/register", {
                        name, email, password
                    })

                    set({ isLoading: false })
                    return response.data.userId

                } catch (error) {
                    catchErrorHandler(set, error)
                    return null
                }

            },

            login: async ({ email, password }) => {

                set({ isLoading: true, error: null })

                try {

                    const response = await axiosClient.post<LoginResponse>("/auth/login", {
                        email, password
                    })

                    set({ isLoading: false, user: response.data.user })
                    return true

                } catch (error) {
                    catchErrorHandler(set, error)
                    return false
                }
            },

            logout: async () => {

                set({ isLoading: true })

                try {

                    const response = await axiosClient.post<LogoutResponse>("/auth/logout")

                    set({ user: null, isLoading: false })
                    return response.data.message

                } catch (error) {
                    catchErrorHandler(set, error)
                    return null
                }

            },

            refreshAccessToken: async () => {

                try {

                    await axiosClient.post("/auth/refresh-token")
                    return true

                } catch (error) {
                    console.log(error)
                    return false
                }

            },
        }),

        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user })
        }
    )
)