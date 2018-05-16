var gulp = require('gulp');
var include = require('gulp-include');
var plumber = require('gulp-plumber');
var wait = require('gulp-wait');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var path = require('path');

var build = function(src, minify) {
    var b = browserify({ entries: src });

    return b.bundle()
        .on('error', console.log)
        .pipe(source(path.basename(src)))
        .pipe(buffer())
        .pipe(include())
        .pipe(gulpif(minify, uglify()))
        .pipe(gulp.dest('.'));
};

gulp.task('bundle', function() {
    build('src/javascripts/app.js');
    build('src/javascripts/vendor.js');
});

gulp.task('sass', function() {
    return gulp.src('src/stylesheets/themes/*')
        .pipe(plumber())
        .pipe(wait(250))
        .pipe(sass())
        .pipe(gulp.dest('themes'));
});

gulp.task('watch', function() {
    gulp.watch('src/javascripts/**/*.js', ['build']);
    gulp.watch('src/stylesheets/**/*.scss', ['sass']);
});

gulp.task('build', ['bundle', 'sass']);
gulp.task('dev', ['bundle', 'sass', 'watch']);