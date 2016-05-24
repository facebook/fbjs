/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var gutil = require('gulp-util');
var path = require('path');
var semver = require('semver');
var spawn = require('cross-spawn');
var through = require('through2');

var colors = gutil.colors;

var PLUGIN_NAME = 'check-dependencies';

module.exports = function(opts) {
  function read(file, enc, cb) {
    var cwd = path.dirname(file.path);
    var pkgData = JSON.parse(file.contents.toString());
    var outdated = spawn(
      'npm',
      ['outdated', '--json', '--long'],
      { cwd: cwd }
    );
    var data = '';

    outdated.stdout.on('data', function(chunk) {
      data += chunk.toString();
    });

    outdated.on('exit', function(code) {
      if (code !== 0) {
        cb(new gutil.PluginError(PLUGIN_NAME, 'npm broke'));
      }

      var outdatedData = JSON.parse(data);
      var failures = [];
      Object.keys(outdatedData).forEach(function(name) {
        var current = outdatedData[name].current;
        var type = outdatedData[name].type;
        var requested = pkgData[type][name];
        if (!requested.startsWith('file:') && !semver.satisfies(current, requested)) {
          // Definitely wrong, so we should error
          failures.push({name, current, requested});
        }
      });

      if (failures.length) {
        failures.forEach((failure) => {
          gutil.log(
            `${colors.bold(failure.name)} is outdated ` +
            `(${colors.red(failure.current)} does not satisfy ` +
            `${colors.yellow(failure.requested)})`
          );
        });
        var msg =
          'Some of your dependencies are outdated. Please run ' +
          `${colors.bold('npm update')} to ensure you are up to date.`;
        cb(new gutil.PluginError(PLUGIN_NAME, msg));
        return;
      }

      cb();
    });
  }

  return through.obj(read);
};
