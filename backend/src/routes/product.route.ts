import { Router } from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated"
import { isSuperAdmin } from "../middlewares/isSuperAdmin"
import { createProduct } from "../controllers/product/createProduct"
import { getAllProducts } from "../controllers/product/getAllProducts"
import { upload } from "../middlewares/upload"
import { getProductById } from "../controllers/product/getProductById"
import { updateProduct } from "../controllers/product/updateProduct"
import { deleteProduct } from "../controllers/product/deleteProduct"

const router = Router()

router.route("create-product").post(isAuthenticated, isSuperAdmin, upload.array("images", 5), createProduct)
router.route("/products").get(isAuthenticated, isSuperAdmin, getAllProducts)

router.route("/:id").get(isAuthenticated, getProductById)
router.route("/:id").put(isAuthenticated, isSuperAdmin, upload.array("images", 5), updateProduct)
router.route("/:id").delete(isAuthenticated, isSuperAdmin, deleteProduct)

export default router