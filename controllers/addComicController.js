const Truyen = require('../models/truyen');
const Chapter = require('../models/chapter');
const Theloai = require('../models/theloai');
const path = require('path');
const fs = require('fs');
const getTimeSinceLastUpdate = require('../global').getTimeSinceLastUpdate;
const changeTimetoDDMMYYYY = require('../global').changeTimetoDDMMYYYY;
const stringToSlugWithUnderscore = require('../global').stringToSlugWithUnderscore;
const stringToSlug = require('../global').stringToSlug;
const mongoose = require('mongoose');


const getAddComicPage = async (req, res) => {
     try {
          // Lấy thông tin tài khoản sau khi xác thực
          const userInfo = req.userInfo;
          
          // Lấy tất cả thể loại
          const all_genre = await Theloai.find().sort({ ten: 1 });

          if(!userInfo || (userInfo && userInfo.quyen === 'user')) return res.send("You don't have permission to access on this page. Please return to <a href='/'>homepage</a>");

          // Truy vấn dữ liệu truyện tranh đã tạo
          const created_comic = await Truyen.aggregate([
               {
                    $lookup : {
                         from: 'Chapter',
                         localField: '_id',
                         foreignField: 'truyen',
                         as: "chapter_id"
                    }
               },
               {
                    $unwind: {path: "$chapter_id",preserveNullAndEmptyArrays: true} 
               },
               {
                    
                    $match: {'user_upload': userInfo._id}
               },
               {
                    $project: {
                         truyen: "$chapter_id.truyen",
                         chuong: "$chapter_id.chuong",
                         cap_nhat: "$chapter_id.cap_nhat",
                         luot_xem: "$chapter_id.luot_xem",
                         so_binh_luan: "$chapter_id.so_binh_luan",
                         bao_loi: "$chapter_id.bao_loi",
                         ten: 1,
                         link: 1,
                         anh: 1,
                         tac_gia: 1,
                         trang_thai: 1,
                         tong_luot_xem: 1,
                         user_upload: 1
                    }
               },
               {
                    $sort: {chuong: -1, cap_nhat: -1}
               },
               {
                    $group: {
                         _id: "$_id",
                         chuong: {$first: "$chuong"},
                         cap_nhat: {$first: "$cap_nhat"},
                         so_binh_luan: {$first: "$so_binh_luan"},
                         bao_loi: {$sum: "$bao_loi"},
                         ten: {$first: "$ten"},
                         link: {$first: "$link"},
                         anh: {$first: "$anh"},
                         tac_gia: {$first: "$tac_gia"},
                         trang_thai: {$first: "$trang_thai"},
                         tong_luot_xem: {$first: "$tong_luot_xem"},
                         user_upload: {$first: "$user_upload"},
                    }
               },
               {
                    $addFields: {
                      hasCapNhat: { $cond: { if: { $eq: ["$cap_nhat", null] }, then: 0, else: 1 } }
                    }
               },
               {
                    $sort: {hasCapNhat: 1, cap_nhat: -1}
               }
          ]);
          res.render('addComic', {userInfo, all_genre, created_comic, changeTimetoDDMMYYYY});
     }
     catch(err) {
          console.log(`getAddComicPage - Line 16 (addComicController.js) : ${err}`);
          res.send(err);
     }
};

const createComicFolder = async (req, res) => {
     try {
          const user_id = req.cookies.user_id;
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
               the_loai: genres,
               user_upload: user_id
          });
          await newTruyen.save();

          var truyen_identified = newTruyen._id; 
          res.json({ success: true, folderPath: `../public/images/comic/${folder_name}/`, folderName: 'avatar',
                url: `/images/comic/${folder_name}/avatar/`, truyen_id: newTruyen._id });
     }
     catch(err) {
          console.log(`createComicFolder - Line 53 (addComicController.js) : ${err}`);
          await Truyen.findByIdAndDelete(truyen_identified);
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

// Update

const getComicforUpdate = async (req, res) => {
     try {
          const truyen_id = req.query.truyen_id;
          
          const getComic = await Truyen.find({_id: truyen_id}).populate({path: 'the_loai', select: 'ten' });
          res.json({success: true, data: getComic});
     } 
     catch(err) {
          console.log(`getComicforUpdate - Line 163 (addComicController.js) : ${err}`);
          res.send({success: false, error: err});
     }
}

const updateComicFolder = async (req, res) => {
     try {
          const truyen_id = req.query.truyen_id;
          const {comic_name, other_comic_name, author, mo_ta, status, genres} = req.body;
          const link = stringToSlug(comic_name);
          // Thay đổi tên thư mục
          const comic_folder_name = stringToSlugWithUnderscore(comic_name);
          const get_old_comic_name = await Truyen.find({_id: truyen_id});
          const oldComicName = get_old_comic_name[0].ten;
          const newComicName = comic_name;
          const oldFolderPath = path.join(__dirname, `../public/images/comic/${stringToSlugWithUnderscore(oldComicName)}`);
          const newFolderPath = path.join(__dirname, `../public/images/comic/${stringToSlugWithUnderscore(newComicName)}`);
          fs.rename(oldFolderPath, newFolderPath, (err) => {
           });

          // Cập nhật dữ liệu 
          await Truyen.findByIdAndUpdate(truyen_id, 
               {ten: comic_name.trim(), ten_khac: other_comic_name.trim(), link: link,
               tac_gia: author.trim(), mo_ta: mo_ta.trim(), trang_thai: status, the_loai: genres}
          );
          
          res.json({success: true, folderPath: `../public/images/comic/${comic_folder_name}/`, folderName: 'avatar',
               url: `/images/comic/${comic_folder_name}/avatar/`, truyen_id: truyen_id});
     }
     catch(err) {
          console.log(`updateComicFolder - Line 185 (addComicController.js) : ${err}`);
          res.json({ success: false });
     }
};

const updateComic = async (req, res) => {
     try {
          if(req.file) {
               var anh = req.query.url + req.file.filename;
          }
          else {
               const getFilename = fs.readdirSync(path.join(__dirname, req.query.folderPath, req.query.folderName));
               var anh = req.query.url + getFilename;
          }
          await Truyen.findByIdAndUpdate(req.query.truyen_id, {anh: anh}, {new: true})
               .catch(err => console.log(`createComic - Line 76 (addComicController.js) : ${err}` ))
          
          res.json({ message: 'success!'});
     }
     catch(err) {
          console.log(`updateComic - Line 211 (addComicController.js) : ${err}`);
     }
};

const updateError = (req, res) => {
     
};

module.exports = {getAddComicPage, createComic, deleteComic,
      createComicFolder, updateError, getComicforUpdate, updateComicFolder, updateComic};