/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
  return (src, file, configString, options) => {
    return crypto
      .createHash('md5')
      .update(cacheKey)
      .update(src + file + configString)
      .update(options && options.instrument ? 'instrument' : '')
      .digest('hex');
  };
};
