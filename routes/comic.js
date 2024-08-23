const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');
const chapterController = require('../controllers/chapterController');
const loginMiddleware = require('../middlewares/loginMiddleware');
const secureMiddleware = require('../middlewares/secureMiddleware');

// [GET] /
router.get('/:link', loginMiddleware.isAuth , loginMiddleware.getTaikhoan_Data, comicController.getComicpage);

router.get('/:link/chapter-:chapter', loginMiddleware.isAuth , loginMiddleware.getTaikhoan_Data ,chapterController.getChapter);

router.post('/:link/chapter-:chapter/comment/create', secureMiddleware.stringEscape ,chapterController.createComment);

router.get('/:link/chapter-:chapter/comment/delete', secureMiddleware.stringEscape , chapterController.deleteComment);

router.get('/:link/chapter-:chapter/comment', chapterController.loadComment);

router.get('/:link/chapter-:chapter/reportError', chapterController.reportError);

module.exports = router;