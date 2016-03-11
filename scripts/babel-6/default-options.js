/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const assign = require('object-assign');

module.exports = function(options) {
  return {
    presets: [
      require('babel-preset-fbjs/configure')({
        rewriteModules: assign({
          map: require('../third-party-module-map'),
        }, options.moduleOpts),
      }),
    ],
    plugins: options.plugins || [],
  };
};
