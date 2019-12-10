// Middleware
const multer = require("multer");

// Set Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images-profiles");
  }, // TODO - FIX THIS TO FILTER FOR IMAGE FILES
  filename: (req, file, cb) => {
    cb(null, "vm" + "-" + Date.now() + "-" + file.originalname);
  }
});

module.exports = (req, res, next) => {
  const upload = multer({ storage: storage });
  upload.single("profilePhotographFile")(req, res, err => {
    if (err) {
      return next(err);
    } else {
      next();
    }
  });
};
