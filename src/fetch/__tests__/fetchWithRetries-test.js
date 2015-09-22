/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+relay
 */

'use strict';

jest.dontMock('fetchWithRetries');

describe('fetchWithRetries', () => {
  var fetch;
  var fetchWithRetries;
  var handleNext;

  function mockResponse(status) {
    return {status};
  }

  beforeEach(() => {
    jest.resetModuleRegistry();

    fetch = require('fetch');
    fetchWithRetries = require('fetchWithRetries');
    handleNext = jest.genMockFunction();

    spyOn(console, 'error').andCallFake(message => {
      expect(message).toBe(
        'Warning: fetchWithRetries: HTTP timeout, retrying.'
      );
    });
  });

  it('sends a request to the given URI', () => {
    expect(fetch).not.toBeCalled();
    var init = {
      body: '',
      method: 'GET',
    };
    fetchWithRetries('https://localhost', init);
    expect(fetch).toBeCalledWith('https://localhost', init);
  });

  it('resolves the promise when the `fetch` was successful', () => {
    var response = mockResponse(200);
    fetchWithRetries('https://localhost', {}).then(handleNext);
    fetch.mock.deferreds[0].resolve(response);
    expect(handleNext).not.toBeCalled();
    jest.runAllTimers();
    expect(handleNext).toBeCalledWith(response);
  });

  it('rejects the promise if an error occurred during fetch and no more ' +
     'retries should be attempted', () => {
      // Disable retries for this test
      var error = new Error();
      var retryDelays = [];
      fetchWithRetries('https://localhost', {retryDelays}).catch(handleNext);
      fetch.mock.deferreds[0].reject(error);
      expect(handleNext).not.toBeCalled();
      jest.runAllTimers();
      expect(handleNext).toBeCalledWith(error);
    }
  );

  it('retries the request if the previous attempt failed', () => {
    var failedResponse = mockResponse(500);
    fetchWithRetries('https://localhost', {}).then(handleNext);
    expect(fetch.mock.calls.length).toBe(1);
    fetch.mock.deferreds[0].resolve(failedResponse);
    for (var ii = 0; ii < 100; ii++) {
      if (fetch.mock.calls.length < 2) {
        jest.runOnlyPendingTimers();
      } else {
        break;
      }
    }
    // Resolved with `failedResponse`, next run is scheduled
    expect(fetch.mock.calls.length).toBe(2);
    var successfulResponse = mockResponse(200);
    fetch.mock.deferreds[1].resolve(successfulResponse);
    expect(handleNext).not.toBeCalled();
    jest.runAllTimers();
    expect(handleNext).toBeCalledWith(successfulResponse);
  });

  it('gives up if response failed after retries', () => {
    var init = {retryDelays: [600]};
    var failedResponse = mockResponse(500);
    var handleCatch = jest.genMockFunction();
    fetchWithRetries('https://localhost', init)
      .then(handleNext).catch(handleCatch);
    expect(fetch.mock.calls.length).toBe(1);
    fetch.mock.deferreds[0].resolve(failedResponse);
    for (var ii = 0; ii < 100; ii++) {
      if (fetch.mock.calls.length < 2) {
        jest.runOnlyPendingTimers();
      } else {
        break;
      }
    }
    // Resolved with `failedResponse`, next run is scheduled
    expect(fetch.mock.calls.length).toBe(2);
    fetch.mock.deferreds[1].resolve(failedResponse);
    // No more re-tries, it should reject with an `Error`
    expect(handleNext).not.toBeCalled();
    jest.runAllTimers();
    var errorArg = handleCatch.mock.calls[0][0];
    expect(errorArg instanceof Error).toBe(true);
    expect(errorArg.message).toEqual('fetchWithRetries(): Still no ' +
      'successful response after 2 retries, giving up.');
    expect(errorArg.response).toEqual(failedResponse);
  });

  it('retries the request if the previous attempt timed-out', () => {
    var retries;
    var retryDelays = [1000, 3000];
    var init = {retryDelays};
    fetchWithRetries('https://localhost', init).catch(handleNext);
    expect(fetch.mock.calls.length).toBe(1);
    for (
      retries = 0;
      retries < retryDelays.length;
      retries++
    ) {
      // Timeout request.
      jest.runAllTimers();
      // Delay before next try.
      jest.runAllTimers();
    }
    expect(fetch.mock.calls.length).toBe(retries + 1);
    // Timeout last request.
    jest.runAllTimers();
    expect(handleNext.mock.calls[0][0]).toEqual(new Error(
      'fetchWithRetries',
      'Failed to get response from server, tried ' + retries + ' times',
    ));
  });

  // Test fails when used with npm `promise` due to Jest timing issues.
  xit('defaults fetch timeout to 15s', () => {
    fetchWithRetries('https://localhost', {retryDelays: []}).catch(handleNext);

    setTimeout(() => {
      expect(handleNext).not.toBeCalled();
    }, 14999);
    var callback = jest.genMockFunction();
    setTimeout(callback.mockImplementation(() => {
      expect(handleNext).toBeCalled();
    }), 15001);
    jest.runAllTimers();

    expect(callback).toBeCalled();
  });

  // Test fails when used with npm `promise` due to Jest timing issues.
  xit('preserves fetch timeout of 0s', () => {
    fetchWithRetries('https://localhost', {
      fetchTimeout: 0,
      retryDelays: [],
    }).catch(handleNext);

    var callback = jest.genMockFunction();
    setTimeout(callback.mockImplementation(() => {
      expect(handleNext).toBeCalled();
    }), 1);
    jest.runAllTimers();

    expect(callback).toBeCalled();
  });
});
