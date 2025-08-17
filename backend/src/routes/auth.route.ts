import { Router } from "express"
import { registerUser } from "../controllers/auth/registerUser"
import { loginUser } from "../controllers/auth/loginUser"
import { refreshAccessToken } from "../controllers/auth/refreshAccessToken"
import { logoutUser } from "../controllers/auth/logoutUser"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(logoutUser)

export default router