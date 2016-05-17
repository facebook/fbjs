/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule cssVar
 * @typechecks
 */

/**
 * @param {string} name
 */
function cssVar(name) {
  throw new Error(
    'cssVar' + '("' + name + '"): Unexpected class transformation.'
  );
}

module.exports = cssVar;