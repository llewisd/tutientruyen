const Truyen = require('../models/truyen');
const Chapter = require('../models/chapter');
const Theloai = require('../models/theloai');
const path = require('path');
const fs = require('fs');
const getTimeSinceLastUpdate = require('../global').getTimeSinceLastUpdate;
const mongoose = require('mongoose');

function stringToSlugWithUnderscore(str) {
     let from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
         to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
     for (let i=0, l=from.length ; i < l ; i++) {
       str = str.replace(RegExp(from[i], "gi"), to[i]);
     }
     str = str.toLowerCase()
           .trim()
           .replace(/^[^\w]+|[^\w]+$/g, '')
           .replace(/[^\w\s]/g, '')
           .replace(/[^a-z0-9\-]/g, '_')
           .replace(/-+/g, '_');
     return str;
   }

const getAddComicPage = async (req, res) => {
     try {
          // Lấy thông tin tài khoản sau khi xác thực
          const userInfo = req.userInfo;
          
          // Lấy tất cả thể loại
          const all_genre = await Theloai.find().sort({ ten: 1 });

          if(!userInfo || (userInfo && userInfo.quyen === 'user')) return res.send("You don't have permission to access on this page. Please return to <a href='/'>homepage</a>");

          res.render('addComic', {userInfo, all_genre});
     }
     catch(err) {
          console.log(`getAddComicPage - Line 16 (addComicController.js) : ${err}`);
          res.send(err);
     }
};

const createComicFolder = async (req, res) => {
     try {
          const {comic_name, other_comic_name, author, mo_ta, status, genres} = req.body;
          const folder_name = stringToSlugWithUnderscore(comic_name);
          const folderPath = path.join(__dirname, `../public/images/comic/${folder_name}/`, 'avatar');

          // Kiểm tra xem thư mục đã tồn tại chưa
          if (!fs.existsSync(folderPath)) {
               fs.mkdirSync(folderPath, { recursive: true });
          }
          
          // Lưu dữ liệu vào cơ sở dữ liệu
          const newTruyen = new Truyen({
               ten: comic_name,
               ten_khac: other_comic_name,
               link: folder_name,
               tac_gia: author,
               mo_ta: mo_ta,
               trang_thai: status,
               the_loai: genres
          });
          await newTruyen.save();
          res.json({ success: true, folderPath: `../public/images/comic/${folder_name}/`, folderName: 'avatar',
                url: `/images/comic/${folder_name}/avatar/`, truyen_id: newTruyen._id });
     }
     catch(err) {
          console.log(`createComicFolder - Line 53 (addComicController.js) : ${err}`);
          res.json({ success: false });
     }
}

const createComic = async (req, res) => {
     try {
          const anh = req.query.url + req.file.filename;
          await Truyen.findByIdAndUpdate(req.query.truyen_id, {anh: anh}, {new: true})
               .catch(err => console.log(`createComic - Line 76 (addComicController.js) : ${err}` ))
          res.json({ message: 'success!'});
     }
     catch(err) {
          console.log(`createComic - Line 81 (addComicController.js) : ${err}`);
     }
};

const deleteComic = (req, res) => {

};

module.exports = {getAddComicPage, createComic, deleteComic, createComicFolder};