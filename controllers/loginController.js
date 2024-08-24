const Taikhoan = require('../models/taikhoan');
const emailExists = require('email-exists');
const global = require('../global');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Khóa và IV
const algorithm = 'aes-256-cbc';
const key = Buffer.from('this-is-my-secret-key-in-my-app-', 'utf8'); // Khóa 32 byte
const iv = Buffer.from('my-fixed-iv-2340', 'utf8'); // IV 16 byte, cần đúng độ dài

// Hàm mã hóa
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Hàm giải mã
function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const signUpAccount = async (req, res) => {
     const {email, password, name} = req.body;
     const getEmail = await Taikhoan.find({email: email, loai: 'lc'});
     const getTen = await Taikhoan.find({ten: name});
     
     const check = {
          email: "ok",
          ten: "ok"
     };
     if(getEmail.length) check.email = "exit";
     if(getTen.length) check.ten = "exit";
     if(!getEmail.length && !getTen.length) {
          const newTaikhoan = new Taikhoan({
               ten: name,
               email: email,
               mat_khau: encrypt(password)
          });
          await newTaikhoan.save();
     }
     
     return res.send(check);
};

const checkEmailExist = async (req, res) => {
     const {email} = req.body;
     // Validate the email
     try {
          const result = await emailExists({ sender: 'abcxyz123321@gmail.com', recipient: email, timeout: 6000 });
          if(result === "MAY_EXIST") res.json({status: "ok"});
          else res.json({status: "not ok"});
     }
     catch(err) {
          console.log(`Line 38 (loginController.js) : ${err}`);
          res.json({status: "not ok"});
     }
}

const signInAccount = async (req, res) => {
     const {email, password} = req.body;
     
     const getAccount = await Taikhoan.find({email: email, loai: 'lc'});

     const check = {
          email: "ok",
          password: "ok"
     };
     if(!getAccount.length) check.email = "not ok";
     else {
          const isPassword = decrypt(getAccount[0].mat_khau);
          if(isPassword !== password) check.password = "not ok";
     }
     if(check.email === "ok" && check.password === "ok") {
          res.cookie('user_id', getAccount[0]._id, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});
     }
     res.send(check);
};

const signOutAccount = (req, res) => {
     res.clearCookie('user_id');
     res.send({msg: "Sign Out"});
}

const sendPasswordToEmail = async (req, res) => {
     const {email} = req.body;
     const myemail = 'nvt1732002@gmail.com';
     const mypassword = 'kuqv mnmt sxig hovj';
     const getTaikhoan = await Taikhoan.find({email: email, loai: 'lc'});
     if(!getTaikhoan.length) return res.send({status: "not exist"});

     try {
          const transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
               user: myemail, // Thay bằng địa chỉ email của bạn
               pass: mypassword   // Thay bằng mật khẩu email của bạn
               }
          });
          const mailOptions = {
               from: myemail, 
               to: email,
               subject: "Lấy lại mật khẩu",
               text: `Mật khẩu của bạn là : ${decrypt(getTaikhoan[0].mat_khau)}`
          };
          transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                    console.log(error);
               return res.status(500).json({ status: "fail" });
               }
               res.status(200).json({ status : "success" });
          });
     } catch(err) {
          console.log(`Line 94 (loginController.js) : ${err}`);
     }
}

// Đăng nhập với mạng xã hội
const authGoogle = (req, res) => {
     const returnTo = req.query.returnTo || '/';
     const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${global.google.google_Client_Id}&redirect_uri=${global.google.google_Redirect_Uri}&response_type=code&scope=email%20profile&prompt=login&state=${encodeURIComponent(returnTo)}`;
    res.redirect(googleAuthUrl);
}

const signInGoogle = async (req,res) => {
     const { code } = req.query;
    // Đổi mã code lấy access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: global.google.google_Client_Id,
            client_secret: global.google.google_Client_Secret,
            redirect_uri: global.google.google_Redirect_Uri,
            grant_type: 'authorization_code'
        })
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    // Lấy thông tin người dùng
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    const userInfo = await userInfoResponse.json();

     // Xử lý dữ liệu
    const returnTo = req.query.state || '/';
    const findTaikhoan = await Taikhoan.find({email: userInfo.email, ten: userInfo.name, loai: 'gg'});
    if (!findTaikhoan.length) {
      const newTaikhoan = new Taikhoan({
          ten: userInfo.name,
          email: userInfo.email,
          anh: userInfo.picture,
          loai: 'gg'
      });
      await newTaikhoan.save();
      res.cookie('user_id', newTaikhoan._id, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});
    }
    else {
     Taikhoan.findByIdAndUpdate(findTaikhoan[0]._id, { anh: userInfo.picture }, { new: true })
          .catch(err => console.log(`signInGoogle - Line 142 (loginController.js) : ${err}`));
     res.cookie('user_id', findTaikhoan[0]._id, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});
    }
    
    res.redirect(returnTo);
}

const authFacebook = (req, res) => {
     const returnTo = req.query.returnTo || '/';
     const facebookAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${global.facebook.facebook_Client_Id}&redirect_uri=${global.facebook.facebook_Redirect_Uri}&response_type=code&scope=email%20public_profile&auth_type=reauthenticate&state=${encodeURIComponent(returnTo)}`;
    res.redirect(facebookAuthUrl);
}

const signInFacebook = async (req,res) => {
     const { code } = req.query;
    // Đổi mã code lấy access token
    const tokenResponse = await fetch(`https://graph.facebook.com/v12.0/oauth/access_token?client_id=${global.facebook.facebook_Client_Id}&redirect_uri=${global.facebook.facebook_Redirect_Uri}&client_secret=${global.facebook.facebook_Client_Secret}&code=${code}`);
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    // Lấy thông tin người dùng
    const userInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
    const userInfo = await userInfoResponse.json();
    
    // Xử lý dữ liệu
    const returnTo = req.query.state || '/';
    const findTaikhoan = await Taikhoan.find({email: userInfo.email, ten: userInfo.name, loai: 'fb'});
    if (!findTaikhoan.length) {
      const newTaikhoan = new Taikhoan({
          ten: userInfo.name,
          email: userInfo.email,
          anh: userInfo.picture.data.url,
          loai: 'fb'
      });
      await newTaikhoan.save();
      res.cookie('user_id', newTaikhoan._id, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});
    }
    else {
     Taikhoan.findByIdAndUpdate(findTaikhoan[0]._id, { anh: userInfo.picture.data.url }, { new: true })
          .catch(err => console.log(`signInFacebook - Line 180 (loginController.js) : ${err}`));
     res.cookie('user_id', findTaikhoan[0]._id, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});
    }
    
    res.redirect(returnTo);
}


module.exports = {signUpAccount, signInAccount, checkEmailExist, signOutAccount, authGoogle,
     authFacebook, signInGoogle, signInFacebook, sendPasswordToEmail
}