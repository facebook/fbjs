/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
