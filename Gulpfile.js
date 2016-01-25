'use strict';

var projectname = 'canvas-test',
  template_path = '',
  scss_path = template_path + 'scss/**/*.scss',
  es2015_path = template_path + 'es2015/',
  styles_path = template_path + 'styles/',
  scripts_path = template_path + 'scripts/',
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  autoprefixer = require('gulp-autoprefixer'),
  babelify = require('babelify'),
  through2 = require('through2'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  livereload = require('gulp-livereload');

//Put all css/scss tasks here
gulp.task('css', function() {
  return gulp.src(scss_path)
    .pipe(sass()) //.on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 version', 'ie 9'],
      cascade: true,
    }))
    .pipe(gulp.dest(styles_path))
    .pipe(livereload());;
});

//Put all javascript tasks here
gulp.task('js', function() {
  return browserify({
    entries: es2015_path + 'main.js',
    extensions: ['.js'],
    debug: true
  })
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(scripts_path))
    .pipe(livereload());
});

//default task
gulp.task('default', ['css', 'js'], function() {
  livereload.listen();
  gulp.watch(scss_path, ['css']);
  gulp.watch(es2015_path + '/**/*.js', ['js']);
});
