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

var PLUGIN_NAME = 'header';
var YEAR = '2015';

var HEADERS = {
  license: function(pkg, version) {
    return [
      '/**',
      ' * ' + pkg + ' v' + version,
      ' *',
      ' * Copyright 2013-' + YEAR + ', Facebook, Inc.',
      ' * All rights reserved.',
      ' *',
      ' * This source code is licensed under the BSD-style license found in the',
      ' * LICENSE file in the root directory of this source tree. An additional grant',
      ' * of patent rights can be found in the PATENTS file in the same directory.',
      ' *',
      ' */',
      ''
    ].join('\n');
  },

  simple: function(pkg, version) {
    return [
      '/**',
      ' * ' + pkg + ' v' + version,
      ' */',
      ''
    ].join('\n');
  }
};

module.exports = function(opts) {
  if (!opts || !('package' in opts && 'version' in opts && opts.type in HEADERS)) {
    throw new gutil.PluginError(
      PLUGIN_NAME,
      'Missing options. Ensure you pass an object with ' +
      '`package`, `version`, and `type`'
    );
  }

  var header = HEADERS[opts.type](opts.package, opts.version);

  function transform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    var output;

    if (file.isStream()) {
      output = through();
      output.write(header);
      file.contents.pipe(output);
      file.contents.on('error', this.emit.bind(this, 'error'));
    } else {
      output = new Buffer(header + file.contents);
    }

    file.contents = output;
    this.push(file);
    cb();
  }

  return through.obj(transform);
};
