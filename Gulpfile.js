'use strict';

var projectname = 'hyperbolic-tiling',
  template_path = '',
  scss_path = template_path + 'scss/**/*.scss',
  es2015_path = template_path + 'es2015/',
  styles_path = template_path + 'styles/',
  scripts_path = template_path + 'scripts/',
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  autoprefixer = require('gulp-autoprefixer'),
  rollup = require('gulp-rollup'),
  babel = require('rollup-plugin-babel'),
  livereload = require('gulp-livereload');

//Put all css/scss tasks here
gulp.task('css', function() {
  return gulp.src(scss_path)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 3 version', 'ie 9'],
      cascade: true,
    }))
    .pipe(gulp.dest(styles_path))
    .pipe(livereload());;
});

//Put all javascript tasks here
gulp.task('js', function() {
  gulp.src(es2015_path + 'main.js', {
    read: false
  })
  .pipe(rollup({
    plugins: [
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['es2015-loose-rollup', 'react'],
        //plugins: ['transform-class-properties'],
      })
    ]
  })
  .on('error', console.log)
  )
  .pipe(gulp.dest(scripts_path))
  .pipe(livereload());
});

gulp.task('reload', function() {
  gulp.src('./*.html', { read: false })
  .pipe(livereload());
});

//default task
gulp.task('default', ['css', 'js'], function() {
  livereload.listen();
  gulp.watch(scss_path, ['css']);
  gulp.watch(es2015_path + '/**/*.js', ['js']);
  gulp.watch(es2015_path + '/**/*.jsx', ['js']);
  gulp.watch('**/*.html', ['reload']);
});
