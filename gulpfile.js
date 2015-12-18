
'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('babelify'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    watchify = require('watchify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


function compile(watch) {
  var bundler = watchify(browserify('./app/scripts/app.js', { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./www/js'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
}
gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { 
    gulp.watch('app/scss/**/*.scss', ['sass']);
    return watch();
 });

gulp.task('sass', function () {
    gulp.src('./app/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./www/css'));
});

gulp.task('connect', function () {
  connect.server({
      root: 'www',
      port: 3598,
      livereload: true
    });
});

gulp.task('default', ['connect', 'sass', 'watch']);