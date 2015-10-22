// --------------------------------------------------------------------
// CLIENT : Browserify + Babel + Jest + BrowserSync + Sass
// --------------------------------------------------------------------

'use strict';

// --------------------------------------------------------------------
// Imports

var gulp              = require('gulp'),
    util              = require('gulp-util'),
    imagemin          = require('gulp-imagemin'),
    changed           = require('gulp-changed'),
    size              = require('gulp-size'),
    sass              = require('gulp-sass'),
    sourcemaps        = require('gulp-sourcemaps'),
    jest              = require('gulp-jest');

var source            = require('vinyl-source-stream'),
    buffer            = require('vinyl-buffer'),
    runSequence       = require('run-sequence'),
    browserify        = require('browserify'),
    babelify          = require('babelify'),
    envify            = require('envify'),
    watchify          = require('watchify'),
    browserSync       = require('browser-sync').create(),
    del               = require('del');

gulp.task('default', ['watch']);

gulp.task('clean', del.bind(null, ['dist']));

var taskStatic = function() {
  return gulp.src('./assets/**/*.html')
    .pipe(changed('./dist/**/*.{html}'))
    .pipe(size({title: 'static'}))
    .pipe(gulp.dest('./dist'));
};

gulp.task('static', taskStatic);
gulp.task('static-watch', function(){
  return taskStatic().pipe(browserSync.stream({match: "**/*.html"}));
});

var taskImages = function() {
  return gulp.src('./assets/**/*.{gif,jpg,png,svg}')
    .pipe(changed('dist/**/*.{gif,jpg,png,svg}'))
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(size({title: 'images'}));
};

gulp.task('images', taskImages);
gulp.task('images-watch', function(){
  return taskImages().pipe(browserSync.stream({match: "**/*.{gif,jpg,png,svg"}));
});

var taskStyles = function() {
  return gulp.src('./assets/main/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: ['scss']}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(size({title: 'styles'}));
};

gulp.task('styles', taskStyles);
gulp.task('styles-watch', function(){
  return taskStyles()
    .pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task('test', function () {
    return gulp.src('./test').pipe(jest({
      scriptPreprocessor: './node_modules/babel-jest',
      testFileExtensions: ['es6', 'js'],
      moduleFileExtensions: ['js', 'json', 'es6']
    }));
});

var b = watchify(browserify({
  entries: ['./assets/main/main.js'],
  extensions: ['.js', '.es6'],
  debug: true,
  cache: {},
  packageCache: {}
}));
/*b.transform(envify({
  NODE_ENV: 'development'
}));*/
b.transform(babelify);
b.on('log', util.log);

function bundle() {
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'));
}

gulp.task('bundle', bundle);

gulp.task('bundle-watch', function(){
  b.on('update', function(){
    bundle().pipe(browserSync.stream());
  });
  bundle().pipe(browserSync.stream());
});

gulp.task('serve', function() {
  browserSync.init({
    port: 8080,
    notify: false,
    logPrefix: 'BrowserSync',
    server: { baseDir: 'dist' },
    middleware: function (req, res, next) {
        var url = req.url;
        if(url.indexOf('/css/') !== 0 && 
           url.indexOf('/js/') !== 0 && 
           url.indexOf('/api/') !== 0){
          req.url = '/';
        }
        next();
    }
  });
});

gulp.task('watch', ['static', 'images', 'styles', 'test', 'bundle-watch', 'serve'], function() {
  gulp.watch('./assets/**/*.{gif,jpg,png,svg}', ['images']);
  gulp.watch('./assets/**/*.html', ['static-watch']);
  gulp.watch('./assets/**/*.{css,scss}', ['styles-watch']);
  gulp.watch('./assets/**/*.{js,es6}', ['test']);
  gulp.watch('./test/**/*.{js,es6}', ['test']);
});

gulp.task('build', ['clean'], function(cb) {
  runSequence(
    [
      'static', 
      'images', 
      'styles', 
      'test',
      'bundle'
    ], cb);
});
