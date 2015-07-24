/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
 */

'use strict';

jest.dontMock('shallowEqual');

describe('shallowEqual', () => {
  var shallowEqual;

  beforeEach(() => {
    shallowEqual = require('shallowEqual');
  });

  it('returns false if either argument is null', () => {
    expect(shallowEqual(null, {})).toBe(false);
    expect(shallowEqual({}, null)).toBe(false);
  });

  it('returns true if both arguments are null or undefined', () => {
    expect(shallowEqual(null, null)).toBe(true);
    expect(shallowEqual(undefined, undefined)).toBe(true);
  });

  it('returns true if arguments are shallow equal', () => {
    expect(
      shallowEqual(
        {a: 1, b: 2, c: 3},
        {a: 1, b: 2, c: 3}
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
