const multer = require('multer');
const path   = require('path');

// --- Multer Storage Configuration ---
// Uploaded files will be saved in /public/uploads/
const storage = multer.diskStorage({

    // Set the destination folder
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },

    // Keep the original file name (with timestamp prefix to avoid name collisions)
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// Only allow image files (jpg, jpeg, png, webp, gif)
const fileFilter = function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extOk  = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedTypes.test(file.mimetype);

    if (extOk && mimeOk) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif)'));
    }
};

// Export the configured multer middleware
// Limit file size to 5 MB
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
