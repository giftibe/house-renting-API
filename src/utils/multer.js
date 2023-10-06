const multer = require('multer')
const path = require('path');
const maxSize = 5 * 1024 * 1024; // 5MB

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        
        //checks for a specific picture type 
        if (ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png" && ext !== ".JPG") {
            cb(new Error("File  type is not supported"), false);
            return
        }
        //checks if the pictures size is greater than 5MB
        if (file.size > maxSize) {
            cb(new Error("File size exceeds the 5MB limit"), false);
            return;
        }
        cb(null, true)
    }
})