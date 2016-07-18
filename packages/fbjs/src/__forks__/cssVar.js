/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule cssVar
 */

const fbCSSVars = require('fbjs-css-vars');
const invariant = require('invariant');

/**
 * @param {string} name
 */
function cssVar(name) {
  invariant(
    Object.prototype.hasOwnProperty.call(fbCSSVars, name),
    'Unknown key passed to cssVar: %s.',
    name
  );

  return fbCSSVars[name];
}

module.exports = cssVar;
