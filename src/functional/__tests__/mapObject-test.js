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

jest.dontMock('mapObject');

describe('mapObject', () => {
  var mapObject = require('mapObject');

  var mockObject;
  var mockCallback;

  beforeEach(() => {
    mockObject = {
      foo: 1,
      bar: 2,
      baz: 3
    };
    mockCallback = jest.genMockFunction();
  });

  it('should accept null', () => {
    expect(mapObject(null, mockCallback)).toBeNull();
    expect(mockCallback).not.toBeCalled();
  });

  it('should return value to create copy', () => {
    var mapped = mapObject(mockObject, mockCallback.mockImplementation(
      value => value
    ));

    expect(mapped).not.toBe(mockObject);
    expect(mapped).toEqual(mockObject);
  });

  it('should always retain keys', () => {
    var mapped = mapObject(mockObject, mockCallback.mockImplementation(
      () => null
    ));

    expect(mapped).toEqual({
      foo: null,
      bar: null,
      baz: null
    });
  });

  it('should map values', () => {
    var mapped = mapObject(mockObject, mockCallback.mockImplementation(
      value => value * value
    ));

    expect(mapped).toEqual({
      foo: 1,
      bar: 4,
      baz: 9
    });
  });

  it('should map keys', () => {
    var mapped = mapObject(mockObject, mockCallback.mockImplementation(
      (value, key) => key
    ));

    expect(mapped).toEqual({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz'
    });
  });
});
