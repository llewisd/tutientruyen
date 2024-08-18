const mongoose = require('mongoose');
const capitalizeFirstLetter = require('../global').capitalizeFirstLetter;
const capitalizeWords = require('../global').capitalizeWords;

function stringToSlug(str) {
     let from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
         to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
     for (let i=0, l=from.length ; i < l ; i++) {
       str = str.replace(RegExp(from[i], "gi"), to[i]);
     }
     str = str.toLowerCase()
           .trim()
           .replace(/^[^\w]+|[^\w]+$/g, '')
           .replace(/[^\w\s]/g, '')
           .replace(/[^a-z0-9\-]/g, '-')
           .replace(/-+/g, '-');
     return str;
}

const truyen_Schema = mongoose.Schema({
     ten: {
          type: String,
          unique: true,
     },
     ten_khac: {
          type: String,
          default: "Đang cập nhật"
     },
     link: String,
     anh: String,
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
     }
}, { collection: 'Truyen',  versionKey: false });

truyen_Schema.pre('validate', function(next) {
     this.ten = this.ten.toLowerCase();
     this.ten = capitalizeWords(this.ten);
     this.link = stringToSlug(this.ten);
     next();
})


const Truyen = mongoose.model('Truyen', truyen_Schema);

module.exports = Truyen;