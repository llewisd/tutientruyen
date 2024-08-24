const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const loginMiddleware = require('../middlewares/loginMiddleware');
const secureMiddleware = require('../middlewares/secureMiddleware');

router.post('/signup', secureMiddleware.stringEscape , loginController.signUpAccount);

router.post('/signup/checkEmailExist', loginController.checkEmailExist);

router.post('/signin', secureMiddleware.stringEscape , loginController.signInAccount);

router.get('/signout', loginController.signOutAccount);

router.post('/forgetPassword', secureMiddleware.stringEscape , loginController.sendPasswordToEmail);


// Đăng nhập với mạng xã hội
router.get('/signin/auth/google', loginController.authGoogle);

router.get('/signin/auth/google/callback', loginController.signInGoogle);

router.get('/signin/auth/facebook', loginController.authFacebook);

router.get('/signin/auth/facebook/callback', loginController.signInFacebook);

module.exports = router;