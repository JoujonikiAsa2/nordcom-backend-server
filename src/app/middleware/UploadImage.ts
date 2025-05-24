import multer from "multer";
const storage = multer.memoryStorage();
export const UploadImageInServer = multer({ storage: storage });
