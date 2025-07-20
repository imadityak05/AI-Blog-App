import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}) // default temporary storage
});

export default upload;
