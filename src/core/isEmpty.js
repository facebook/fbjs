/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule isEmpty
 */

/**
 * Mimics empty from PHP.
 */
function isEmpty(obj) {
  if (Array.isArray(obj)) {
    return obj.length === 0;
  } else if (typeof obj === 'object') {
    for (var i in obj) {
      return false;
    }
    return true;
  } else {
    return !obj;
  }
}

module.exports = isEmpty;
