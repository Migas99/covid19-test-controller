const multer = require('multer');

//Multer storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
});

const upload = multer({ storage: storage });

module.exports.uploadFile = upload.single('file');