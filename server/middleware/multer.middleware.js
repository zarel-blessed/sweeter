const multer = require("multer");
const path = require("path");

const topLevelDirectory = path.resolve(__dirname, "..");

const storagePath = path.join(topLevelDirectory, "storage");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, storagePath);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, callback) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        callback(null, true);
    } else {
        callback(new Error("Invalid file type"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB limit
    },
});

const uploadMulterFile = upload.single("file");
module.exports = { storagePath, uploadMulterFile };
