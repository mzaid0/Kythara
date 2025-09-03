import { Router } from "express"
import { createProduct } from "../controllers/product/createProduct"
import { deleteProduct } from "../controllers/product/deleteProduct"
import { getAllProducts } from "../controllers/product/getAllProducts"
import { getProductById } from "../controllers/product/getProductById"
import { updateProduct } from "../controllers/product/updateProduct"
import { isAuthenticated } from "../middlewares/isAuthenticated"
import { isSuperAdmin } from "../middlewares/isSuperAdmin"

const router = Router()

router.route("/").post(isAuthenticated, isSuperAdmin, createProduct)
router.route("/").get(isAuthenticated, isSuperAdmin, getAllProducts)

router.route("/:id").get(isAuthenticated, getProductById)
router.route("/:id").put(isAuthenticated, isSuperAdmin, updateProduct)
router.route("/:id").delete(isAuthenticated, isSuperAdmin, deleteProduct)

export default router