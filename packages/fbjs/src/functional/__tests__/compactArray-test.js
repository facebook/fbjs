/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 * @flow
 */

jest
  .unmock('compactArray');

var compactArray = require('compactArray');

describe('compactArray', () => {

  it('filters both null and undefined', () => {
    var originalArray: Array<?number> = [1, 2, 3, null, 4, undefined, 5, 6];
    var compactedArray: Array<number> = compactArray(originalArray);
    expect(compactedArray).toEqual(
      [1, 2, 3, 4, 5, 6]
    );
  });

});
