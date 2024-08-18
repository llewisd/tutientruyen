const Chapter = require('../models/chapter');
const Binhluan = require('../models/binhluan');
const Theloai = require('../models/theloai');

const getChapter = async (req, res) => {
     try {
          // Lấy dữ liệu tài khoản sau khi xác thực
          const userInfo = req.userInfo;

          const chapter = parseInt(req.params.chapter);

          const getchapterInfo = await Chapter.aggregate([
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
               {
                    $sort: {"chuong": -1}
               },
               {
                    $group: {
                         _id: "$truyen",
                         tat_ca_chuong: {$push: "$chuong"},
                         documents: {$push : "$$ROOT"}
                    }
               },
               {
                    $unwind: "$documents"
               },
               {
                    $project: { 
                         chapter_id: "$documents._id",
                         truyen: "$documents.truyen",
                         chuong: "$documents.chuong",
                         anh: "$documents.anh",
                         truyen_id: "$documents.truyen_id",
                         tat_ca_chuong: "$tat_ca_chuong"
                    }
               },
               {
                    $sort: {"chuong": 1}
               },
               {
                    $match: {
                         "truyen_id.link": req.params.link, 
                         "chuong": {
                              $in: [
                                   chapter - 1,
                                   chapter,
                                   chapter + 1
                              ]
                         }
                    }
               },
               {
                    $project: {
                         chuong: "$chuong",
                         anh: "$anh",
                         ten: "$truyen_id.ten",
                         link: "$truyen_id.link",
                         tat_ca_chuong: "$tat_ca_chuong"
                    }
               },
               {
                    $sort: {"chuong": 1}
               },
               {
                    "$group": {
                    _id: "$link",
                    ds_chuong: { $push: "$chuong" }, // Tạo mảng các tên không trùng lặp
                    documents: { $push: "$$ROOT" }  // Tạo mảng chứa tất cả tài liệu
                    }
               },
               {
                    $unwind: "$documents"  // Tách các tài liệu ra từ mảng
               },
               {
                    $project: {
                         ten: "$documents.ten",
                         link: "$_id",
                         chuong: "$documents.chuong",
                         anh: "$documents.anh",
                         ds_chuong: "$ds_chuong",
                         tat_ca_chuong: "$documents.tat_ca_chuong"

                    }
               },
               {
                    $match: {chuong: chapter}
               }
          ]);
          
          const chapterInfo = getchapterInfo[0];
          // Ta định nghĩa status của chapter : 
          // 1 : chapter đầu tiên
          // 2 : chapter cuối cùng
          // 3 : không là chapter đầu tiên, cũng không là chapter cuối cùng (chapter giữa)
          // 4 : chapter duy nhất của truyện
          // -1 : chapter không tồn tại 
          
          let statusOfChapter = -1;
          if (!chapterInfo) return res.status(404).send('Chapter is not found');
          else {
               if (chapterInfo.ds_chuong.length === 1) {
                    statusOfChapter = 4
               }
               else if (chapterInfo.ds_chuong.length === 2) {
                    let index = chapterInfo.ds_chuong.findIndex(item => item === chapter);
                    if(index === 0) statusOfChapter = 1;
                    else statusOfChapter = 2;
               }
               else {
                    statusOfChapter = 3
               }
          }
          
          // Tìm tất cả thể loại
          const all_genre = await Theloai.find().sort({ ten: 1 });

          // Mỗi khi click vào chương sẽ cập nhật luot_xem += 1
          await Chapter.findOneAndUpdate({_id: req.query.chapter_id}, { $inc: { luot_xem: 1 } }, { new: true })
               .catch(err => {});
          
          res.render('chapter', {chapter,chapterInfo, statusOfChapter, userInfo, all_genre})
     }
     catch(err) {
          console.log(`getChapter - Line 137 (chapterController.js) : ${err}`);
     }
};

