/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+relay
 */

'use strict';

var Deferred = require('Deferred');
var fetch = require('fetch');

describe('fetchMock', () => {
  it('has a corresponding `Deferred` for each call to `fetch`', () => {
    expect(fetch.mock.calls.length).toBe(0);
    expect(fetch.mock.deferreds.length).toBe(0);
    var promise = fetch('//localhost', {});
    expect(fetch.mock.calls.length).toBe(1);
    expect(fetch.mock.deferreds.length).toBe(1);
    var deferred = fetch.mock.deferreds[0];
    expect(deferred instanceof Deferred).toBe(true);
    var mockCallback = jest.genMockFunction();
    var mockResult = {};
    expect(mockCallback).not.toBeCalled();
    promise.then(mockCallback);
    deferred.resolve(mockResult);
    jest.runAllTimers();
    expect(mockCallback).toBeCalledWith(mockResult);
  });
});
