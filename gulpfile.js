var gulp      = require('gulp'),
    exec      = require('gulp-exec'),
    mocha     = require('gulp-mocha'),
    istanbul  = require('gulp-istanbul'),
    gutil     = require('gulp-util');

gulp.task('mocha', function () {
  return gulp.src(['test/**/*.js'], {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .on('error', gutil.log);
});

gulp.task('coverage', function () {
  return gulp.src(['lib/*.js', 'lib/**/*.js'])
    .pipe(istanbul())
    .on('end', function () {
      gulp.src(['test/**/*.js'], {read: false})
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('error', gutil.log);
    })
    .on('error', gutil.log);
});

gulp.task('coveralls', ['coverage'], function () {
  return gulp.src(['coverage/lcov.info'])
    .pipe(exec('./node_modules/.bin/coveralls < ./coverage/lcov.info'))
    .on('error', gutil.log);
});

gulp.task('ci', ['coveralls']);

gulp.task('watch', function () {
  gulp.watch('coverage/*', gutil.log);
});
