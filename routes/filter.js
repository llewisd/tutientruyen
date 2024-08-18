const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');
const loginMiddleware = require('../middlewares/loginMiddleware');

router.get("/", loginMiddleware.isAuth , loginMiddleware.getTaikhoan_Data , filterController.filterComic);

module.exports = router;