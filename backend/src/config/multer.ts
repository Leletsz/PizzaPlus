import multer from "multer";
export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024, // 4MB
    },
    fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo inválido"));
        }
    },
}