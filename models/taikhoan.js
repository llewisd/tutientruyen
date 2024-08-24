const mongoose = require('mongoose');

const taikhoan_Schema = mongoose.Schema({
     ten: String,
     email: String,
     mat_khau: String,
     anh: {
          type: String,
          default: "/images/local/anonymous.png"
     },
     quyen: {
          type: String,
          enum: ['user','trans','admin'],
          default: 'user'
     },
     loai: {
          type: String,
          enum: ['lc','fb','gg'],
          default: 'lc'
     }
}, {collection: 'Taikhoan',  versionKey: false});

taikhoan_Schema.index({email : 1});

const Taikhoan = mongoose.model('Taikhoan', taikhoan_Schema);

module.exports = Taikhoan;