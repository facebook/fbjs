/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var PluginError = require('plugin-error');
var colors = require('ansi-colors');
var fancyLog = require('fancy-log');
var path = require('path');
var semver = require('semver');
var spawn = require('cross-spawn');
var through = require('through2');

var PLUGIN_NAME = 'check-dependencies';

module.exports = function(opts) {
  function read(file, enc, cb) {
    var cwd = path.dirname(file.path);
    var pkgData = JSON.parse(file.contents.toString());
    var outdated = spawn(
      'yarn',
      ['outdated', '--json'],
      { cwd: cwd }
    );
    var input = '';

    outdated.stdout.on('data', function(chunk) {
      input += chunk.toString();
    });

    outdated.on('exit', function(code) {
      try {
        // Parse the yarn outdated format (http://jsonlines.org/)
        var data = input
          .split('\n')
          .filter(Boolean)
          .map(d => JSON.parse(d))
          .filter(j => j.type === 'table')[0].data;
      } catch (e) {
        console.log('error', e)
        cb(new PluginError(PLUGIN_NAME, 'npm broke'));
      }

      // Convert ["Package", "Current",...] to {"Package": 0, ...}
      const reverseKeys = (obj, key, idx) => ({...obj, [key]: idx});
      const name2Idx = data.head.reduce(reverseKeys, {});
      var failures = [];
      data.body.forEach(function(row) {
        var name = row[name2Idx['Package']];
        var current = row[name2Idx['Current']];
        var type = row[name2Idx['Package Type']];
        var requested = pkgData[type][name];

        if (!requested) {
          fancyLog('Found extraneous outdated dependency. Consider running `npm prune`');
          return;
        }

        if (!requested.startsWith('file:') && !semver.satisfies(current, requested)) {
          // Definitely wrong, so we should error
          failures.push({name, current, requested});
        }
      });

      if (failures.length) {
        failures.forEach((failure) => {
          fancyLog(
            `${colors.bold(failure.name)} is outdated ` +
            `(${colors.red(failure.current)} does not satisfy ` +
            `${colors.yellow(failure.requested)})`
          );
        });
        var msg =
          'Some of your dependencies are outdated. Please run ' +
          `${colors.bold('npm update')} to ensure you are up to date.`;
        cb(new PluginError(PLUGIN_NAME, msg));
        return;
      }

      cb();
    });
  }

  return through.obj(read);
};
