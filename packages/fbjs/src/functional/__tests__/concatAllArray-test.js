/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
  * @emails oncall+ui_infra@xmail.facebook.com
  */

jest
  .dontMock('concatAllArray');

var concatAllArray = require('concatAllArray');

describe('concatAllArray', () => {

  it('concats an array of arrays', () => {
    expect(
      concatAllArray([[1, 7, 8], [5], [4, 3]], x => x)
    ).toEqual([1, 7, 8, 5, 4, 3]);
  });

  it('ignores null and undefined', () => {
    expect(
      concatAllArray([null, undefined, [1], [2]], x => x)
    ).toEqual([1, 2]);
  });

  it('throws for scalar values', () => {
    [false, true, 'b', 2].forEach(value =>
      expect(() => concatAllArray([value], x => x)).toThrow(
        new TypeError(
          'concatAllArray: All items in the array must be an array or null, ' +
          'got "' + value + '" at index "0" instead'
        )
      )
    );
  });

});
