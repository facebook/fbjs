/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Locale
 */

const SiteData = require('SiteData');
const ExecutionEnvironment = require('ExecutionEnvironment');

function isRTL() {
  if (!ExecutionEnvironment.canUseDOM) {
    return false;
  } else {
    return SiteData.is_rtl;
  }
}

var Locale = {
  isRTL: isRTL,
};

module.exports = Locale;