const createComment = async (req, res) => {
     try {
          const current_url = req.originalUrl.replace('/comment/create','').split('?')[0];
          const user = req.cookies.user_id;
          const pathArray = current_url.split('/');
          const link = pathArray[2];
          const chapter = parseInt(pathArray[3].replace('chapter-',''));
          const response = req.query.response;
          const content = req.body.noi_dung;

          const getChapter = await Chapter.aggregate([
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
                    $match: {"truyen_id.link": link, "chuong": chapter}
               }
          ]);
          const newComment = new Binhluan({
               tai_khoan: user,
               chapter: getChapter[0]._id,
               noi_dung: content
          });
          await newComment.save();
          
          if (response) {
               Binhluan.findByIdAndUpdate(response, {$push: {binh_luan_con: newComment._id}}, {new: true})
               .catch(err => {
                    console.error(`createComment - Line 228 (chapterController.js) : ${err.message}`);
               });
          }

          // Mỗi khi tạo bình luận sẽ cập nhật so_binh_luan += 1
          await Chapter.findByIdAndUpdate(getChapter[0]._id, { $inc: { so_binh_luan: 1 } }, { new: true })
               .catch(err => console.log(`getChapter - Line 183 (chapterController.js) : ${err}`));
          
          res.redirect(current_url);
     }
     catch(err) {
          console.log(`createComment - Line 184 (chapterController.js) : ${err}`);
     }
}

const deleteComment = async (req, res) => {
     try {
          const comment_id = req.query.comment_id;
          const path = req.query.current_url;
          const pathArray = path.split('/');
          const link = pathArray[2];
          const chapter = parseInt(pathArray[3].replace('chapter-',''));
          
          await Binhluan.updateOne(
               { binh_luan_con: comment_id },
               { $pull: { binh_luan_con: comment_id } }
          );
          await Binhluan.findOneAndDelete({_id: comment_id})
          .then(result => {
               res.redirect(path);
          })
          .catch(error => {
               console.error('deleteComment - Line 240 (chapterController.js) : ', error);
          });

          // Mỗi khi xóa bình luận sẽ cập nhật so_binh_luan
     }
     catch(err) {
          console.log(`deleteComment - Line 210 (chapterController.js) : ${err}`);
     }
}

