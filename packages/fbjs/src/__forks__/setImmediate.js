/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule setImmediate
 */

'use strict';

// setimmediate adds setImmediate to the global. We want to make sure we export
// the actual function.
require('setimmediate')

var _global = typeof self === 'undefined'
  ? typeof global === 'undefined'
    ? this || globalThis // fallback, which is also used by setimmediate itself
    : global // the global object in node
  : self; // the global object in browsers/webworkers

module.exports = _global.setImmediate.bind(_global); // bind to keep the context
