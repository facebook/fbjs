/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.unmock('everyObject');

var everyObject = require('everyObject');

describe('everyObject', function() {
  var mockObject;
  var mockCallback;

  beforeEach(() => {
    mockObject = {foo: 1, bar: 2, baz: 3};
    mockCallback = jest.fn();
  });

  it('handles null', () => {
    everyObject(null, mockCallback);

    expect(mockCallback).not.toBeCalled();
  });

  it('returns true if all properties pass the test', () => {
    mockCallback.mockImplementation(() => true);
    var result = everyObject(mockObject, mockCallback);

    expect(result).toBeTruthy();
    expect(mockCallback.mock.calls).toEqual([
      [1, 'foo', mockObject],
      [2, 'bar', mockObject],
      [3, 'baz', mockObject]
    ]);
  });

  it('returns false if any of the properties fail the test', () => {
    mockCallback.mockImplementation(() => false);
    var result = everyObject(mockObject, mockCallback);

    expect(result).toBeFalsy();
    expect(mockCallback).toBeCalled();
  });

  it('returns immediately upon finding a property that fails the test', () => {
    mockCallback.mockImplementation(() => false);
    var result = everyObject(mockObject, mockCallback);

    expect(result).toBeFalsy();
    expect(mockCallback.mock.calls.length).toEqual(1);
  });
});
