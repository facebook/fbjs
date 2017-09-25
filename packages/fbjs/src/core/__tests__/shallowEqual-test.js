/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

jest.unmock('shallowEqual');

const shallowEqual = require('shallowEqual');

describe('shallowEqual', () => {
  it('returns false if either argument is null', () => {
    expect(shallowEqual(null, {})).toBe(false);
    expect(shallowEqual({}, null)).toBe(false);
  });

  it('returns true if both arguments are null or undefined', () => {
    expect(shallowEqual(null, null)).toBe(true);
    expect(shallowEqual(undefined, undefined)).toBe(true);
  });

  it('returns true if arguments are not objects and are equal', () => {
    expect(shallowEqual(1, 1)).toBe(true);
  });

  it('returns true if arguments are shallow equal', () => {
    expect(
      shallowEqual(
        {a: 1, b: 2, c: 3},
        {a: 1, b: 2, c: 3}
      )
    ).toBe(true);
  });

  it('returns true when comparing NaN', () => {
    expect(shallowEqual(NaN, NaN)).toBe(true);

    expect(
      shallowEqual(
        {a: 1, b: 2, c: 3, d: NaN},
        {a: 1, b: 2, c: 3, d: NaN}
      )
    ).toBe(true);
  });

  it('returns false if arguments are not objects and not equal', () => {
    expect(
      shallowEqual(
        1,
        2
      )
    ).toBe(false);
  });

  it('returns false if only one argument is not an object', () => {
    expect(
      shallowEqual(
        1,
        {}
      )
    ).toBe(false);
  });

  it('returns false if first argument has too many keys', () => {
    expect(
      shallowEqual(
        {a: 1, b: 2, c: 3},
        {a: 1, b: 2}
      )
    ).toBe(false);
  });

  it('returns false if second argument has too many keys', () => {
    expect(
      shallowEqual(
        {a: 1, b: 2},
        {a: 1, b: 2, c: 3}
      )
    ).toBe(false);
  });

  it('returns false if arguments are not shallow equal', () => {
    expect(
      shallowEqual(
        {a: 1, b: 2, c: {}},
        {a: 1, b: 2, c: {}}
      )
    ).toBe(false);
  });
});
