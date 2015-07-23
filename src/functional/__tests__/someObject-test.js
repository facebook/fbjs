/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.dontMock('someObject');

describe('someObject', function() {
  var someObject = require('someObject');

  var mockObject;
  var mockCallback;

  beforeEach(() => {
    mockObject = {foo: 1, bar: 2, baz: 3};
    mockCallback = jest.genMockFunction();
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
