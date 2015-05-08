var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');


function streamError(err) {
  gutil.beep();
  gutil.log(err);
}


gulp.task('javascript', function() {
  browserify('.', {standalone: 'Selectable'})
      .bundle()
      .on('error', streamError)
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename('selectable.min.js'))
      .pipe(gulp.dest('./build'));
});


gulp.task('watch', ['javascript'], function() {
  gulp.watch('index.js', ['javascript']);
});


gulp.task('default', ['javascript']);
