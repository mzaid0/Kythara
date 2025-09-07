import { showErrorToast } from "@/components/ui/toast"
import axios from "axios"

export const handleError = (error: unknown, fallbackMessage: string) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || fallbackMessage
        showErrorToast(fallbackMessage, message)
    } else {
        showErrorToast(fallbackMessage, 'Unexpected Error')
    }
}