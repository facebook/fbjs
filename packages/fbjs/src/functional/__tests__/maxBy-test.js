/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @emails oncall+ui_infra
 */

'use strict';

jest
  .unmock('maxBy')
  .unmock('minBy');

var maxBy = require('maxBy');

describe('maxBy', () =>
  it('returns the correct result', () => {
    expect(
      maxBy([3, 1, 4, 2], x => x)
    ).toBe(4);

    expect(
      maxBy([3, -1, 4, -2], x => x)
    ).toBe(4);

    expect(
      maxBy(['four', 'score', 'and', 'seven', 'years', 'ago'], x => x.length)
    ).toBe('score');

    expect(
      maxBy([3, 1, 4, 2], x => x, (a, b) => -(a - b))
    ).toBe(1);

    expect(
      maxBy([3, 1, 4, 2], x => x, () => 0)
    ).toBe(3);

    expect(
      maxBy([3, 1, 4, 2], x => undefined, () => 0)
    ).toBe(3);

    expect(
      maxBy([], x => x)
    ).toBe(undefined);

    expect(
      maxBy(['3', '1', 4, '2', 3, 1, '4', 2], x => +x)
    ).toBe(4);
  })
);
