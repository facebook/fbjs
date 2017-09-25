/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
  * @emails oncall+ui_infra@xmail.facebook.com
  */

jest
  .unmock('partitionArray');

var partitionArray = require('partitionArray');

describe('partitionArray', () => {

  it('partitions an array based on a fn', () => {
    expect(
      partitionArray(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        x => x > 5
      )
    ).toEqual(
      [[6, 7, 8, 9], [1, 2, 3, 4, 5]]
    );
  });

  it('keeps the original order of items', () => {
    expect(
      partitionArray(
        [9, 7, 3, 1, 2, 4, 8, 5, 6],
        x => x < 5
      )
    ).toEqual(
      [[3, 1, 2, 4], [9, 7, 8, 5, 6]]
    );
  });

});
