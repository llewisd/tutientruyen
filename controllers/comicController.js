const Truyen = require('../models/truyen');
const Chapter = require('../models/chapter');
const Theloai = require('../models/theloai');
const mongoose = require('mongoose');
const formatViewsWithSpace = require('../global').formatViewsWithSpace;
const formatViewsNoSpace = require('../global').formatViewsNoSpace;

const getComicpage = async (req, res) => {
     try {
          // Lấy dữ liệu tài khoản sau khi xác thực
          const userInfo = req.userInfo;

          const currentUrl = req.originalUrl;
          const getComicInfo = await Chapter.aggregate([
               // Bước 1 : Truy vấn truyện có ten tương ứng
               {
                    $lookup: {
                         from: "Truyen",
                         localField: "truyen",
                         foreignField: "_id",
                         as: "truyen_id"
                    }
               },
               {
                    $unwind: "$truyen_id"
               },
               {
                    $match: {"truyen_id.link": req.params.link}
               },
               // Bước 2 : Chọn các trường cần thiết
               {
                    $project: {
                    chuong: "$chuong",
                    cap_nhat: "$cap_nhat",
                    luot_xem: "$luot_xem",
                    so_binh_luan: "$so_binh_luan",
                    ten: "$truyen_id.ten",
                    ten_khac: "$truyen_id.ten_khac",
                    anh: "$truyen_id.anh",
                    tac_gia: "$truyen_id.tac_gia",
                    mo_ta: "$truyen_id.mo_ta",
                    trang_thai: "$truyen_id.trang_thai",
                    tong_luot_xem: "$truyen_id.tong_luot_xem",
                    the_loai: "$truyen_id.the_loai"
                    }
               },
               // Bước 3: Lấy thông tin từ Theloai
               {
                    $lookup: {
                         from: "Theloai",
                         localField: "the_loai",
                         foreignField: "_id",
                         as: "the_loai_id"
                    }
               },
               {
                    $unwind: "$the_loai_id"
               },
               // // // Bước 4: Chọn các trường cần thiết từ Theloai
               {
                    $group: {
                    _id: "$_id",
                    chuong: { $first: "$chuong" },
                    cap_nhat: { $first: "$cap_nhat" },
                    luot_xem: {$first: "$luot_xem"},
                    so_binh_luan: { $first: "$so_binh_luan" },
                    ten: { $first: "$ten" },
                    ten_khac: { $first: "$ten_khac" },
                    anh: { $first: "$anh" },
                    tac_gia: { $first: "$tac_gia" },
                    mo_ta: { $first: "$mo_ta" },
                    trang_thai: { $first: "$trang_thai" },
                    tong_luot_xem: { $first: "$tong_luot_xem" },
                    the_loai: { $push: "$the_loai_id.ten" }  
                    }
               },
               {
                    $sort: {"chuong": -1}
               },
               // Bước 5 : Nhóm theo tên truyện
               {
                    $group: {
                    _id: "$ten",
                    ten_khac: {$first : "$ten_khac"},
                    anh: {$first : "$anh"},
                    tac_gia: {$first : "$tac_gia"},
                    mo_ta: {$first : "$mo_ta"},
                    trang_thai: {$first : "$trang_thai"},
                    tong_luot_xem: {$first : "$tong_luot_xem"},
                    the_loai: {$first : "$the_loai"},
                    chapter: {
                         $push: {
                              chapter_id: "$_id",
                              chuong: "$chuong" ,
                              cap_nhat: "$cap_nhat" ,
                              luot_xem: "$luot_xem",
                              so_binh_luan: "$so_binh_luan"
                         }
                    }
                    }
               },
               {
                    $project: {
                    ten: "$_id",
                    ten_khac: "$ten_khac",
                    anh: "$anh",
                    tac_gia: "$tac_gia",
                    mo_ta: "$mo_ta",
                    trang_thai: "$trang_thai",
                    tong_luot_xem: "$tong_luot_xem",
                    the_loai: "$the_loai",
                    chapter: "$chapter"
                    }
               }
          ]);

          const comicInfo = getComicInfo[0];

          // Tìm tất cả thể loại
          const all_genre = await Theloai.find().sort({ ten: 1 });
          
          res.render('comic', {comicInfo, currentUrl, userInfo, all_genre, formatViewsWithSpace,
               formatViewsNoSpace
          });
     }
     catch(err) {
          console.log(`getComicpage - Line 127 (comicController.js) : ${err}`);
          res.send(err);
     }
}

module.exports = {getComicpage};