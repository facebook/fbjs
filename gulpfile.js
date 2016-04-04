var gulp = require('gulp');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var rename = require('gulp-rename');
var del = require('del');
var mergeStream = require('merge-stream');
var runSequence = require('run-sequence');

var babelDefaultOptions = require('fbjs-scripts/babel-6/default-options');
var babelPluginDEV = require('fbjs-scripts/babel-6/dev-expression');
var babelPluginModules = require('fbjs-scripts/babel-6/rewrite-modules');
var gulpModuleMap = require('fbjs-scripts/gulp/module-map');
var gulpStripProvidesModule = require('fbjs-scripts/gulp/strip-provides-module');
var gulpCheckDependencies = require('fbjs-scripts/gulp/check-dependencies');
var thirdPartyModuleMap = require('fbjs-scripts/third-party-module-map.json');

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
    moduleOpts: {
      prefix: '../',
    },
  },
};

var moduleMapOpts = {
  moduleMapFile: './module-map.json',
  prefix: 'fbjs/lib/',
};

gulp.task('clean', function() {
  return del([paths.lib.dest, paths.mocks.dest]);
});

gulp.task('lib', function() {
  var libTask = gulp
    .src(paths.lib.src)
    .pipe(gulpModuleMap(moduleMapOpts))
    .pipe(gulpStripProvidesModule())
    .pipe(babel(babelDefaultOptions({
      plugins: [babelPluginDEV],
    })))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib.dest));

  var mockTask = gulp
    .src(paths.mocks.src)
    .pipe(babel(babelDefaultOptions({
      plugins: [babelPluginDEV],
      moduleOpts: paths.mocks.moduleOpts,
    })))
    .pipe(flatten())
    .pipe(gulp.dest(paths.mocks.dest));

  return mergeStream(libTask, mockTask);
});

gulp.task('flow', function() {
  return gulp
    .src(paths.lib.src)
    .pipe(gulpModuleMap(moduleMapOpts))
    .pipe(babel({
      plugins: [
        "syntax-flow",
        "syntax-trailing-function-commas",
        "syntax-object-rest-spread",
        [babelPluginModules, {map: thirdPartyModuleMap}]
      ]
    }))
    .pipe(flatten())
    .pipe(rename({extname: '.js.flow'}))
    .pipe(gulp.dest(paths.lib.dest));
});

gulp.task('check-dependencies', function() {
  return gulp
    .src('package.json')
    .pipe(gulpCheckDependencies());
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['lib', 'flow']);
});

gulp.task('build', function(cb) {
  runSequence('check-dependencies', 'clean', ['lib', 'flow'], cb);
});

gulp.task('default', ['build']);
