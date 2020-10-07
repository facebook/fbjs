/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @emails oncall+ui_infra
 */

'use strict';

jest
  .unmock('distinctArray');

var distinctArray = require('distinctArray');

describe('distinctArray', () =>
  it('returns the correct result', () => {
    expect(
      distinctArray([1, 2, 3])
    ).toEqual(
      [1, 2, 3]
    );

    expect(
      distinctArray([1, 1, 1, 2, 3])
    ).toEqual(
      [1, 2, 3]
    );

    expect(
      distinctArray([1, 2, 3, 1, 1])
    ).toEqual(
      [1, 2, 3]
    );

    expect(
      distinctArray([1, 1, 1])
    ).toEqual(
      [1]
    );

    expect(
      distinctArray([])
    ).toEqual(
      []
    );

    expect(
      distinctArray(['a', 'b', 'c' ,'a', 1, 2, 'a', 1])
    ).toEqual(
      ['a', 'b', 'c', 1, 2]
    );
  })
);
