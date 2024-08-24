const mongoose = require('mongoose');
const capitalizeFirstLetter = require('../global').capitalizeFirstLetter;
const capitalizeWords = require('../global').capitalizeWords;
const stringToSlug = require('../global').stringToSlug;

// function stringToSlug(str) {
//      let from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
//          to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
//      for (let i=0, l=from.length ; i < l ; i++) {
//        str = str.replace(RegExp(from[i], "gi"), to[i]);
//      }
//      str = str.toLowerCase()
//            .trim()
//            .replace(/^[^\w]+|[^\w]+$/g, '')
//            .replace(/[^\w\s]/g, '')
//            .replace(/[^a-z0-9\-]/g, '-')
//            .replace(/-+/g, '-');
//      return str;
// }

const truyen_Schema = mongoose.Schema({
     ten: {
          type: String,
          unique: true,
     },
     ten_khac: {
          type: String,
          default: "Đang cập nhật"
     },
     link: {
          type: String,
     },
     anh: String,
     anh_root: String,
     tac_gia: {
          type: String,
          default: "Đang cập nhật"
     },
     mo_ta: {
          type: String,
          default: "Đang cập nhật"
     },
     trang_thai: {
          type: String,
          enum: ['Đang cập nhật', 'Hoàn thành']
     },
     tong_luot_xem: {
          type: Number,
          default: 0
     },
     the_loai: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: 'Theloai'
     },
     user_upload: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Taikhoan'
     }
}, { collection: 'Truyen',  versionKey: false });

truyen_Schema.pre('validate', function(next) {
     this.ten = this.ten.toLowerCase();
     this.ten = capitalizeWords(this.ten);
     this.link = stringToSlug(this.ten);
     next();
})

truyen_Schema.pre('findOneAndDelete', async function(next) {
     const Chapter = mongoose.model('Chapter');
     // Tìm tất cả các bình luận liên quan đến Chapter này
     const truyenId = this.getQuery()._id; // Lấy ID từ điều kiện truy vấn

     // Lọc tất cả chapter có liên quan
     const all_chapter = await Chapter.find({truyen: truyenId});

     // Lặp và xóa từng chapter
     for(const chapter of all_chapter) {
          await Chapter.findOneAndDelete({_id: chapter._id});
     }
});


const Truyen = mongoose.model('Truyen', truyen_Schema);

module.exports = Truyen;