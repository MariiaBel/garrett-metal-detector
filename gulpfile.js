const gulp = require("gulp");
    browserSync = require('browser-sync').create(),
    del = require("del"),
    sass = require("gulp-sass"),
    postcss = require('gulp-postcss'),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    rename = require("gulp-rename"),
    babel = require("gulp-babel"),
    uglify = require('gulp-uglify'),
    imagemin = require("gulp-imagemin"),
    webp = require("gulp-webp"),
    svgmin = require("gulp-svgmin"),
    svgstore = require("gulp-svgstore"),
    plumber = require("gulp-plumber"),
    sourcemap = require("gulp-sourcemaps"),
    rollup = require("gulp-better-rollup"),
    pug = require("gulp-pug"),    
    dataG = require("gulp-data"),
    merge = require("gulp-merge-json"),
    path = require("path"),
    fs = require("fs");


// CLEAN
const clean = () => {
    return del("build");
}

//COPY just for static files such as fonts, favicons
const copy = () => {
    return gulp.src([
        "src/fonts/*.{woff2,woff}",
        "src/documents/*.pdf"
      ], {
        base: "src"
      })
      .pipe(gulp.dest("build"))
}


//DATA
// const jsonData = () => {
//     return gulp.src('src/data/*.json')
//     .pipe(merge({
//         fileName: 'data.json',
//         edit: (json, file) => {
//             let filename = path.basename(file.path, `.json`),
//                 primaryKey = `${filename}`.toUpperCase();
//                 dataFile = {};
      
//             // Set the filename as the primary key for our JSON data
//             dataFile[primaryKey] = json;

//             return dataFile;
//         }
//     }))
//     .pipe(gulp.dest('build/data'));
// }

// HTML
const html = gulp.series(
    // jsonData, 
    function() {
        return gulp.src('src/*.pug')
            // .pipe(dataG(file => JSON.parse(fs.readFileSync('build/data/data.json'))))
            .pipe(pug({pretty: '  '}))
            .pipe(gulp.dest('build/'))
            .pipe(browserSync.stream());
    }
)

// CSS
function css() {
    return gulp.src("src/sass/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({ browsers: ['last 5 versions', '> 1%', 'ie 9', 'ie 8'], cascade: false }), 
            cssnano()])
        )
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
}

// JS
function js() {
    return gulp.src('src/js/script.js')
        .pipe(sourcemap.init())
        .pipe(rollup({
            input: 'src/js/script.js'
        }, 'umd'))
        .pipe(babel())
        .pipe(uglify({ toplevel: true }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
}

// IMG
function img() {
    return gulp.src('src/img/**/*', {
            dot: true,
            ignore: 'src/img/sprite/*.svg'
        })
        .pipe(imagemin([
            imagemin.optipng({
                optimizationLevel: 3
            }),
            imagemin.mozjpeg({
                progressive: true
            }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"))
        .pipe(browserSync.stream());
}

// WEBP
const imagesToWebp = () => {
    return gulp.src("src/img/**/*.{jpg,png}")
      .pipe(webp({
        quality: 80
      }))
      .pipe(gulp.dest("build/img"))
  }

// SVG SPRITE
const sprite = () => {
    return gulp.src("src/img/sprite/*.svg")
      .pipe(
        svgmin({
          plugins: [{
            removeViewBox: false
          }]
        }))
      .pipe(svgstore())
      .pipe(rename("sprite.svg"))
      .pipe(gulp.dest("build/img"))
  }

// WATCH
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: "build"
        },
        cors: true,
        notify: false,
        ui: false,
    });
    gulp.watch(["src/**/**/*.pug","src/data/*.json"] ,  html);
    gulp.watch("src/sass/**/*.scss",  css);
    gulp.watch('src/js/**/*.js',  js);
    gulp.watch("src/img/**/*.*",  gulp.parallel(img,imagesToWebp));
    gulp.watch("src/img/*.svg",  img);
    gulp.watch("src/img/sprite/*.svg",  sprite);
}


// Build
const build = gulp.series(
    clean,
    gulp.parallel(
        css,
        js,
        html,
        copy,
        sprite,
        img,
        imagesToWebp
    )
  );

// Dev
const dev = gulp.series(
    build,
    watchFiles
  );

// TASKS
exports.dev = dev;
exports.build = build;

exports.js = js;
exports.css = css;
exports.html = html;
exports.img = img;
exports.clean = clean;
exports.watchFiles = watchFiles;
exports.imagesToWebp = imagesToWebp;
exports.sprite = sprite;