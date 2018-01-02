/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var PluginError = require('plugin-error');
var through = require('through2');
var fs = require('fs');
var path = require('path');

var PM_REGEXP = require('./shared/provides-module').regexp;

var PLUGIN_NAME = 'module-map';

module.exports = function(opts) {
  // Assume file is a string for now
  if (!opts || !('moduleMapFile' in opts && 'prefix' in opts)) {
    throw new PluginError(
      PLUGIN_NAME,
      'Missing options. Ensure you pass an object with `moduleMapFile` and `prefix`'
    );
  }
  var moduleMapFile = opts.moduleMapFile;
  var prefix = opts.prefix;
  var moduleMap = {};

  function transform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('module-map', 'Streaming not supported'));
      return;
    }

    // Get the @providesModule piece of out the file and save that.
    var matches = file.contents.toString().match(PM_REGEXP);
    if (matches) {
      var name = matches[1];
      if (moduleMap.hasOwnProperty(name)) {
        this.emit(
          'error',
          new PluginError(
            PLUGIN_NAME,
            'Duplicate module found: ' + name + ' at ' + file.path + ' and ' +
              moduleMap[name]
          )
        );
      }
      moduleMap[name] = file.path;
    }
    this.push(file);
    cb();
  }

  function flush(cb) {
    // Keep it ABC order for better diffing.
    var map = Object.keys(moduleMap).sort().reduce(function(prev, curr) {
      // Rewrite path here since we don't need the full path anymore.
      prev[curr] = prefix + path.basename(moduleMap[curr], '.js');
      return prev;
    }, {});
    fs.writeFile(moduleMapFile, JSON.stringify(map, null, 2), 'utf-8', function() {
      // avoid calling cb with fs.write callback data
      cb();
    });
  }

  return through.obj(transform, flush);
};
