const gulp = require ('gulp');
const rename = require ('gulp-rename');
const del = require ('del');
const ejs = require ('gulp-ejs');
const { development, production } = require('gulp-environments');
const minifyHtml = require('gulp-minify-html');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const browserSync = require('browser-sync');
const server = browserSync.create();

const path = require('path');
const PATH_dist = 'dist'
const PATH_node_modules = 'node_modules'
const PATH_assets = 'src/assets/**'
const PATH_DEST_assets = path.join(PATH_dist, 'assets')
const PATH_html = 'src/**/*.html'
const PATH_js = ['src/**/*.js', '!src/global/js/app.js']
const PATH_DEST_js = path.join(PATH_dist, 'js')
const PATH_scss = ['src/**/*.scss', '!src/global/scss/app.scss']
const PATH_DEST_scss = path.join(PATH_dist, 'css')


function G_clean(){
    return del([ 'dist' ])
}

function G_html(){
    return gulp.src(PATH_html)
      .pipe(ejs())
      .pipe(production(minifyHtml()))
      .pipe(rename(function(tempPath){
        tempPath.dirname = './';
      }))
      .pipe(gulp.dest(PATH_dist))
}

function G_assets(){
  return gulp.src(PATH_assets)
    //add minify
    .pipe(gulp.dest(PATH_DEST_assets))
}

function G_js(){
  return gulp.src(PATH_js)
    .pipe(production(babel({
      presets: ['@babel/env']
    })))
    .pipe(production(uglify()))
    .pipe(rename(function(tempPath){
      tempPath.dirname = './';
    }))
    .pipe(gulp.dest(PATH_DEST_js))
}

function  G_scss() {
  return gulp.src(PATH_scss)
    .pipe(development(sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(development(sourcemaps.write()))
    .pipe(production(cssmin()))
    .pipe(rename(function(tempPath){
      tempPath.dirname = './';
    }))
    .pipe(gulp.dest(PATH_DEST_scss))
}

function G_appjs() {
    let jqueryPath = path.join(PATH_node_modules,'jquery', 'dist', 'jquery.min.js');
    let popperPath = path.join(PATH_node_modules,'popper.js', 'dist', 'umd', 'popper.min.js');
    let bootstrapPath = path.join(PATH_node_modules,'bootstrap', 'dist','js', 'bootstrap.min.js');
    let appjsPath = 'src/global/js/app.js';
    return gulp.src([jqueryPath, popperPath, bootstrapPath, appjsPath])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.join(PATH_dist, 'js')));
}

function G_appscss() {
  let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: path.join(PATH_node_modules,'bootstrap', 'scss')
  }
  return gulp.src('src/global/scss/app.scss')
    .pipe(development(sourcemaps.init()))
    .pipe(sass(sassOptions).on('error', sass.logError))
    // .pipe(autoprefixer())
    .pipe(development(sourcemaps.write()))
    .pipe(production(cssmin()))
    .pipe(rename(function(tempPath){
      tempPath.dirname = './';
    }))
    .pipe(gulp.dest(PATH_DEST_scss))
}

function G_copy_js() {
  let swiperJsPath = path.join(PATH_node_modules,'swiper','js','swiper.min.js');
    return gulp.src([swiperJsPath])
        .pipe(rename(function(tempPath){
            tempPath.dirname = './';
        }))
        .pipe(gulp.dest(PATH_DEST_js));
}
function G_copy_css() {
  let swiperCssPath = path.join(PATH_node_modules,'swiper','css','swiper.min.css');
    return gulp.src([swiperCssPath])
        .pipe(rename(function(tempPath){
            tempPath.dirname = './';
        }))
        .pipe(gulp.dest(PATH_DEST_scss));
}

function G_reload(done) {
  server.reload();
  done();
}

function G_server(done) {
  server.init({
    server: {
      baseDir: PATH_dist,
    },
    port: 6081
  });
  done();
}

function G_watch() {
  // gulp.watch(PATH_DEST_assets, gulp.series(G_assets, G_reload));
  gulp.watch([PATH_html,'src/templates/*.ejs'], gulp.series(G_html, G_reload));
  gulp.watch(PATH_js, gulp.series(G_js, G_reload));
  gulp.watch('src/global/js/app.js', gulp.series(G_appjs, G_reload));
  gulp.watch(PATH_scss, gulp.series(G_scss, G_reload));
  gulp.watch('src/global/scss/app.scss', gulp.series(G_appscss, G_reload));
}

const dev = gulp.series( 
  development.task, G_clean, 
  gulp.parallel(G_assets, G_html, G_js, G_scss, G_appjs, G_appscss, G_copy_js, G_copy_css), 
  G_server, G_watch);
const pro = gulp.series( 
  production.task, G_clean, 
  gulp.parallel(G_assets, G_html, G_js, G_scss, G_appjs, G_appscss, G_copy_js, G_copy_css), 
  G_server, G_watch);

export default dev
// export { G_clean, G_html, G_assets, G_js, G_scss, G_appjs, G_appscss, dev, pro}