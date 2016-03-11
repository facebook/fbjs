/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const del = require('del');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const mergeStream = require('merge-stream');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');

const configureBabelPreset = require('babel-preset-fbjs/configure');
const gulpModuleMap = require('fbjs-scripts/gulp/module-map');
const gulpStripProvidesModule = require('fbjs-scripts/gulp/strip-provides-module');
const gulpCheckDependencies = require('fbjs-scripts/gulp/check-dependencies');

const paths = {
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

const moduleMapOpts = {
  moduleMapFile: './module-map.json',
  prefix: 'fbjs/lib/',
};

gulp.task('clean', function() {
  return del([paths.lib.dest, paths.mocks.dest]);
});

gulp.task('lib', function() {
  const libTask = gulp
    .src(paths.lib.src)
    .pipe(gulpModuleMap(moduleMapOpts))
    .pipe(gulpStripProvidesModule())
    .pipe(gulpBabel(configureBabelPreset({stripDEV: true})))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib.dest));

  const mockTask = gulp
    .src(paths.mocks.src)
    .pipe(gulpBabel(configureBabelPreset({
      stripDEV: true,
      rewriteModules: paths.mocks.moduleOpts,
    })))
    .pipe(flatten())
    .pipe(gulp.dest(paths.mocks.dest));

  return mergeStream(libTask, mockTask);
});

gulp.task('flow', function() {
  return gulp
    .src(paths.lib.src)
    .pipe(gulpModuleMap(moduleMapOpts))
    .pipe(gulpBabel({
      presets: [
        configureBabelPreset({stripDEV: true}),
      ],
      plugins: [
        require('babel-plugin-syntax-flow'),
        require('babel-plugin-syntax-trailing-function-commas'),
        require('babel-plugin-syntax-object-rest-spread'),
      ],
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
