/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isEmpty
 */

/*eslint-disable no-unused-vars */

const invariant = require('invariant');

/**
 * Mimics empty from PHP.
 */
function isEmpty(obj) {
  invariant(
    (
      !obj ||
      (typeof Symbol !== 'undefined' && !obj[Symbol.iterator]) ||
      obj.size === undefined
    ),
    'isEmpty does not support Map or Set',
  );

  if (Array.isArray(obj)) {
    return obj.length === 0;
  } else if (typeof obj === 'object') {
    for (let i in obj) {
      return false;
    }
    return true;
  } else {
    return !obj;
  }
}

module.exports = isEmpty;
