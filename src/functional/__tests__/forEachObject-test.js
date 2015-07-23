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

jest.dontMock('forEachObject');

describe('forEachObject', function() {
  var forEachObject = require('forEachObject');

  var mockObject;
  var mockCallback;

  beforeEach(() => {
    mockObject = {foo: 1, bar: 2, baz: 3};
    mockCallback = jest.genMockFunction();
  });

  it('should handle null', () => {
    forEachObject(null, mockCallback);

    expect(mockCallback).not.toBeCalled();
  });

  it('should iterate over object properties', () => {
    forEachObject(mockObject, mockCallback);

    expect(mockCallback.mock.calls).toEqual([
      [1, 'foo', mockObject],
      [2, 'bar', mockObject],
      [3, 'baz', mockObject]
    ]);
  });

  it('should iterate over object properties', () => {
    var mockContext = {};

    forEachObject(
      mockObject,
      mockCallback.mockImplementation(function() {
        expect(this).toBe(mockContext);
      }),
      mockContext
    );

    expect(mockCallback).toBeCalled();
  });

  it('should ignore new properties', () => {
    forEachObject(mockObject, mockCallback.mockImplementation(
      function(value, name, object) {
        object['added:' + name] = value;
      }
    ));

    expect(mockCallback.mock.calls).toEqual([
      [1, 'foo', mockObject],
      [2, 'bar', mockObject],
      [3, 'baz', mockObject]
    ]);
  });

  it('should ignore deleted properties', () => {
    forEachObject(mockObject, mockCallback.mockImplementation(
      function(value, name, object) {
        delete object.baz;
      }
    ));

    expect(mockCallback.mock.calls).toEqual([
      [1, 'foo', mockObject],
      [2, 'bar', mockObject]
    ]);
  });

  it('should invoke callback with new values', () => {
    forEachObject(mockObject, mockCallback.mockImplementation(
      function(value, name, object) {
        object.baz = undefined;
      }
    ));

    expect(mockCallback.mock.calls).toEqual([
      [1, 'foo', mockObject],
      [2, 'bar', mockObject],
      [undefined, 'baz', mockObject]
    ]);
  });

  it('should ignore properties on the prototype chain', () => {
    var chainedObject = Object.create(mockObject);
    chainedObject.qux = 0;

    forEachObject(chainedObject, mockCallback);

    expect(mockCallback.mock.calls).toEqual([
      [0, 'qux', chainedObject]
    ]);
  });

  it('should handle objects with `hasOwnProperty`', () => {
    /* jshint -W001 */
    var chainedObject = Object.create(mockObject);
    chainedObject.hasOwnProperty = jest.genMockFunction().mockReturnValue(true);

    forEachObject(chainedObject, mockCallback);

    expect(chainedObject.hasOwnProperty).not.toBeCalled();
    expect(mockCallback.mock.calls).toEqual([
      [chainedObject.hasOwnProperty, 'hasOwnProperty', chainedObject],
    ]);
  });
});
