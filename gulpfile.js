const { series, parallel, src, dest, watch } = require('gulp');
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();

const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");

const path = {
    src: "./src/**/*",
    srcHTMLfiles: "./src/**/*.html",
    srcCSSdir: "./src/css/",
    srcCSSfiles: "./src/css/**/*.css",
    srcSCSSdir: "./src/scss",
    srcSCSSfiles: "./src/scss/**/*.scss",
    srcJSdir: "./src/js",
    srcJSfiles: "./src/js/**/*.js",
    dist: "./dist",
    distCSSdir: "./dist/css",
    distJSdir: "./dist/js"
}

/* 
-------- 
    DEVELOPMENT tasks
    Run: gulp
-------- 
*/

// Transpile SASS into CSS
function transpileCSS() {
    return src(["node_modules/bootstrap/scss/bootstrap.scss", path.srcSCSSfiles])
        //1. pass the files through sass compiler
        .pipe(sass().on("error", sass.logError))
        //2. pass files to autoprefixer to add vendor prefixes
        .pipe(autoprefixer())
        //3. where do i want to save my compiled css file
        .pipe(dest(path.srcCSSdir))
        //4. stream changes to all browsers
        .pipe(browserSync.stream());
}

function js() {
    return src([
        "node_modules/bootstrap/dist/js/bootstrap.min.js",
        "node_modules/gsap/dist/gsap.min.js",
        "node_modules/jquery/dist/jquery.min.js"])
        .pipe(dest(path.srcJSdir))
        .pipe(browserSync.stream());
}

// Static Server + watching scss, js and html files
function serve() {

    browserSync.init({
        server: "./src"
    });

    watch(path.srcSCSSfiles, transpileCSS);
    watch(path.srcJSfiles).on("change", browserSync.reload);
    watch(path.srcHTMLfiles).on("change", browserSync.reload);
};


/* 
-------- 
    DISTRIBUTE tasks
    Run: gulp dist
-------- 
*/


// Move HTML files from src to dist
function moveHTML() {
    return src(path.srcHTMLfiles)
        .pipe(dest(path.dist))
}

// Move CSS files from src to dist
function moveCSS() {
    return src(path.srcCSSfiles)
        .pipe(concat('main.min.css'))
        .pipe(csso())
        .pipe(dest(path.distCSSdir))
}

// Move JS files from src to dist
function moveJS() {
    return src(path.srcJSfiles)
        .pipe(uglify())
        .pipe(dest(path.distJSdir))
}

exports.default = series(parallel(transpileCSS, js), serve);
exports.dist = parallel(moveHTML, moveCSS, moveJS);