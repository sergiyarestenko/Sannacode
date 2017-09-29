'use strict';

const   config = require('./gulpconfig.js'),
        gulp = require('gulp'),
        rigger = require('gulp-rigger'),
        sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        cleancss = require('gulp-clean-css'),
        uglify = require('gulp-uglify'),
        connect = require('gulp-connect'),
        browserSync = require('browser-sync').create();



gulp.task('css',function() {
    return gulp.src(config.paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.paths.build +'/stylesheets'))
});

gulp.task('js',function(){
    return gulp.src(config.paths.js)
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.build + '/js'))
});


//html task
gulp.task('html',function(){
    return gulp.src(config.paths.mainHtml)
        .pipe(rigger())
        .pipe(gulp.dest(config.paths.build))
});

//server
gulp.task('server', function(){
    connect.server({root: config.paths.build, port: config.port});
});

//Gulp serve task - initializes browser synchronization
gulp.task('serve', ['server'], function() {
    browserSync.init(null, config.browserSync);
});


//watchers
gulp.task('watch', function(){
    gulp.watch(config.paths.js, ['js']);
    gulp.watch(config.paths.sass, ['css']);
    gulp.watch(config.paths.mainHtml, ['html']);
});


gulp.task('default', ['css', 'js', 'html', 'serve', 'watch']);
