/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const stream = require('stream');
const gutil = require('gulp-util');

const PLUGIN_NAME = 'header';

const HEADERS = {
  license(pkg, version, startYear) {
    return (
`/**
 * ${pkg} v${version}
 *
 * Copyright ${startYear}-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
`);
  },

  simple(pkg, version) {
    return (
`/**
 * ${pkg} v${version}
 */
`);
  },
};

class HeaderStream extends stream.Transform {
  constructor(opts) {
    super({objectMode: true, highWaterMark: 16});
    this._header = HEADERS[opts.type](opts.pkg, opts.version, opts.startYear);
  }

  _transform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    let output;
    if (file.isStream()) {
      output = stream.PassThrough();
      output.write(this._header);
      file.contents.pipe(output);
      file.contents.on('error', err => { this.emit('error', err); });
    } else {
      output = new Buffer(this._header + file.contents);
    }

    file.contents = output;
    this.push(file);
    cb();
  }
}

module.exports = function(opts) {
  if (!opts || !('pkg' in opts && 'version' in opts && opts.type in HEADERS)) {
    throw new gutil.PluginError(
      PLUGIN_NAME,
      'Missing options. Ensure you pass an object with ' +
      '`pkg`, `version`, and `type`'
    );
  }

  if (opts.type === 'license' && !('startYear' in opts)) {
    throw new gutil.PluginError(
      PLUGIN_NAME,
      'Missing options. `startYear` is required when using the "license" type'
    );
  }

  return new HeaderStream(opts);
};
