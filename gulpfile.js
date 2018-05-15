var gulp = require('gulp');
var include = require('gulp-include');
var plumber = require('gulp-plumber');
var wait = require('gulp-wait');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var path = require('path');

var build = function(src) {
    var b = browserify({ entries: src });

    return b.bundle()
        .on('error', console.log)
        .pipe(source(path.basename(src)))
        .pipe(buffer())
        .pipe(include())
        //.pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify({ mangle: false }))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
};

gulp.task('build', function() {
    build('src/javascripts/zeditDocs.js');
    build('src/javascripts/vendor.js');
});

gulp.task('watch', function() {
    gulp.watch('src/javascripts/**/*.js', ['build']);
    gulp.watch('src/stylesheets/**/*.scss', ['sass']);
});

gulp.task('sass', function() {
    return gulp.src('src/stylesheets/themes/*')
        .pipe(plumber())
        .pipe(wait(250))
        .pipe(sass())
        .pipe(gulp.dest('themes'));
});

gulp.task('default', ['build', 'sass', 'watch']);