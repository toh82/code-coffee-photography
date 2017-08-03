var gulp = require('gulp')

gulp.task('hbs', function () {
  var handlebars = require('gulp-compile-handlebars')
  var hbsBlog = require('hbs-blog')
  var pageConfig = require('./src/config.json')

  var localHelper = {
    getUrl: require('./src/helper/getUrl')
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
  var uglify = require('gulp-uglify')
  var concat = require('gulp-concat')

  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('script.js'))
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
gulp.task('watch', function () {
  return gulp.watch('./src/*', ['hbs', 'css', 'js'])
})
