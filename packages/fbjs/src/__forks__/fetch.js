/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule fetch
 */

'use strict';

// Add a universal fetch polyfill (React Native compatible)
require('cross-fetch/polyfill')

// Make it importable
module.exports = global.fetch.bind(global);
