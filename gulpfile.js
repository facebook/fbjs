var assign = require('object-assign');
var gulp = require('gulp');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var rename = require('gulp-rename');
var del = require('del');
var mergeStream = require('merge-stream');
var runSequence = require('run-sequence');

var babelPluginDEV = require('fbjs-scripts/babel/dev-expression');
var babelDefaultOptions = require('fbjs-scripts/babel/default-options');
var gulpModuleMap = require('fbjs-scripts/gulp/module-map');
var gulpStripProvidesModule = require('fbjs-scripts/gulp/strip-provides-module');

var paths = {
  lib: {
    src: [
      'src/**/*.js',
      '!src/**/__tests__/**/*.js',
      '!src/**/__mocks__/**/*.js',
    ],
    dest: 'lib',
  },
  mocks: {
    src: [
      'src/**/__mocks__/**/*.js',
    ],
    dest: 'lib/__mocks__',
    babelOpts: {
      _modulePrefix: '../',
    },
  },
};

var babelOpts = assign({}, babelDefaultOptions, {
  plugins: babelDefaultOptions.plugins.concat([
    babelPluginDEV,
  ]),
});

var moduleMapOpts = {
  moduleMapFile: './module-map.json',
  prefix: 'fbjs/lib/',
};

gulp.task('clean', function(cb) {
  del([paths.lib.dest, paths.mocks.dest], cb);
});

gulp.task('lib', function() {
  var libTask = gulp
    .src(paths.lib.src)
    .pipe(gulpModuleMap(moduleMapOpts))
    .pipe(gulpStripProvidesModule())
    .pipe(babel(babelOpts))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib.dest));

  var mockTask = gulp
    .src(paths.mocks.src)
    .pipe(babel(assign({}, babelOpts, paths.mocks.babelOpts)))
    .pipe(flatten())
    .pipe(gulp.dest(paths.mocks.dest));

  return mergeStream(libTask, mockTask);
});

gulp.task('flow', function() {
  return gulp
    .src(paths.lib.src)
    .pipe(gulpStripProvidesModule())
    .pipe(flatten())
    .pipe(rename({extname: '.js.flow'}))
    .pipe(gulp.dest(paths.lib.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['lib', 'flow']);
});

gulp.task('build', function(cb) {
  runSequence('clean', ['lib', 'flow'], cb);
});

gulp.task('default', ['build']);
