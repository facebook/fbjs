/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');

function buildCacheKey(files, base) {
  return files.reduce(
    (src, fileName) => src + fs.readFileSync(fileName),
    base
  );
}

module.exports = files => {
  const presetVersion = require('../package').dependencies['babel-preset-fbjs'];
  const cacheKey = buildCacheKey(files, presetVersion);
  return (src, file, configString) => crypto.createHash('md5')
    .update(cacheKey)
    .update(src + file + configString)
    .digest('hex');
};
