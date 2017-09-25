/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

jest.unmock('groupArray');

var groupArray = require('groupArray');

describe('groupArray', () => {
  it('should handle empty arrays', () => {
    var result = groupArray([], item => 'lol');
    expect(Object.keys(result).length).toBe(0);
  });

  it('should handle every item being in one group', () => {
    var items = ['hello', 'world', 'foo', 'bar'];
    var groupFn = item => 'lol';

    var result = groupArray(items, groupFn);

    expect(Object.keys(result).length).toBe(1);
    expect(result.lol).toEqual(items);
  });

  it('should handle every item being in a different group', () => {
    var items = ['hello', 'world', 'foo', 'bar'];
    var groupFn = item => 'group_' + item;

    var result = groupArray(items, groupFn);

    expect(Object.keys(result).length).toBe(items.length);
    expect(result.group_hello).toEqual(['hello']);
    expect(result.group_world).toEqual(['world']);
    expect(result.group_foo).toEqual(['foo']);
    expect(result.group_bar).toEqual(['bar']);
  });

  it('should handle two items in the same group', () => {
    var items = ['hello', 'world', 'test'];
    var groupFn = item => item.length;

    var result = groupArray(items, groupFn);

    expect(Object.keys(result).length).toBe(2);
    expect(result[5]).toEqual(['hello', 'world']);
    expect(result[4]).toEqual(['test']);
  });
});
