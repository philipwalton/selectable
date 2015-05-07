import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import rename from 'gulp-rename';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';


gulp.task('javascript', function() {
  return browserify('./index.js', {standalone: 'Selectable'})
      .transform(babelify)
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
