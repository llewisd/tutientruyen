const mongoose = require('mongoose');

const anh_Schema = mongoose.Schema({
     stt: Number,
     path: String
}, {_id: false});

const chapter_Schema = mongoose.Schema({
     truyen: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Truyen'
     },
     chuong: {
          type:Number,
     },
     cap_nhat: {
          type: Date,
          default: Date.now()
     },
     luot_xem: {
          type: Number,
          default: 0
     },
     so_binh_luan: {
          type: Number,
          default: 0
     },
     bao_loi: {
          type: Number,
          default: 0
     },
     anh: [anh_Schema]
}, {collection: 'Chapter',  versionKey: false});


// Cập nhật tổng lượt xem cho truyện
chapter_Schema.post('findOneAndUpdate', async function () {
     const Truyen = mongoose.model('Truyen');
     const chapterId = this.getQuery()._id; // Lấy ID từ điều kiện truy vấn
     const chapter = await Chapter.findById(chapterId);
     
     const truyenId = chapter.truyen; // Lấy ID của truyện từ thể loại

     const tongLuotXem = await Chapter.aggregate([
     { $match: { truyen: truyenId } }, // Chỉ lấy các thể loại thuộc truyện này
     { $group: { _id: null, total: { $sum: "$luot_xem" } } } // Tính tổng luot_xem
     ]);

     await Truyen.findByIdAndUpdate(truyenId, {
     tong_luot_xem: tongLuotXem.length ? tongLuotXem[0].total : 0,
     });
});

// Xóa chapter sẽ xóa các bình luận trong đó
chapter_Schema.pre('findOneAndDelete', async function(next) {
     try {
          const Binhluan = mongoose.model('Binhluan');
          // Tìm tất cả các bình luận liên quan đến Chapter này
          const chapterId = this.getQuery()._id; // Lấy ID từ điều kiện truy vấn

          // Lọc những bình luận mà không phải bình luận con
          const allComments = await Binhluan.find({ chapter: chapterId });
          let allChildCommentIds = await Binhluan.distinct('binh_luan_con',{ chapter: chapterId });
          allChildCommentIds = allChildCommentIds.map(id => new mongoose.Types.ObjectId(id));
          const comments = allComments.filter(comment => !allChildCommentIds.some(childId => childId.equals(comment._id)));
          
          // Dùng vòng lặp để xóa từng bình luận
          for (const comment of comments) {
               await Binhluan.findOneAndDelete({ _id: comment._id });
          }
  
          next();
      } catch (err) {
          next(err);
          console.log(`chapter.js - Line 73 : ${err}`);
      }
});
   

const Chapter = mongoose.model('Chapter', chapter_Schema);

module.exports = Chapter;