/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+flow
 * @flow
 */

jest.disableAutomock();
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
