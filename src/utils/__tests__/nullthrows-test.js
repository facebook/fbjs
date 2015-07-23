/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+flow
 * @flow
 */

require('mock-modules').autoMockOff();
var nullthrows = require('nullthrows');

describe('nullthrows', () => {
  it('exists', () => expect(typeof nullthrows).toBe('function'));

  it("Doesn't throw on non-nulls", () => {
    var obj = {};
    expect(nullthrows(0)).toBe(0);
    expect(nullthrows("")).toBe("");
    expect(nullthrows(obj)).toBe(obj);
  });

  it("throws on null", () => {
    expect(() => nullthrows(null)).toThrow();
  });

  it("throws on undefined", () => {
    expect(() => nullthrows(undefined)).toThrow();
  });

});
