const Truyen = require('../models/truyen');
const Chapter = require('../models/chapter');
const Theloai = require('../models/theloai');
const path = require('path');
const fs = require('fs');
const { fileCount } = require('../global');
const getTimeSinceLastUpdate = require('../global').getTimeSinceLastUpdate;
const changeTimetoDDMMYYYY = require('../global').changeTimetoDDMMYYYY;
const stringToSlugWithUnderscore = require('../global').stringToSlugWithUnderscore;
const stringToSlug = require('../global').stringToSlug;

const getAddChapterPage = async (req, res) => {
     try {
          // Lấy thông tin tài khoản sau khi xác thực
          const userInfo = req.userInfo;
          
          // Lấy tất cả thể loại
          const all_genre = await Theloai.find().sort({ ten: 1 });

          if(!userInfo || (userInfo && userInfo.quyen === 'user')) return res.send("You don't have permission to access on this page. Please return to <a href='/'>homepage</a>");

          // Truy vấn dữ liệu Chapter
          const truyen_link = req.params.truyen_link;
          const truyen_id = req.params.truyen_id;

          let comic_name = await Truyen.find({_id: truyen_id});
          comic_name = comic_name[0];

          const chapterInfo = await Chapter.find({truyen: truyen_id}).sort({chuong: -1, cap_nhat: -1});
          
          res.render('addChapter', {userInfo, all_genre, comic_name, chapterInfo, changeTimetoDDMMYYYY});
     }
     catch(err) {
          console.log(`getAddChapterPage - Line 34 (addChapterController.js) : ${err}`);
     }
}

const createChapterFolder = async (req, res) => {
     try {
          const truyen_link = req.params.truyen_link;
          const truyen_id = req.params.truyen_id;
          const chapter = parseFloat(req.body.chapter);
          const truyen_name = req.query.name;
          
          const folder_name = stringToSlugWithUnderscore(truyen_name);
          const folderPath = path.join(__dirname, `../public/images/comic/${folder_name}/`, `chapter${chapter}`);
          // Kiểm tra xem thư mục đã tồn tại chưa
          if (!fs.existsSync(folderPath)) {
               fs.mkdirSync(folderPath, { recursive: true });
          }

          // Lưu chapter vào cơ sở dữ liệu
          const newChapter = new Chapter({
               truyen: truyen_id,
               chuong: chapter
          });
          await newChapter.save();
          var chapter_identified = newChapter._id;
          res.send({ success: true, folderPath: `../public/images/comic/${folder_name}/`, folderName: `chapter${chapter}`,
               url: `/images/comic/${folder_name}/chapter${chapter}/`, chapter_id: chapter_identified }); 
     } 
     catch(err) {
          console.log(`createChapterFolder - Line 62 (addChapterController.js) : ${err}`);
          await Chapter.findByIdAndDelete(chapter_identified);
          res.json({ success: false });
     }
};


const createChapter = async (req, res) => {
     try {
          const url = req.query.url;
          const anhArray = req.files.map((file, index) => ({
               stt: index + 1,
               path: `${req.query.folderName}/${file.filename}`
          }));
          await Chapter.findByIdAndUpdate(req.query.chapter_id,{ anh: anhArray },{ new: true })
          .catch(err => console.log(`createChapter - Line 79 (addChapterController.js) : ${err}` ));
          res.json({ success: 'ok'});
     }
     catch(err) {
          console.log(`createChapter - Line 82 (addChapterController.js) : ${err}`);
          res.json({ success: 'fail'});
     }
};

// Update chapter
const getChapterForUpdate = async (req, res) => {
     const chapter_id = req.query.chapter_id;
     const truyen_id = req.params.truyen_id;
     const truyen_link = req.params.truyen_link;

     const getChapter = await Chapter.find({_id: chapter_id}).populate('truyen','anh_root').select('_id chuong anh truyen');

     res.json({success: true, data: getChapter[0]});
};

const updateChapterDoc = async (req, res) => {
     try {
          const chapter_id = req.query.chapter_id;
          const truyen_link = req.params.truyen_link;
          const truyen_id = req.params.truyen_id;
          const chapter = parseFloat(req.body.chapter);
          const truyen_name = req.query.truyen_name;
          const old_chapter = req.query.old_chapter;

          const folder_name = stringToSlugWithUnderscore(truyen_name);
          const old_folderPath = path.join(__dirname, `../public/images/comic/${folder_name}/`, `chapter${old_chapter}`);
          const new_folderPath = path.join(__dirname, `../public/images/comic/${folder_name}/`, `chapter${chapter}`);
          
          // Tìm và xóa folder
          fs.rm(old_folderPath, { recursive: true, force: true }, (err) => {
               if(!err) {
                    // Tạo lại thư mục mới
                    fs.mkdirSync(new_folderPath, { recursive: true });
               }
               else {
                    console.log('Thư mục không tồn tại');
               }
          });


          // Cập nhật dữ liệu mới
          await Chapter.findByIdAndUpdate(chapter_id, {chuong: chapter}, {new: true})
          .catch(err => console.log(`updateChapterDoc - Line 118 (addChapterController.js) : ${err}` ))
          return res.json({success: true, folderPath: `../public/images/comic/${folder_name}/`, folderName: `chapter${chapter}`,
               url: `/images/comic/${folder_name}/chapter${chapter}/`, chapter_id: chapter_id});
     }
     catch(err) {
          console.log(`updateChapterDoc - Line 122 (addChapterController.js) : ${err}`);
          res.json({success: false});
     }
}

const updateChapterImage = async (req, res) => {
     try {
          const url = req.query.url;
          const anhArray = req.files.map((file, index) => ({
               stt: index + 1,
               path: `${req.query.folderName}/${file.filename}`
          }));
          await Chapter.findByIdAndUpdate(req.query.chapter_id,{ anh: anhArray },{ new: true })
          .catch(err => console.log(`updateChapterImage - Line 144 (addChapterController.js) : ${err}` ));
          res.json({ success: 'ok'});
     }
     catch(err) {
          console.log(`updateChapterImage - Line 148 (addChapterController.js) : ${err}`);
          res.json({ success: 'fail'});
     }
}

// Delete chapter
const deleteChapter = async (req, res) => {
     try {
          const truyen_link = req.params.truyen_link.trim();
          const truyen_id = req.params.truyen_id.trim();
          const chapter_id = req.params.chapter_id.trim();
          const truyen_name = req.query.truyen_name.trim();
          const chapter = parseFloat(req.query.chapter.trim());

          // Xóa dữ liệu chapter trong cơ sở dữ liệu
          await Chapter.findOneAndDelete({_id: chapter_id});

          // Xóa thư mục
          const folder_name = stringToSlugWithUnderscore(truyen_name);
          const folderPath = path.join(__dirname, `../public/images/comic/${folder_name}/`, `chapter${chapter}`);
          fs.rm(folderPath, { recursive: true, force: true }, (err) => {
               if(err) console.log(`deleteChapter - Line 165 (addChapterController.js): ${err}`);
          });
          res.json({success: true});
     }
     catch(err) {
          console.log(`deleteChapter - Line 175 (addChapterController.js): ${err}`);
          res.json({success: false});
     }
}

module.exports = {createChapter, deleteChapter, getAddChapterPage, createChapterFolder,
     getChapterForUpdate, updateChapterDoc, updateChapterImage
};