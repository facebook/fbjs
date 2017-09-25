/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.unmock('someSet');

var Set = require('Set');
var someSet = require('someSet');

describe('someSet', () => {
  it('returns false for empty sets', () => {
    var one = new Set();
    var test = () => true;
    expect(someSet(one, test)).toBe(false);
  });

  it('returns true when everything passes', () => {
    var one = new Set(['a', 'b', 'c']);
    var test = (value) => true;
    expect(someSet(one, test)).toBe(true);
  });

  it('returns true when one thing passes', () => {
    var one = new Set(['a', 'b', 'c']);
    var test = (value) => value === 'a';
    expect(someSet(one, test)).toBe(true);
  });

  it('returns false when nothing passes', () => {
    var one = new Set(['a', 'b', 'c']);
    var test = (value) => value === 'd';
    expect(someSet(one, test)).toBe(false);
  });

  it('respects thisArg', () => {
    var one = new Set(['a', 'b', 'c']);
    var testSet = new Set(['b']);
    expect(() => someSet(one, testSet.has)).toThrow();
    expect(someSet(one, testSet.has, testSet)).toBe(true);
  });
});
