import axios from "axios"
import { apiRoutes } from "./apiRoutes"

export const axiosClient = axios.create({
    baseURL: apiRoutes.AUTH,
    withCredentials: true
})