const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

router.post('/', upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
        message: "Image uploaded successfully",
        imageUrl: `http://localhost:3000/uploads/${req.file.filename}`,
    });
});

module.exports = router;
