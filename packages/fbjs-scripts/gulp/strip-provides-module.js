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
var through = require('through2');
var PM_REGEXP = require('./shared/provides-module').regexp;

module.exports = function(opts) {
  function transform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('module-map', 'Streaming not supported'));
      return;
    }

    // Get the @providesModule piece out of the file and save that.
    var contents = file.contents.toString().replace(PM_REGEXP, '');
    file.contents = new Buffer(contents);
    this.push(file);
    cb();
  }

  return through.obj(transform);
};
