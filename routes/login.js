const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const loginMiddleware = require('../middlewares/loginMiddleware');

router.post('/signup', loginController.signUpAccount);

router.post('/signup/checkEmailExist', loginController.checkEmailExist);

router.post('/signin', loginController.signInAccount);

router.get('/signout', loginController.signOutAccount);

router.post('/forgetPassword', loginController.sendPasswordToEmail);


// Đăng nhập với mạng xã hội
router.get('/signin/auth/google', loginController.authGoogle);

router.get('/signin/auth/google/callback', loginController.signInGoogle);

router.get('/signin/auth/facebook', loginController.authFacebook);

router.get('/signin/auth/facebook/callback', loginController.signInFacebook);

module.exports = router;