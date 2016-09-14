/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

let config = JSON.parse(JSON.stringify(require('.')));

Object.keys(config.rules).forEach((rule) => {
  let val = config.rules[rule];
  if (Array.isArray(val)) {
    if (val[0] === 0) {
      return;
    }
    val[0] = 2;
    config.rules[rule] = val;
    return;
  }
  if (val === 0) {
    return;
  }
  config.rules[rule] = 2;
});

module.exports = config;
