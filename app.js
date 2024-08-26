const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression');

const { default: mongoose } = require('mongoose');

const app = express();
const PORT = 8002;

app.use(
     compression({
          level: 6, // Mức độ nén từ 0 đến 9 (9 là nén nhiều nhất)
          threshold: 1024, // Chỉ nén những phản hồi lớn hơn 1KB
          filter: (req, res) => {
          if (req.headers['x-no-compression']) {
               // Bỏ qua nén nếu tiêu đề 'x-no-compression' được gửi từ client
               return false;
          }
          return compression.filter(req, res); // Mặc định sử dụng bộ lọc của compression
          },
     })
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// Connect to databse
const uri = 'mongodb://localhost:27017/tutientruyen';
mongoose.connect(uri)
     .then(() => console.log('Connect successfully !'))
     .catch(() => console.log('Connect fail !'));

mongoose.connection
     .on('disconnected', () => {console.log('disconnected to database')})
     .on('error', (err) => {console.log(`error to connect database : ${err}`)});

// Route
app.use('/', require('./routes/home'));
app.use('/truyen', require('./routes/comic'));
app.use('/filter', require('./routes/filter'));
app.use('/login', require('./routes/login'));
app.use('/addComic', require('./routes/addComic'));
app.use('/addChapter', require('./routes/addChapter'));

app.listen(PORT, () => {
     console.log(`Server is listening at ${PORT} ...`);
})
