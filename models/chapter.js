const mongoose = require('mongoose');
const Truyen = require('../models/truyen');

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
   

const Chapter = mongoose.model('Chapter', chapter_Schema);

module.exports = Chapter;