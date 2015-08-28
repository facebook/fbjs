/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var assign = require('object-assign');
var babel = require('babel');
var babelDefaultOptions = require('../babel/default-options');
var createCacheKeyFunction = require('./createCacheKeyFunction');

module.exports = {
  process: function(src, filename) {
    return babel.transform(src, assign(
      {},
      babelDefaultOptions,
      {
        filename: filename,
        retainLines: true
      }
    )).code;
  },

  // Generate a cache key that is based on the module and transform data.
  getCacheKey: createCacheKeyFunction([__filename])
};
