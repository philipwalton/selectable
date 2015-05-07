var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');


gulp.task('javascript', function() {
  return browserify('./index.js', {standalone: 'Selectable'})
      .bundle()
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
