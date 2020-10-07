/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.unmock('equalsSet');

var equalsSet = require('equalsSet');

describe('equalsSet', () => {
  it('returns true for empty sets', () => {
    var one = new Set();
    var two = new Set();
    expect(equalsSet(one, two)).toBe(true);
    expect(equalsSet(two, one)).toBe(true);
  });

  it('returns true for sets that are equal', () => {
    var one = new Set(['a', 'b', 'c']);
    var two = new Set(['c', 'b', 'a', 'a']);
    expect(equalsSet(one, two)).toBe(true);
    expect(equalsSet(two, one)).toBe(true);
  });

  it('returns true for sets that are equal with object values', () => {
    var foo = {};
    var bar = {bar: 'bar'};
    var one = new Set([foo, bar]);
    var two = new Set([bar, foo]);
    expect(equalsSet(one, two)).toBe(true);
    expect(equalsSet(two, one)).toBe(true);
  });

  it('returns false for sets that have different lengths', () => {
    var one = new Set(['a']);
    var two = new Set(['a', 'b']);
    expect(equalsSet(one, two)).toBe(false);
    expect(equalsSet(two, one)).toBe(false);
  });

  it('returns false for single element sets with different values', () => {
    var foo = {};
    var bar = {};
    var one = new Set([foo]);
    var two = new Set([bar]);
    expect(equalsSet(one, two)).toBe(false);
    expect(equalsSet(two, one)).toBe(false);
  });

  it('returns false for multi element sets with different values', () => {
    var one = new Set(['a', 'b']);
    var two = new Set(['b', 'c']);
    expect(equalsSet(one, two)).toBe(false);
    expect(equalsSet(two, one)).toBe(false);
  });
});
