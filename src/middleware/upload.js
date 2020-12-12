
const fs = require('fs');
const path = require('path');
const multer = require('multer');
    
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()) 
    }
});
 
const upload = multer({ storage: storage });
module.exports = upload