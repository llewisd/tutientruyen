const mongoose = require('mongoose');
const Chapter = require('../models/chapter');

const binhluan_Schema = mongoose.Schema({
     tai_khoan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Taikhoan"
     },
     chapter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chapter"
     },
     ngay_tao: {
          type: Date,
          default: Date.now()
     },
     thich: {
          type: Number,
          default: 0
     },
     ghet: {
          type: Number,
          default: 0
     },
     binh_luan_con: [
          {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Binhluan"
          }
     ],
     noi_dung : String
}, {collection: 'Binhluan',  versionKey: false});

// Middleware pre hook để xóa tất cả các comment con
binhluan_Schema.pre('findOneAndDelete', async function(next) {
     const docToDelete = await this.model.findOne(this.getFilter());
     // Trước khi xóa cập nhật lại so_binh_luan
     const chapterId = docToDelete.chapter;
     if (chapterId) {
          await Chapter.findByIdAndUpdate(chapterId, {
               $inc: { so_binh_luan: -1 } // Giảm giá trị so_binh_luan đi 1
          });
     }
     // Xóa các bình luận con
     if (docToDelete) {
         await this.model.deleteMany({ _id: { $in: docToDelete.binh_luan_con } });
     }
     next();
 });


binhluan_Schema.pre('deleteMany', async function (next) {
     const query = this.getQuery();
     this.chaptersAffected = await Binhluan.aggregate([
       { $match: query },
       { $group: { _id: "$chapter", count: { $sum: 1 } } }
     ]);
     next();
});
   
   // Hook post để cập nhật so_binh_luan sau khi xóa
binhluan_Schema.post('deleteMany', async function () {
     if (this.chaptersAffected) {
       for (const chapter of this.chaptersAffected) {
         await Chapter.findByIdAndUpdate(chapter._id, {
           $inc: { so_binh_luan: -chapter.count } // Giảm giá trị so_binh_luan theo số bình luận đã xóa
         });
       }
     }
});


const Binhluan = mongoose.model('Binhluan', binhluan_Schema);

module.exports = Binhluan;