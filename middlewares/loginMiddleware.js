const Taikhoan = require('../models/taikhoan');

const isAuth = (req, res, next) => {
     const user_id = req.cookies.user_id;
     if(user_id) req.user_id = user_id;
     else req.user_id = null;
     next();
}

const getTaikhoan_Data = async (req, res, next) => {
     if(req.user_id) {
          const taikhoan = await Taikhoan.find({_id: req.user_id});
          req.userInfo = taikhoan[0];
     }
     else req.userInfo = null;
     next();
}

module.exports = {isAuth, getTaikhoan_Data};