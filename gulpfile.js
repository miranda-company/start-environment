// Task runner
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();

//Compile scss to css
function style() {
    return (
        gulp
            //1. where are my scss files
            .src(["node_modules/bootstrap/scss/bootstrap.scss", "./src/scss/*.scss"])
            //2. pass the file through sass compiler
            .pipe(sass().on("error", sass.logError))
            //3. pass files to autoprefixer to add vendor prefixes
            .pipe(autoprefixer())
            //4. where do i want to save my compiled css file
            .pipe(gulp.dest("./src/css"))
            //5. stream changes to all browsers
            .pipe(browserSync.stream())
    );
}

function js() {
    return gulp
        .src([
            "node_modules/bootstrap/dist/js/bootstrap.min.js",
            "node_modules/gsap/dist/gsap.min.js",
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/popper.js/dist/popper.min.js",
        ])
        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./src",
        },
    });
    gulp.watch("./src/scss/*.scss", style);
    gulp.watch("./src/*.html").on("change", browserSync.reload);
    gulp.watch("./src/js/*.js").on("change", browserSync.reload);
}

function packCSS() {
    return (
        gulp
            //1. Minify css with CSSO
            .src("./src/css/*.css")
            .pipe(csso())
            .pipe(gulp.dest("./dist/css"))
    );
}

function packJS() {
    return (
        gulp
            //1. Minify JS with Uglify
            .src("./src/js/*.js")
            .pipe(uglify())
            .pipe(gulp.dest("./dist/js"))
    );
}

// Default task
function defaultTask() {
    style();
    js();
    watch();
    packCSS();
    packJS();
}

exports.style = style;
exports.js = js;
exports.watch = watch;
exports.default = defaultTask;
