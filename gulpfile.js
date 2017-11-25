var gulp = require('gulp');
var nunjucks = require('gulp-nunjucks');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

var path = {
    css:  'src/styles/*.scss',
    html: 'src/templates/*.html',
    img:  'src/images/*.png',
    fonts: 'src/fonts/*.ttf',
    dist: {
      css:  'dist/styles/',
      html: 'dist/',
      img:  'dist/images/',
      fonts: 'dist/fonts/'
    }
};

gulp.task('default', ['build', 'serve', 'watch']);

gulp.task('css', function () {
  return gulp.src(path.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(path.dist.css));
});

gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(path.dist.html));
});

gulp.task('img', function () {
  return gulp.src(path.img)
    .pipe(gulp.dest(path.dist.img));
});

gulp.task('fonts', function () {
  return gulp.src(path.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('build', ['html', 'css', 'img', 'fonts']);

gulp.task('watch', function () {
  gulp.watch(path.css, ['css']);
  gulp.watch(path.html, ['html']);
  gulp.watch(path.img, ['img']);
  gulp.watch(path.fonts, ['fonts']);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: path.dist.html
    }
  });
  gulp.watch('dist/**').on('change', browserSync.reload);
});