/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const del = require('del');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const mergeStream = require('merge-stream');
const rename = require('gulp-rename');

const fbjsConfigurePreset = require('babel-preset-fbjs/configure');
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
    presetOptions: {
      stripDEV: true,
      rewriteModules: {
        map: require('fbjs-scripts/third-party-module-map'),
      },
    },
  },
  mocks: {
    src: [
      'src/**/__mocks__/**/*.js',
    ],
    dest: 'lib/__mocks__',
    presetOptions: {
      stripDEV: true,
      rewriteModules: {
        map: require('fbjs-scripts/third-party-module-map'),
        prefix: '../',
      },
    },
  },
};

const rewriteOptions = {
  moduleMapFile: './module-map.json',
  prefix: 'fbjs/lib/',
};

function clean(cb) {
  return del([paths.lib.dest, paths.mocks.dest]);
}

function lib() {
  const libTask = gulp
    .src(paths.lib.src)
    .pipe(gulpModuleMap(rewriteOptions))
    .pipe(gulpStripProvidesModule())
    .pipe(gulpBabel(fbjsConfigurePreset(paths.lib.presetOptions)))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib.dest));

  const mockTask = gulp
    .src(paths.mocks.src)
    .pipe(gulpBabel(fbjsConfigurePreset(paths.mocks.presetOptions)))
    .pipe(flatten())
    .pipe(gulp.dest(paths.mocks.dest));

  return mergeStream(libTask, mockTask);
}

function flow() {
  return gulp
    .src(paths.lib.src)
    .pipe(gulpModuleMap(rewriteOptions))
    .pipe(gulpBabel({
      presets: [
        fbjsConfigurePreset({
          autoImport: false,
          target: 'flow',
          rewriteModules: {
            map: require('fbjs-scripts/third-party-module-map'),
          },
        }),
      ],
    }))
    .pipe(flatten())
    .pipe(rename({extname: '.js.flow'}))
    .pipe(gulp.dest(paths.lib.dest));
}

function checkDependencies() {
  return gulp
    .src('package.json')
    .pipe(gulpCheckDependencies());
};

const libAndFlow = gulp.parallel(lib, flow);

function watch() {
  gulp.watch(paths.lib.src, libAndFlow);
};

const build = gulp.series(checkDependencies, clean, libAndFlow);

exports.clean = clean;
exports.flow = flow;
exports['check-dependencies'] = checkDependencies;
exports.watch = watch;
exports.build = build;
exports.default = build;