const loadComment = async (req, res) => {
     // Lấy dữ liệu comment
     const pathArray = req.originalUrl.split('/');
     const link = pathArray[2];
     const chapter = parseInt(pathArray[3].replace('chapter-',''));
     
     try {

          // Phần Comment
          // Bước 1: Lọc ra các bình luận con
          const result = await Binhluan.aggregate([
               // Bước 1: Lấy tất cả các _id của bình luận con
               {
               $unwind: {
                    path: "$binh_luan_con",
                    preserveNullAndEmptyArrays: true
               }
               },
               {
               $group: {
                    _id: null,
                    childCommentIds: { $addToSet: "$binh_luan_con" }
               }
               },
               {
               $project: {
                    _id: 0,
                    childCommentIds: 1
               }
               }
          ]).exec();
          
          const childCommentIds = result.length > 0 ? result[0].childCommentIds : [];
          // Bước 2: Lọc ra các bình luận không phải là bình luận con
          const commentInfo = await Binhluan.aggregate([

               {
               $match: {
                    _id: { $nin: childCommentIds }
               }
               },
               {
               $lookup: {
                    from: 'Binhluan',  // Collection mà bạn cần lấy dữ liệu
                    localField: 'binh_luan_con',
                    foreignField: '_id',
                    as: 'binh_luan_con_info'
               }
               },
               {
                    $addFields: {
                    binh_luan_con_info: {
                         $sortArray: {
                              input: "$binh_luan_con_info",
                              sortBy: { ngay_tao: -1 } // 1 là tăng dần, -1 là giảm dần
                         }
                    }
                    }
               },
               {
                    $lookup: {
                    from: 'Taikhoan',
                    localField: 'tai_khoan',
                    foreignField: '_id',
                    as: 'taikhoan_id'
                    }
               },
               {
                    $lookup: {
                    from: 'Chapter',
                    localField: 'chapter',
                    foreignField: '_id',
                    as: 'chapter_id'
                    }
               },
               {
                    $lookup: {
                         from: 'Truyen',
                         localField: 'chapter_id.truyen',
                         foreignField: '_id',
                         as: 'truyen_id'
                    }
               },
               {
                    $project: {
                         tai_khoan: 1,
                         chapter: 1,
                         ngay_tao: 1,
                         thich: 1,
                         ghet: 1,
                         binh_luan_con: 1,
                         noi_dung: 1,
                         binh_luan_con_info: 1,
                         ten: "$taikhoan_id.ten",
                         anh: "$taikhoan_id.anh",
                         quyen: "$taikhoan_id.quyen",
                         loai: "$taikhoan_id.loai",
                         chuong: "$chapter_id.chuong",
                         truyen: "$truyen_id.ten",
                         link: "$truyen_id.link",
                         
                    }
               },
               {
                    $unwind: "$ten"
               },
               {
                    $unwind: "$anh"
               },
               {
                    $unwind: "$quyen"
               },
               {
                    $unwind: "$loai"
               },
               {
                    $unwind: "$chuong"
               },
               {
                    $unwind: "$truyen"
               },
               {
                    $unwind: "$link"
               },
               {
                    $unwind: {
                    path: '$binh_luan_con_info',
                    preserveNullAndEmptyArrays: true
                    }
               },
               {
                    $lookup: {
                    from: 'Taikhoan',
                    localField: 'binh_luan_con_info.tai_khoan',
                    foreignField: '_id',
                    as: 'binh_luan_con_info.taikhoan_id'
                    }
               },
               {
                    $lookup: {
                    from: 'Chapter',
                    localField: 'binh_luan_con_info.chapter',
                    foreignField: '_id',
                    as: 'binh_luan_con_info.chapter_id'
                    }
               },
               {
                    $lookup: {
                         from: 'Truyen',
                         localField: 'binh_luan_con_info.chapter_id.truyen',
                         foreignField: '_id',
                         as: 'binh_luan_con_info.truyen_id'
                    }
               },
               {
                    $addFields: {
                    'binh_luan_con_info.taikhoan_id': { $arrayElemAt: ['$binh_luan_con_info.taikhoan_id', 0] },
                    'binh_luan_con_info.chapter_id': { $arrayElemAt: ['$binh_luan_con_info.chapter_id', 0] },
                    'binh_luan_con_info.truyen_id': { $arrayElemAt: ['$binh_luan_con_info.truyen_id', 0] }
                    }
               },
               {
                    $group: {
                    _id: '$_id',
                    binh_luan_con_info: { $push: "$binh_luan_con_info"},
                    tai_khoan: { $first: '$tai_khoan' },
                    chapter: { $first: '$chapter' },
                    ngay_tao: { $first: '$ngay_tao' },
                    thich: { $first: '$thich' },
                    ghet: { $first: '$ghet' },
                    noi_dung: { $first: '$noi_dung' },
                    ten: { $first: '$ten' },
                    anh: { $first: '$anh' },
                    quyen: { $first: '$quyen' },
                    loai: { $first: '$loai' },
                    chuong: { $first: '$chuong' },
                    truyen: { $first: '$truyen' },
                    link: { $first: '$link' },
                    }
               },
               {
                    $project: {
                         tai_khoan: 1,
                    chapter: 1,
                    ngay_tao: 1,
                    thich: 1,
                    ghet: 1,
                    noi_dung: 1,
                    ten: 1,
                    anh: 1,
                    quyen: 1,
                    loai: 1,
                    chuong: 1,
                    truyen: 1,
                    link: 1,
                    binh_luan_con: {
                         $cond: {
                              if: {
                              $eq: [
                              {
                                   $size: {
                                   $filter: {
                                        input: "$binh_luan_con_info",
                                        as: "item",
                                        cond: { $ne: ["$$item", {}] }
                                   }
                                   }
                              },
                              0
                              ]
                              },
                              then: [],
                              else: {
                              $filter: {
                              input: "$binh_luan_con_info",
                              as: "item",
                              cond: { $ne: ["$$item", {}] }
                              }
                              }
                         }

                    }
                    }
               },
               {
                    $match: {link: link, chuong: chapter}
               },
               {
                    $sort: {ngay_tao: -1}
               },
          ]).exec();
          res.send(commentInfo);

     }
     catch(err) {
          console.log(`loadComment - Line 450 (chapterController.js) : ${err}`);
     }
}

module.exports = {getChapter, createComment, deleteComment, loadComment};