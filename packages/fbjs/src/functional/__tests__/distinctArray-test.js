/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * @emails oncall+ui_infra
 */

'use strict';

jest
  .dontMock('distinctArray')
  .dontMock('Set');

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
