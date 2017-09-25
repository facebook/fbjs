/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.unmock('someObject');

var someObject = require('someObject');

describe('someObject', function() {
  var mockObject;
  var mockCallback;

  beforeEach(() => {
    mockObject = {foo: 1, bar: 2, baz: 3};
    mockCallback = jest.fn();
  });

  it('handles null', () => {
    someObject(null, mockCallback);

    expect(mockCallback).not.toBeCalled();
  });

  it('returns false if none of properties pass the test', () => {
    mockCallback.mockImplementation(() => false);
    var result = someObject(mockObject, mockCallback);

    expect(result).toBeFalsy();
    expect(mockCallback.mock.calls).toEqual([
      [1, 'foo', mockObject],
      [2, 'bar', mockObject],
      [3, 'baz', mockObject]
    ]);
  });

  it('returns true if any of the properties passes the test', () => {
    mockCallback.mockImplementation(() => true);
    var result = someObject(mockObject, mockCallback);

    expect(result).toBeTruthy();
    expect(mockCallback).toBeCalled();
  });

  it('returns immediately upon finding a property that passes the test', () => {
    mockCallback.mockImplementation(() => true);
    var result = someObject(mockObject, mockCallback);

    expect(result).toBeTruthy();
    expect(mockCallback.mock.calls.length).toEqual(1);
  });
});
