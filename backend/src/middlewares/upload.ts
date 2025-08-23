import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/uploads")
    },

    filename: (req, file, cb) => {
        cb(null, file.filename + "-" + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    }
    else {
        cb(new Error("Please upload only image/images"))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fieldNameSize: 1024 * 1024 * 5 }
})