var gulp = require('gulp');
var rename = require('gulp-rename');
var compilehandlebars = require('gulp-compile-handlebars');
var handlebars = require('gulp-handlebars');
var cssmin = require('gulp-cssmin');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

var path = {
    css:  './src/*.scss',
    html: {
        pages: './src/pages/**/*.hbs',
        partials: './src/partials/',
        templates: './src/templates/**/*.hbs'
    },
    fonts: 'src/fonts/*.ttf',
    icons: 'src/icons/**/*.+(png|jpg|ico)',
    images: 'src/images/**/*.+(png|jpg|ico)',
    mockapi: 'src/mockapi/*.json',
    scripts: 'src/scripts/*.js',
    vendors: { js: './src/vendors/js/*.js'},
    dist: {
      css:  'dist/',
      css_for_dev:  'dist/in_dev',
      html: 'dist/',
      fonts: 'dist/fonts',
      images: 'dist/images',
      mockapi: 'dist/mockapi',
      scripts: 'dist/scripts/',
      templates: 'dist/',
      vendors: { 
        js: './dist/'
      },
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
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dist.css_for_dev))
    .pipe(cssmin())
    .pipe(gulp.dest(path.dist.css));
});

gulp.task('html', function () {
    return gulp.src(path.html.pages)
        .pipe(compilehandlebars({}, {
            ignorePartials: true,
            batch: [path.html.partials]
        }))
        .pipe(rename({
            dirname: '.',
            extname: '.html'
        }))
        .pipe(gulp.dest(path.dist.html));
});

gulp.task('vendor_js', function () {
  return gulp.src(path.vendors.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(path.dist.vendors.js));
});

gulp.task('fonts', function () {
    return gulp.src(path.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('mockapi', function () {
    return gulp.src(path.mockapi)
    .pipe(gulp.dest(path.dist.mockapi));
});

gulp.task('scripts', function () {
    return gulp.src(path.scripts)
    .pipe(gulp.dest(path.dist.scripts));
});

gulp.task('images', function(){
  return gulp.src(path.images)
  .pipe(gulp.dest(path.dist.images));
});

gulp.task('hbs_templates', function() {
  return gulp.src(path.html.templates)
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'blocks.templates',
      noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(path.dist.templates))
});

gulp.task('build', ['html', 'css', 'fonts', 'images', 'mockapi', 'scripts', 'vendor_js', 'hbs_templates']);

gulp.task('watch', function () {
  gulp.watch(path.watch.css, ['css']);
  gulp.watch(path.watch.html, ['html']);
  gulp.watch(path.fonts, ['fonts']);
  gulp.watch(path.scripts, ['scripts']);
  gulp.watch(path.html.templates, ['hbs_templates']);
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