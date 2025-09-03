import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { prisma } from "./configs/prisma"
import authRoutes from "./routes/auth.route"
import productRoutes from "./routes/product.route"
import imagesRoutes from "./routes/images.route"
import brandsRoutes from "./routes/brand.route"


dotenv.config()

const app = express()
const PORT = process.env.PORT

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/images", imagesRoutes)
app.use("/api/brands", brandsRoutes)



app.listen(PORT, () => {
    console.log(`🚀 Server is running on port:${PORT}`)
})

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit()
})