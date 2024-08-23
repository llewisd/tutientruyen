const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const addChapterController = require('../controllers/addChapterController');
const loginMiddleware = require('../middlewares/loginMiddleware');
const secureMiddleware = require('../middlewares/secureMiddleware');
const stringToSlugWithUnderscore = require('../global').stringToSlugWithUnderscore;


let fileCount = 0;

const resetFileCount = (req, res, next) => {
     fileCount = 0;
     next();
}

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, path.join(__dirname, req.query.folderPath, req.query.folderName)); // Thư mục để lưu file
     },
     filename: (req, file, cb) => {
          fileCount += 1;
          const ext = path.extname(file.originalname); // Lấy đuôi file gốc
          cb(null, `${fileCount}${ext}`); // Tạo tên file mới
     }
 });
 
 const upload = multer({ storage: storage });

router.get('/:truyen_link/:truyen_id', loginMiddleware.isAuth , loginMiddleware.getTaikhoan_Data , addChapterController.getAddChapterPage);

router.post('/:truyen_link/:truyen_id/create/folder', secureMiddleware.stringEscape , addChapterController.createChapterFolder);

router.post('/:truyen_link/:truyen_id/create', upload.array('images[]') , resetFileCount, addChapterController.createChapter);

// Update chapter
router.get('/:truyen_link/:truyen_id/update', addChapterController.getChapterForUpdate);

router.post('/:truyen_link/:truyen_id/update/doc', secureMiddleware.stringEscape , addChapterController.updateChapterDoc);

router.post('/:truyen_link/:truyen_id/update/image', upload.array('images[]') , resetFileCount , addChapterController.updateChapterImage);

// Delete chapter
router.get('/:truyen_link/:truyen_id/delete/:chapter_id', addChapterController.deleteChapter);

// reportError
router.get('/:truyen_link/:truyen_id/reportError', addChapterController.reportError);
module.exports = router;