import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, callback) => {
    return callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

export default upload;
