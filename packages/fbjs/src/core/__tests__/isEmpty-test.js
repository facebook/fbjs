/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

jest.mock('_shouldPolyfillES6Collection');

const Map = require('Map');
const Set = require('Set');

const isEmpty = require('isEmpty');
const _shouldPolyfillES6Collection = require('_shouldPolyfillES6Collection');

describe('isEmpty', () => {
  it('should return true for empty supported types', () => {
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(Object.create(null))).toBe(true);
  });

  it('should return false for non-empty supported types', () => {
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty('0')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({a: 1})).toBe(false);
  });

  it('should not allow maps and sets', () => {
    // Ensure that `Map` and `Set` use non-native polyfills
    _shouldPolyfillES6Collection.mockReturnValue(true);

    // Polyfilled
    expect(() => isEmpty(new Map())).toThrow();
    expect(() => isEmpty(new Set())).toThrow();

    // Native
    expect(() => isEmpty(new global.Map())).toThrow();
    expect(() => isEmpty(new global.Set())).toThrow();
  });
});
