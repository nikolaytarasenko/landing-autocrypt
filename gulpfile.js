const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const connect = require('gulp-connect');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

const appPath = {
    scss: './app/scss/styles.scss',
    pug: './app/pug/index.pug',
    img: './app/images/**/*.*',
    fonts: './app/fonts/**/*.*'
}

const destPath = {
    css: './dest/css',
    html: './dest',
    img: './dest/images',
    fonts: './dest/fonts'
}

/* Styles */
function buildStyles() {
    return src(appPath.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(rename('styles.min.css'))
        .pipe(sourcemaps.write())
        .pipe(dest(destPath.css))
        .pipe(connect.reload());
}

/* HTML*/
function buildHtml() {
    return src(appPath.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest(destPath.html))
        .pipe(connect.reload());
}

/* Local Server */
function startLocalServer() {
    connect.server({
        root: 'dest',
        port: 8080,
        livereload: true
    })
}

/* Images */
function copyImages() {
    return src(appPath.img)
        .pipe(dest(destPath.img));
}

/* Fonts */
function copyFonts() {
    return src(appPath.fonts)
        .pipe(dest(destPath.fonts));
}

/* Delete */
function clean(cb) {
    rimraf('dest', cb);
}

/* Watchers */
function watchCode() {
    watch('./app/scss/**/*.scss', buildStyles);
    watch('./app/pug/**/*.pug', buildHtml);
    watch(appPath.img, copyImages)
    watch(appPath.fonts, copyFonts)
}

exports.default = series(clean, parallel(buildHtml, buildStyles, copyImages, copyFonts), parallel(startLocalServer, watchCode));