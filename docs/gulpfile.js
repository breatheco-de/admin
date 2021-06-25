const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify-es').default;
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const del = require('del');
const runSequence = require('run-sequence');
const wait = require('gulp-wait');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');

gulp.task('sass', () => gulp
  .src('assets/sass/**/*.scss')
  .pipe(wait(700))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(gulp.dest('assets/css'))
  .pipe(cssnano({ zindex: false }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('assets/css')));

gulp.task('compilejs', () => gulp
  .src('assets/js/main/*.js')
  .pipe(wait(400))
  .pipe(babel({ presets: ['es2015', 'stage-3'] }))
  .pipe(gulp.dest('assets/js/es5'))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('assets/js/es5')));

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
    startPath: 'index.html',
  });
});
function browserSyncInit(done) {
  browserSync.init({
    server: {
      // baseDir: '/'
    },
    startPath: 'index.html',
  });
  done();
}
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

gulp.task('minifycss', () => gulp.src('assets/css/**/*')
  .pipe(gulpIf('*.css', cssnano({ zindex: false })))
  .pipe(gulp.dest('assets/css')));

function watchFiles() {
  gulp.watch('assets/sass/**/*.scss', gulp.series('sass', browserSyncReload));
  gulp.watch('assets/js/main/*.js', gulp.series('compilejs', browserSyncReload));
  gulp.watch('*.html', gulp.parallel(browserSyncReload));
}

gulp.task('default', gulp.series('sass', 'compilejs', browserSyncInit, watchFiles));
