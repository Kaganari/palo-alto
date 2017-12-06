var gulp = require('gulp');
var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');
var cssmin = require('gulp-cssmin');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

var path = {
    css:  './src/*.scss',
    html: {
        pages: './src/pages/**/*.hbs',
        partials: './src/partials/'
    },
    fonts: 'src/fonts/*.ttf',
    icons: 'src/icons/**/*.+(png|jpg|ico)',
    images: 'src/images/**/*.+(png|jpg|ico)',
    dist: {
      css:  'dist/',
      html: 'dist/',
      fonts: 'dist/fonts',
      images: 'dist/images'
    },
    watch: {
        css: './src/**/*.scss',
        html: './src/**/*.hbs',
        dist: 'dist/*.css'
    }
};

gulp.task('default', ['build', 'serve', 'watch']);

gulp.task('css', function () {
  return gulp.src(path.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dist.css));
});

gulp.task('html', function () {
    return gulp.src(path.html.pages)
        .pipe(handlebars({}, {
            ignorePartials: true,
            batch: [path.html.partials]
        }))
        .pipe(rename({
            dirname: '.',
            extname: '.html'
        }))
        .pipe(gulp.dest(path.dist.html));
});

gulp.task('fonts', function () {
    return gulp.src(path.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});


gulp.task('images', function(){
  return gulp.src(path.images)
  .pipe(gulp.dest(path.dist.images));
});

gulp.task('build', ['html', 'css', 'fonts', 'images']);

gulp.task('watch', function () {
  gulp.watch(path.watch.css, ['css']);
  gulp.watch(path.watch.html, ['html']);
  gulp.watch(path.fonts, ['fonts']);
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    open: false,
    files: ['home.html', 'profile.html'],
    server: {
      baseDir: path.dist.html
    },
    index: "home.html"
  });
  gulp.watch('dist/**').on('change', browserSync.reload);
});