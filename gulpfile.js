// PACKAGE CONNECTION
const autoprefixer  = require('gulp-autoprefixer')
const browserSync   = require('browser-sync').create()
const sourcemaps    = require('gulp-sourcemaps');
const plumber       = require('gulp-plumber')
const notify        = require('gulp-notify')
const less          = require('gulp-less')
const gulp          = require('gulp')
const scss          = require('gulp-sass')
const pug           = require('gulp-pug')
const del           = require('del')
const runSequence   = require('run-sequence')
const imagemin      = require('gulp-imagemin')

 // TASKS FOR GULP
 gulp.task('clean:build', function () {
    return del('./build')
})

gulp.task('scss', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Sass Styles Error',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
})

gulp.task('pug', function buildHTML() {
    return gulp.src('src/pug/pages/**/*.pug')
          .pipe(plumber({
              errorHandler: notify.onError( function(err){
                  return {
                      title: 'Pug Error',
                      message: err.message
                  }
              })
          }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream())
})

gulp.task('copy:js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream())
})

gulp.task('copy:img', function () {
    return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.stream())
})

gulp.task('server', function(){
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    })

    gulp.watch('src/pug/**/*',  ['pug'])
    gulp.watch('src/scss/**/*', ['scss'])
    gulp.watch('src/js/**/*',   ['copy:js'])
    gulp.watch('src/img/**/*',  ['copy:img'])
})

gulp.task('default', function(callback){
    runSequence(
        'clean:build',
        ['scss', 'pug', 'copy:js', 'copy:img'],
        'server',
        callback
    )
})
