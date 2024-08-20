const Truyen = require('../models/truyen');
const Chapter = require('../models/chapter');
const Theloai = require('../models/theloai');
const path = require('path');
const fs = require('fs');
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
          comic_name = comic_name[0].ten;

          const chapterInfo = await Chapter.find({truyen: truyen_id}).sort({chuong: -1, cap_nhat: -1});

          res.render('addChapter', {userInfo, all_genre, comic_name, chapterInfo, changeTimetoDDMMYYYY});
     }
     catch(err) {

     }
}

const createChapter = (req, res) => {

};

const deleteChapter = (req, res) => {

}

module.exports = {createChapter, deleteChapter, getAddChapterPage};