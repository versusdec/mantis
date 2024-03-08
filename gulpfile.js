const gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  clean = require('gulp-clean'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  autoprefixer = require('autoprefixer'),
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps')

gulp.task('clear', ()=> gulp.src('./dist', {read: false, allowEmpty: true}).pipe(clean()))

gulp.task('html', () => {
  return gulp.src(['./src/**/*.html'], {
    base: './src/',
    since: gulp.lastRun('html')
  })
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp.src('./src/assets/**/*.{css,scss}', {since: gulp.lastRun('sass')})
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer({})]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/assets/'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src(['./src/assets/**/*.js'], {since: gulp.lastRun('js')})
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('copyAssets', () => {
  return gulp
    .src(['./src/assets/**/*', '!./src/assets/{js,css}/**'], {nodir: true})
    .pipe(gulp.dest('./dist/assets'))
});

gulp.task('copyFavicon', () => {
  return gulp
    .src('./src/favicon.ico', {nodir: true})
    .pipe(gulp.dest('./dist/'))
});

gulp.task('assets', gulp.series('copyAssets', 'copyFavicon'));

gulp.task('build', gulp.series('clear', 'html', 'sass', 'js', 'assets'));

gulp.task('dev', gulp.series('html', 'sass', 'js', 'assets'));

gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: ['dist']
    },
    port: 3000,
    open: false
  });
});

gulp.task('watch', () => {
  
  const watch = [
    './src/**/*.html',
    './src/assets/css/**/*.{css,scss}',
    './src/assets/js/**/*.js',
  ];
  
  gulp.watch(['./src/assets/**/*', '!./src/assets/{js,css}/**'], gulp.series('assets')).on('change', browserSync.reload);
  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
