const mongoose = require('mongoose');

const theloai_Schema = mongoose.Schema({
     ten: {
          type: String,
          enum: ['Action', 'Adventure', 'Hệ thống', 'Trọng sinh', 
               'Cổ đại','Đô thị','Kinh dị','Quân sự','Tiên hiệp','Fantasy','Comedy','Trinh thám',
          'Ngôn tình','Slice of life','Ngược','Xuyên không','Harem','Em bé','Mạt thế','Cung đấu']
     }
}, {collection: 'Theloai',  versionKey: false});

const Theloai = mongoose.model('Theloai', theloai_Schema);

module.exports = Theloai;