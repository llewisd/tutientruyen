const Truyen = require('../models/truyen');
const Chapter = require('../models/chapter');
const Theloai = require('../models/theloai');
const getTimeSinceLastUpdate = require('../global').getTimeSinceLastUpdate;
const mongoose = require('mongoose');

const getHomepage = async (req, res) => {
     try {
          // Lấy thông tin tài khoản sau khi xác thực
          const userInfo = req.userInfo;

          // Lấy tất cả thể loại
          const all_genre = await Theloai.find().sort({ ten: 1 });

          // const newDoc = new Chapter([
          // Chapter.insertMany([
          // {
          //      truyen: "66b7847b5e9a73b3c0390c27",
          //      chuong: 1,
          //      luot_xem: 149,
          //      so_binh_luan: 300,
          //      bao_loi: 15,
          //      anh: [
          //           {
          //                stt: 1,
          //                path: "/images/comic/test_truyen_a/chapter1/1_1.jpg"
          //           },
          //           {
          //                stt: 2,
          //                path: "/images/comic/test_truyen_a/chapter1/1_2.jpg"
          //           }
          //      ]
          // },
          // {
          //      truyen: "66b7847b5e9a73b3c0390c28",
          //      chuong: 1,
          //      luot_xem: 46,
          //      so_binh_luan: 19,
          //      bao_loi: 0,
          //      anh: [
          //           {
          //                stt: 1,
          //                path: "/images/comic/test_truyen_b/chapter1/1_1.jpg"
          //           },
          //           {
          //                stt: 2,
          //                path: "/images/comic/test_truyen_b/chapter1/1_2.jpg"
          //           }
          //      ]
          // }
          // ]);
          
          // await newDoc.save()
          // Theloai.insertMany([
          //      {ten: 'Action'},
          //      {ten: 'Adventure'},
          //      {ten: 'Hệ thống'},
          //      {ten: 'Trọng sinh'},
          //      {ten: 'Cổ đại'},
          //      {ten: 'Đô thị'},
          //      {ten: 'Kinh dị'},
          //      {ten: 'Quân sự'},
          //      {ten: 'Tiên hiệp'},
          //      {ten: 'Fantasy'},
          //      {ten: 'Comedy'},
          //      {ten: 'Trinh thám'},
          //      {ten: 'Ngôn tình'},
          //      {ten: 'Slice of life'},
          //      {ten: 'Ngược'},
          //      {ten: 'Xuyên không'},
          //      {ten: 'Harem'},
          //      {ten: 'Em bé'},
          //      {ten: 'Mạt thế'},
          //      {ten: 'Cung đấu'},
          // ]);

          // Truyen.insertMany([
          //      {ten: "Test truyện A", ten_khac: "Đang cập nhật", anh: "/images/comic/test_truyen_a/avatar/avatar.jpg",
          //           nhom_dich: "Đang cập nhật", mo_ta: "Đang cập nhật",
          //           trang_thai: "Hoàn thành", luot_xem: 1000, 
          //           the_loai: ["66b4c5f64ad437e802a4fe1a", "66b4c5f64ad437e802a4fe1b","66b4c5f64ad437e802a4fe22","66b4c5f64ad437e802a4fe2a"]
          //      },
          //      {ten: "Test truyện B", ten_khac: "Đang cập nhật", anh: "/images/comic/test_truyen_b/avatar/avatar.jpg",
          //           nhom_dich: "Đang cập nhật", mo_ta: "Đang cập nhật",
          //           trang_thai: "Hoàn thành", luot_xem: 2000, 
          //           the_loai: ["66b4c5f64ad437e802a4fe1a", "66b4c5f64ad437e802a4fe1b","66b4c5f64ad437e802a4fe22","66b4c5f64ad437e802a4fe2a"]
          //      },
          // ]);
          
          // Lấy tất cả comic trong cơ sở dữ liệu
          const content = await Chapter.aggregate([
               {
                    $lookup: {
                         from: "Truyen",
                         localField: "truyen",
                         foreignField: "_id",
                         as: "truyen_id"
                    },
               },
               {
                    $unwind: "$truyen_id"
               },
               {
                    $project: {
                    chapterId: "$_id",
                    latestChapter: "$chuong",
                    lastUpdate: "$cap_nhat",
                    comicName: "$truyen_id.ten",
                    comicImage: "$truyen_id.anh",
                    link: "$truyen_id.link"
                    }
               },
               {
                    $group: {
                    _id: "$comicName",  // Nhóm theo comicName
                    chuong: { $max: "$latestChapter" },  // Lấy latestChapter lớn nhất từ nhóm
                    cap_nhat: { $max: "$lastUpdate" },  // Lấy lastUpdate từ bản ghi đầu tiên
                    anh: { $first: "$comicImage" },  // Lấy comicImage từ bản ghi đầu tiên
                    chapter_id: { $first: "$chapterId" },  // Lấy chapterId từ bản ghi đầu tiên
                    link: {$first: "$link"}
                    }
               },
               {
                    $sort: { cap_nhat: -1 }  // Sắp xếp theo cap_nhat giảm dần
               },
               {
                    $project: {
                    ten: "$_id",
                    chuong: "$chuong",
                    cap_nhat: "$cap_nhat",
                    anh: "$anh",
                    link: "$link"
                    }
               },
               {
                    $limit: 16
               }
          ]);

          // Lấy 7 mẫu ngẫu nhiên
          const slider =  await Chapter.aggregate([
               {
                    $lookup: {
                         from: "Truyen",
                         localField: "truyen",
                         foreignField: "_id",
                         as: "truyen_id"
                    },
               },
               {
                    $unwind: "$truyen_id"
               },
               {
                    $project: {
                    chapterId: "$_id",
                    latestChapter: "$chuong",
                    lastUpdate: "$cap_nhat",
                    comicName: "$truyen_id.ten",
                    comicImage: "$truyen_id.anh",
                    link: "$truyen_id.link"
                    }
               },
               {
                    $group: {
                    _id: "$comicName",  // Nhóm theo comicName
                    chuong: { $max: "$latestChapter" },  // Lấy latestChapter lớn nhất từ nhóm
                    cap_nhat: { $max: "$lastUpdate" },  // Lấy lastUpdate từ bản ghi đầu tiên
                    anh: { $first: "$comicImage" },  // Lấy comicImage từ bản ghi đầu tiên
                    chapter_id: { $first: "$chapterId" },  // Lấy chapterId từ bản ghi đầu tiên
                    link: { $first: "$link" }
                    }
               },
               {
                    $project: {
                    ten: "$_id",
                    chuong: "$chuong",  
                    cap_nhat: "$cap_nhat",  
                    anh: "$anh",
                    link: "$link"
                    }
               },
               {
                    $sort: { cap_nhat: -1 }  // Sắp xếp theo cap_nhat giảm dần
               },
               {
                    $sample: { size: 7 }
               }
          ])

          // Lấy 5 truyện có view cao nhất
          const sidebar = await Chapter.aggregate([
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
                    $project: {
                    chuong: "$chuong",
                    cap_nhat: "$cap_nhat",
                    ten: "$truyen_id.ten",
                    anh: "$truyen_id.anh",
                    tong_luot_xem: "$truyen_id.tong_luot_xem",
                    link: "$truyen_id.link"
                    }
               },
               {
                    $group: {
                         _id : "$ten",
                         chuong: {$max: "$chuong"},
                         cap_nhat: {$max: "$cap_nhat"},
                         ten: {$first: "$ten"},
                         anh: {$first: "$anh"},
                         tong_luot_xem: {$first: "$tong_luot_xem"},
                         link: {$first: "$link"}
                    }
               },
               {
                    $sort: {tong_luot_xem: -1}
               },
               {
                    $limit: 5
               }
          ]);
     
          res.render('home', {slider, content, sidebar, userInfo, all_genre ,getTimeSinceLastUpdate})
     }
     catch(err) {
          console.log(`getHomepage - Line 234 (homeController.js) : ${err}`);
          res.send(err);
     }
};

const searchItems = async (req, res) => {
     const query = req.query.q;

     try {
         const results = await Chapter.aggregate([
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
               $match: {
                   "truyen_id.ten": { $regex: query, $options: "i" }
               }
          },
          {
               $project: {
                    ten: "$truyen_id.ten",
                    anh: "$truyen_id.anh",
                    chuong: "$chuong",
                    link: "$truyen_id.link",
                    tong_luot_xem: "$truyen_id.tong_luot_xem"
               }
          },
          {
               $group: {
                    _id: "$ten",
                    chuong: {$max: "$chuong"},
                    anh: {$first: "$anh"},
                    link: {$first: "$link"},
                    tong_luot_xem: {$first: "$tong_luot_xem"},
               }
          },
          {
               $project: {
                    ten: "$_id",
                    anh: "$anh",
                    chuong: "$chuong",
                    link: "$link",
                    tong_luot_xem: "$tong_luot_xem"
               }
          },
          {
               $sort: {tong_luot_xem: -1}
          }
         ]);
         res.json(results);
     } catch (error) {
         res.status(500).send(error.toString());
     }
};

module.exports = {getHomepage, searchItems};