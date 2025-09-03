import { Router } from "express";
import { createBrand } from "../controllers/brands/createBrand";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { getAllBrands } from "../controllers/brands/getAllBrands";
import { updateBrand } from "../controllers/brands/updateBrand";

const router = Router()

router.route("/").get(isAuthenticated, isSuperAdmin, getAllBrands)
router.route("/").post(isAuthenticated, isSuperAdmin, createBrand)
router.route("/:id").patch(isAuthenticated, isSuperAdmin, updateBrand)
router.route("/:id").delete(isAuthenticated, isSuperAdmin, updateBrand)

export default router