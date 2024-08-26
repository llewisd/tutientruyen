// npm install --save-dev gulp gulp-cssnano gulp-uglify
// run : npx gulp

const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const path = require('path');

// Task để nén các tệp CSS và giữ nguyên tên file
gulp.task('minify-css', function () {
     return gulp.src('public_src/css/**/*.*') // Đọc tất cả các tệp trong thư mục public_test/css và các thư mục con
       .pipe(cssnano()) // Nén các tệp CSS
       .pipe(gulp.dest(function(file) {
         // Đưa các tệp nén vào thư mục public_test/css-min với cấu trúc thư mục gốc
         return path.join('public/css', path.relative('public_src/css', file.base));
       }));
   });

gulp.task('change-image', function () {
  return gulp.src('public_src/images/**/*.*') // Đọc tất cả các tệp trong thư mục public_test/css và các thư mục con
    .pipe(gulp.dest(function(file) {
      return path.join('public/images', path.relative('public_src/images', file.base));
    }));
});

// Task để nén các tệp JavaScript và giữ nguyên tên file
gulp.task('minify-js', function () {
     return gulp.src('public_src/js/**/*.*') // Đọc tất cả các tệp trong thư mục public_test/js và các thư mục con
       .pipe(uglify()) // Nén các tệp js
       .pipe(gulp.dest(function(file) {
         // Đưa các tệp nén vào thư mục public_test/js-min với cấu trúc thư mục gốc
         return path.join('public/js', path.relative('public_src/js', file.base));
       }));
   });

// Task mặc định để chạy cả hai task nén CSS và JS
gulp.task('default', gulp.series('minify-css','change-image' ,'minify-js'));

