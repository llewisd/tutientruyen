const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const comicController = require('../controllers/comicController');
const loginMiddleware = require('../middlewares/loginMiddleware');

// [GET] /
router.get('/', loginMiddleware.isAuth , loginMiddleware.getTaikhoan_Data , homeController.getHomepage);

router.get('/search', homeController.searchItems)

module.exports = router;