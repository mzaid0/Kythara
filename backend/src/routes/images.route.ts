import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { upload } from "../middlewares/upload";
import { uploadImages } from "../controllers/images/uploadImages";
import { deleteImages } from "../controllers/images/deleteImages";

const router = Router();

router.route("/upload").post(
    isAuthenticated, 
    isSuperAdmin, 
    upload.any(), 
    uploadImages
);

router.route("/delete").delete(
    isAuthenticated, 
    isSuperAdmin, 
    deleteImages
);

export default router;
