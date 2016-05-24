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
  .dontMock('flatMapArray');

var flatMapArray = require('flatMapArray');

describe('flatMapArray', () => {

  it('flattens an array of arrays', () => {
    expect(
      flatMapArray([1, 2, 3], x => [x, x + 1])
    ).toEqual([1, 2, 2, 3, 3, 4]);
  });

  it('ignores null and undefined', () => {
    expect(
      flatMapArray([null, undefined, [1], [2]], x => x)
    ).toEqual([1, 2]);
  });

  it('throws for scalar return values', () => {
    [false, true, 'b', 2].forEach(value =>
      expect(() => flatMapArray([value], x => x)).toThrow(
        new TypeError(
          'flatMapArray: Callback must return an array or null, ' +
          'received "' + value + '" instead'
        )
      )
    );
  });

});
