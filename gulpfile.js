var gulp = require('gulp')

/**
 * @param {string} parameter
 */
var isParameter = function (parameter) {
  return typeof process.argv[3] !== 'undefined' && parameter.indexOf('--') !== -1
}

gulp.task('images', function () {
  var imagemin = require('gulp-imagemin')
  var imageminMozjpeg = require('imagemin-mozjpeg')

  gulp.src('src/media/**/*')
    .pipe(imagemin([
      imageminMozjpeg({quality: 90})
    ]))
    .pipe(gulp.dest('web/assets/media'))
})

gulp.task('hbs', function () {
  let env = 'live'
  if (isParameter(process.argv[3]) && process.argv[3].indexOf('local') !== -1) {
    env = 'local'
  }

  var handlebars = require('gulp-compile-handlebars')
  var hbsBlog = require('hbs-blog')
  var pageConfig = require('./src/config_' + env + '.json')

  var localHelper = {
    getVersion: require('./src/helper/getVersion'),
    getUrl: require('./src/helper/getUrl'),
    shopList: require('./src/helper/shopList'),
    formatNumber: require('./src/helper/formatNumber'),
    list: require('./src/helper/list')
  }

  var options = {
    ignorePartials: true,
    batch: ['./src/partials'],
    helpers: Object.assign(
        {},
        localHelper,
        hbsBlog.helper
    )
  }

  return gulp.src('./src/**/*.html')
    .pipe(hbsBlog.document.gulp.load())
    .pipe(handlebars(pageConfig, options))
    .pipe(hbsBlog.document.gulp.remove())
    .pipe(gulp.dest('web'))
})

gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('web/assets/js'))
})

gulp.task('css', function () {
  var postcss = require('gulp-postcss')
  var sourcemaps = require('gulp-sourcemaps')
  var atImport = require('postcss-import')
  var cssnano = require('cssnano')

  var cssSrc = [
    './src/css/styles.css',
    './src/css/specific.css'
  ]

  return gulp.src(cssSrc)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      atImport({
        path: ['./node_modules', './src/css']
      }),
      require('precss'),
      require('autoprefixer'),
      cssnano()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/assets/css'))
})

gulp.task('default', ['hbs', 'css', 'js'])
gulp.task('build', ['hbs', 'css', 'js', 'images'])
gulp.task('watch', function () {
  return gulp.watch('./src/**/*', ['hbs', 'css', 'js'])
})
