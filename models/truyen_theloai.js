const mongoose = require('mongoose');

const truyen_theloai_Schema = mongoose.Schema({
     truyen: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Truyen'
     },
     the_loai: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'The_loai',
     }
}, {_id: false, collection: 'Truyen_Theloai',  versionKey: false});

const Truyen_Theloai = mongoose.model('Truyen_Theloai', truyen_theloai_Schema);

module.exports = Truyen_Theloai;