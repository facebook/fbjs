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

var isEmpty = require('isEmpty');

describe('isEmpty', function() {
  it('should work', function() {
    expect(isEmpty(null)).toEqual(true);
    expect(isEmpty(false)).toEqual(true);
    expect(isEmpty(undefined)).toEqual(true);
    expect(isEmpty(0)).toEqual(true);
    expect(isEmpty('')).toEqual(true);
    expect(isEmpty([])).toEqual(true);
    expect(isEmpty({})).toEqual(true);
    expect(isEmpty(Object.create(null))).toEqual(true);

    expect(isEmpty(1)).toEqual(false);
    expect(isEmpty('abc')).toEqual(false);
    expect(isEmpty([1])).toEqual(false);
    expect(isEmpty({a : 1})).toEqual(false);
  });
});
