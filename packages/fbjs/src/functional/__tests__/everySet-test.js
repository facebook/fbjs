/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.dontMock('everySet');

var Set = require('Set');
var everySet = require('everySet');

describe('everySet', () => {
  it('returns true for empty sets', () => {
    var one = new Set();
    var test = () => false;
    expect(everySet(one, test)).toBe(true);
  });

  it('returns true when everything passes', () => {
    var one = new Set(['a', 'b', 'c']);
    var test = (value) => true;
    expect(everySet(one, test)).toBe(true);
  });

  it('returns false when not everything passes', () => {
    var one = new Set(['a', 'b', 'c']);
    var test = (value) => value === 'a';
    expect(everySet(one, test)).toBe(false);
  });

  it('respects thisArg', () => {
    var one = new Set(['a', 'b', 'c']);
    var testSet = new Set(['a', 'b', 'c']);
    expect(() => everySet(one, testSet.has)).toThrow();
    expect(everySet(one, testSet.has, testSet)).toBe(true);
  });
});
