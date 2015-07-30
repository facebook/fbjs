var assign = require('object-assign');
var gulp = require('gulp');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var del = require('del');
var runSequence = require('run-sequence');

var babelPluginDEV = require('./scripts/babel/dev-expression');
var babelDefaultOptions = require('./scripts/babel/default-options');
var gulpModuleMap = require('./scripts/gulp/module-map.js');

var paths = {
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js'
  ],
  lib: 'lib',
  flowInclude: 'flow/include'
};

var babelOpts = assign({}, babelDefaultOptions, {
  plugins: babelDefaultOptions.plugins.concat([
    babelPluginDEV
  ])
});

var moduleMapOpts = {
  moduleMapFile: './module-map.json',
  prefix: 'fbjs/lib/'
};

gulp.task('clean', function(cb) {
  del([paths.lib, paths.flowInclude], cb);
});

gulp.task('lib', function() {
  return gulp
    .src(paths.src)
    .pipe(gulpModuleMap(moduleMapOpts))
    .pipe(babel(babelOpts))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('flow', function() {
  return gulp
    .src(paths.src)
    .pipe(flatten())
    .pipe(gulp.dest(paths.flowInclude));
})

gulp.task('watch', function() {
  gulp.watch(paths.src, ['lib', 'flow']);
});

gulp.task('build', function(cb) {
  runSequence('clean', ['lib', 'flow'], cb);
});

gulp.task('default', ['build']);
