/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

function isOff(rule) {
  return rule === 0 || rule === 'off';
}

function changeErrorLevel(config, level) {
  // Clone the config so we don't mutate.
  config = JSON.parse(JSON.stringify(config))

  Object.keys(config.rules).forEach((rule) => {
    let val = config.rules[rule];
    if (Array.isArray(val)) {
      if (isOff(val[0])) {
        return;
      }
      val[0] = level;
      config.rules[rule] = level;
      return;
    }
    if (isOff(val)) {
      return;
    }
    config.rules[rule] = level;
  });

  return config;
}

module.exports = changeErrorLevel;
