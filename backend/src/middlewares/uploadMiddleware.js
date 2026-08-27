const multer = require("multer");

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only PDF, JPG, JPEG, and PNG files are allowed.")
      );
    }
  },
});

module.exports = upload;