const Chapter = require('../models/chapter');
const Truyen = require('../models/truyen');
const Theloai = require('../models/theloai');
const mongoose = require('mongoose');
const capitalizeFirstLetter = require('../global').capitalizeFirstLetter
const getTimeSinceLastUpdate = require('../global').getTimeSinceLastUpdate;

const filterComic = async (req,res) => {
     // Lấy dữ liệu tài khoản sau khi xác thực
     const userInfo = req.userInfo;

     const items = req.query;
     try {
          const status = items.status || 'all';
          const arrange = items.arrange || 'date';
          const sortCondition = arrange === 'date' ? { cap_nhat: -1 } : { tong_luot_xem: -1 };
          const trans = items.trans || 'all';
          const genre = items.genre || 'all';
          const page = parseInt(items.page) || 1; // Trang hiện tại, mặc định là trang 1
          const limit = 2; // Số lượng mục trên mỗi trang, mặc định là 36
          const pagination_url = `/filter?status=${status}&arrange=${arrange}&trans=${trans}&genre=${genre}&page=`  

          const skip = (page - 1) * limit; // Số lượng mục cần bỏ qua
     
          const comicInfo = await Chapter.aggregate([
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
                         link: "$truyen_id.link",
                         anh: "$truyen_id.anh",
                         trang_thai: "$truyen_id.trang_thai",
                         tac_gia: "$truyen_id.tac_gia",
                         the_loai: "$truyen_id.the_loai",
                         tong_luot_xem: "$truyen_id.tong_luot_xem"
                    }
               },
               {
                    $unwind: "$the_loai"
               },
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
               {
                    $project: {
                         chuong: 1,
                         cap_nhat: 1,
                         ten: 1,
                         link: 1,
                         anh: 1,
                         trang_thai: 1,
                         tac_gia: 1,
                         the_loai: "$the_loai_id.ten",
                         tong_luot_xem: 1
                    }
               },
               {
                    $group: {
                         _id: "$_id",
                         chuong: {$first: "$chuong"},
                         cap_nhat: {$first: "$cap_nhat"},
                         ten: {$first: "$ten"},
                         link: {$first: "$link"},
                         anh: {$first: "$anh"},
                         trang_thai: {$first: "$trang_thai"},
                         tac_gia: {$first: "$tac_gia"},
                         the_loai: {$push: "$the_loai"},
                         tong_luot_xem: {$first: "$tong_luot_xem"}
                    }
               },
               {
                    $group: {
                         _id: "$ten",
                         chuong: {$max: "$chuong"},
                         cap_nhat: {$max: "$cap_nhat"},
                         link: {$first: "$link"},
                         anh: {$first: "$anh"},
                         trang_thai: {$first: "$trang_thai"},
                         tac_gia: {$first: "$tac_gia"},
                         the_loai: {$first: "$the_loai"},
                         tong_luot_xem: {$first: "$tong_luot_xem"}
                    }
               },
               {
                    $unwind: "$the_loai"
               },
               {
                    $match: {
                         $and: [
                              status === 'all' ? {} : { trang_thai: status },
                              trans === 'all' ? {} : {tac_gia: trans},
                              genre === 'all' ? {} : {the_loai: capitalizeFirstLetter(genre)}
                         ]
                    }
               },
               {
                    $group: {
                         _id: "$_id",
                         chuong: {$first: "$chuong"},
                         cap_nhat: {$first: "$cap_nhat"},
                         link: {$first: "$link"},
                         anh: {$first: "$anh"},
                         trang_thai: {$first: "$trang_thai"},
                         tac_gia: {$first: "$tac_gia"},
                         tong_luot_xem: {$first: "$tong_luot_xem"}
                    }
               },
               {
                    $project: {
                         ten: "$_id",
                         chuong: "$chuong",
                         cap_nhat: "$cap_nhat",
                         link: "$link",
                         anh: "$anh",
                         trang_thai: "$trang_thai",
                         tac_gia: "$tac_gia",
                         tong_luot_xem: "$tong_luot_xem"
                    }
               },
               {
                    $sort: sortCondition
               },
               {
                    $skip: skip
               },
               {
                    $limit: limit
               }
          ]);
     
          // Tính tổng số lượng mục để phân trang
          let total = await Chapter.aggregate([
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
                         link: "$truyen_id.link",
                         anh: "$truyen_id.anh",
                         trang_thai: "$truyen_id.trang_thai",
                         tac_gia: "$truyen_id.tac_gia",
                         the_loai: "$truyen_id.the_loai"
                    }
               },
               {
                    $unwind: "$the_loai"
               },
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
               {
                    $project: {
                         chuong: 1,
                         cap_nhat: 1,
                         ten: 1,
                         link: 1,
                         anh: 1,
                         trang_thai: 1,
                         tac_gia: 1,
                         the_loai: "$the_loai_id.ten"
                    }
               },
               {
                    $group: {
                         _id: "$_id",
                         chuong: {$first: "$chuong"},
                         cap_nhat: {$first: "$cap_nhat"},
                         ten: {$first: "$ten"},
                         link: {$first: "$link"},
                         anh: {$first: "$anh"},
                         trang_thai: {$first: "$trang_thai"},
                         tac_gia: {$first: "$tac_gia"},
                         the_loai: {$push: "$the_loai"}
                    }
               },
               {
                    $group: {
                         _id: "$ten",
                         chuong: {$max: "$chuong"},
                         cap_nhat: {$max: "$cap_nhat"},
                         link: {$first: "$link"},
                         anh: {$first: "$anh"},
                         trang_thai: {$first: "$trang_thai"},
                         tac_gia: {$first: "$tac_gia"},
                         the_loai: {$first: "$the_loai"}
                    }
               },
               {
                    $unwind: "$the_loai"
               },
               {
                    $match: {
                         $and: [
                              status === 'all' ? {} : { trang_thai: status },
                              trans === 'all' ? {} : {tac_gia: trans},
                              genre === 'all' ? {} : {the_loai: capitalizeFirstLetter(genre)}
                         ]
                    }
               },
               {
                    $group: {
                         _id: "$_id",
                         chuong: {$first: "$chuong"},
                         cap_nhat: {$first: "$cap_nhat"},
                         link: {$first: "$link"},
                         anh: {$first: "$anh"},
                         trang_thai: {$first: "$trang_thai"},
                         tac_gia: {$first: "$tac_gia"},
                    }
               },
               {
                    $count: 'totalCount'
               }
          ]);
          // Tìm tất cả thể loại
          const all_genre = await Theloai.find().sort({ ten: 1 });;

          total = total[0] ? total[0].totalCount : 0;
          const totalPages = Math.ceil(total / limit);
  
          res.render('filter', {currentPage: page, totalPages: totalPages, totalItems: total, 
               itemsPerPage: limit, comicInfo: comicInfo, pagination_url, all_genre, 
               status,trans, arrange, genre, userInfo ,getTimeSinceLastUpdate});

          // res.json({
          //      currentPage: page, totalPages: totalPages, totalItems: total, 
          //      itemsPerPage: limit, comicInfo: comicInfo
          // })
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Có lỗi xảy ra' });
      }
};

module.exports = {filterComic};