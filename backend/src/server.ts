import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/auth.route"
import { prisma } from "./config/prisma"


dotenv.config()

const app = express()
const PORT = process.env.PORT

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["content-type", "Authorization"]
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port:${PORT}`)
})

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit()
})