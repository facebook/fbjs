/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule flattenArray
 * @typechecks
 */

/**
 * Provided a deeply nested array, returns the flattened array that would result
 * from doing a DFS iteration.
 *
 *   // Example
 *   var deep = ["a", ["b", "c"], "d", {"e":[1,2]}, [["f"], "g"]];
 *   var flat = flattenArray(deep);
 *   console.log(flat);
 *   > ["a", "b", "c", "d", {"e":[1,2]}, "f", "g"];
 *
 */
function flattenArray(/*array*/ originalArray) {
  var arr = originalArray.slice();
  var flat = [];
  while (arr.length) {
    var last = arr.pop();
    if (Array.isArray(last)) {
      Array.prototype.push.apply(arr, last);
    } else {
      flat.push(last);
    }
  }
  return flat.reverse();
}

module.exports = flattenArray;
