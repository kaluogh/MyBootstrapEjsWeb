// import less from 'gulp-less';
// import babel from 'gulp-babel';
// import concat from 'gulp-concat';
// import uglify from 'gulp-uglify';
// import cleanCSS from 'gulp-clean-css';

// import gulp from 'gulp';
// import rename from 'gulp-rename';
// import del from 'del';
// import ejs from 'gulp-ejs';
const gulp = require ('gulp');
const rename = require ('gulp-rename');
const del = require ('del');
const ejs = require ('gulp-ejs');
const { development, production } = require('gulp-environments');
const minifyHtml = require('gulp-minify-html');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

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
    .pipe(rename(function(tempPath){
      tempPath.dirname = './';
    }))
    .pipe(gulp.dest(PATH_DEST_js))
}

function  G_scss() {
  return gulp.src(PATH_scss)
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

const G_test = gulp.series( development.task, G_clean, gulp.parallel(G_assets, G_html, G_js, G_scss, G_appjs));
const G_test2 = gulp.series( production.task, G_clean, gulp.parallel(G_assets, G_html, G_js, G_scss, G_appjs));

// G_html()
// exports.clean = clean
export { G_clean, G_html, G_assets, G_js, G_scss, G_appjs, G_test, G_test2}
 
// const paths = {
//   styles: {
//     src: 'src/styles/**/*.less',
//     dest: 'assets/styles/'
//   },
//   scripts: {
//     src: 'src/scripts/**/*.js',
//     dest: 'assets/scripts/'
//   }
// };
 
/*
 * For small tasks you can export arrow functions
 */
// export const clean = () => del([ 'assets' ]);
 
/*
 * You can also declare named functions and export them as tasks
 */
// export function styles() {
//   return gulp.src(paths.styles.src)
//     .pipe(less())
//     .pipe(cleanCSS())
//     // pass in options to the stream
//     .pipe(rename({
//       basename: 'main',
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest(paths.styles.dest));
// }
 
// export function scripts() {
//   return gulp.src(paths.scripts.src, { sourcemaps: true })
//     .pipe(babel())
//     .pipe(uglify())
//     .pipe(concat('main.min.js'))
//     .pipe(gulp.dest(paths.scripts.dest));
// }
 
 /*
  * You could even use `export as` to rename exported tasks
  */
// function watchFiles() {
//   gulp.watch(paths.scripts.src, scripts);
//   gulp.watch(paths.styles.src, styles);
// }
// export { watchFiles as watch };
 
// const build = gulp.series(clean, gulp.parallel(styles, scripts));
/*
 * Export a default task
 */
// export default build;