/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */

var removeFromArray = require('removeFromArray');

describe('removeFromArray', function() {
  it('should remove numbers from an array', function() {
    var a = [1, 2];

    removeFromArray(a, 1);
    expect(a).toEqual([2]);
    removeFromArray(a, 2);
    expect(a).toEqual([]);
  });

  it('should work when the given value is not in the array', function() {
    var a = [1, 2];
    removeFromArray(a, 3);
    expect(a).toEqual([1, 2]);
  });
});
