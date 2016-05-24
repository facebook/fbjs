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

jest.dontMock('minBy');

var minBy = require('minBy');

describe('minBy', () =>
  it('returns the correct result', () => {
    expect(
      minBy([3, 1, 4, 2], x => x)
    ).toBe(1);

    expect(
      minBy([3, -1, 4, -2], x => x)
    ).toBe(-2);

    expect(
      minBy(['four', 'score', 'and', 'seven', 'years', 'ago'], x => x.length)
    ).toBe('and');

    expect(
      minBy([3, 1, 4, 2], x => x, (a, b) => - (a - b))
    ).toBe(4);

    expect(
      minBy([3, 1, 4, 2], x => x, () => 0)
    ).toBe(3);

    expect(
      minBy([3, 1, 4, 2], x => undefined, () => 0)
    ).toBe(3);

    expect(
      minBy([], x => x)
    ).toBe(undefined);

    expect(
      minBy(['3', '1', 4, '2', 3, 1, '4', 2], x => +x)
    ).toBe('1');
  })
);
