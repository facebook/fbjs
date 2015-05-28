var gulp = require('gulp');
var babel = require('gulp-babel');
var babelCore = require('babel');
var flatten = require('gulp-flatten');
var del = require('del');
var runSequence = require('run-sequence');

var babelPluginDEV = require('./scripts/babel/dev-expression');
var babelPluginRequires = require('./scripts/babel/rewrite-requires');

var paths = {
  src: ['src/**/*.js', '!src/**/__tests__/**/*.js'],
  lib: 'lib'
};

var babelOpts = {
  nonStandard: true,
  optional: [
    'es7.trailingFunctionCommas'
  ],
  plugins: [babelPluginDEV, babelPluginRequires],
  // NOTE: we don't need this here but it's available as an example for consumers
  _moduleMap: {
    // 'everySet': 'lodash'
  }
};

gulp.task('clean', function(cb) {
  del(['lib/'], cb);
});

gulp.task('lib', function() {
  return gulp
    .src(paths.src)
    .pipe(babel(babelOpts))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['lib']);
});

gulp.task('build', function(cb) {
  runSequence('clean', 'lib', cb);
});

gulp.task('default', ['lib']);
