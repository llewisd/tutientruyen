const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const addChapterController = require('../controllers/addChapterController');
const loginMiddleware = require('../middlewares/loginMiddleware');
const secureMiddleware = require('../middlewares/secureMiddleware');
const stringToSlugWithUnderscore = require('../global').stringToSlugWithUnderscore;

router.get('/:truyen_link/:truyen_id', loginMiddleware.isAuth , loginMiddleware.getTaikhoan_Data , addChapterController.getAddChapterPage);

router.post('/:truyen_link/:truyen_id/create', addChapterController.createChapter);

router.post('/:truyen_link/:truyen_id/delete', addChapterController.deleteChapter);

module.exports = router;