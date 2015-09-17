/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

function buildCacheKey(files, base) {
  return files.reduce(function(src, fileName) {
    return src + fs.readFileSync(fileName);
  }, base);
};

var transformRoot = path.join(__dirname, '..');
var cacheKeyFiles = [
  __filename,
  path.join(transformRoot, 'babel/default-options.js'),
  path.join(transformRoot, 'babel/dev-expression.js'),
  path.join(transformRoot, 'babel/inline-requires.js'),
  path.join(transformRoot, 'babel/rewrite-modules.js'),
];

var cacheKeyBase = buildCacheKey(cacheKeyFiles, '');

module.exports = function(files) {
  var cacheKey = buildCacheKey(files, cacheKeyBase);

  return function(src, file, options, excludes) {
    return crypto.createHash('md5')
      .update(cacheKey)
      .update(JSON.stringify([src, file, options, excludes]))
      .digest('hex');
  };
};
