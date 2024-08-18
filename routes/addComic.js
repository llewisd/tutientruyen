const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const addComicController = require('../controllers/addComicController');
const loginMiddleware = require('../middlewares/loginMiddleware');
const secureMiddleware = require('../middlewares/secureMiddleware');

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, path.join(__dirname, req.query.folderPath, req.query.folderName)); // Thư mục để lưu file
     },
     filename: (req, file, cb) => {
          const ext = path.extname(file.originalname); // Lấy đuôi file gốc
          cb(null, `avatar${ext}`); // Tạo tên file mới
     }
 });
 
 const upload = multer({ storage: storage });

router.get('/', loginMiddleware.isAuth , loginMiddleware.getTaikhoan_Data, addComicController.getAddComicPage);

router.post('/create/folder' ,addComicController.createComicFolder);

router.post('/create', upload.single('image') ,addComicController.createComic);

router.post('/delete', addComicController.deleteComic);

module.exports = router;