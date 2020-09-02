/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

jest
  .unmock('debounceCore');

const debounce = require('debounceCore');

describe('debounceCore', function() {
  let func1;
  const BUFFER = 10;

  beforeEach(function() {
    jest.resetModuleRegistry();
    func1 = jest.fn();
  });

  function argsEquivalent(args1, args2) {
    for (let i = 0; i < Math.max(args1.length, args2.length); i++) {
      if (args1[i] != args2[i]) {
        return false;
      }
    }
    return true;
  }

  function assertCalledWith() {
    const args = [].slice.call(arguments);
    expect(
      func1.mock.calls.some(function(call) {
        return argsEquivalent(args, call);
      })
    ).toBeTruthy();
  }

  it('should not call until the wait is over', function() {
    const wait = 200;
    const debounced = debounce(func1, wait);
    debounced(1, 'a');
    expect(func1).not.toBeCalled();

    jest.advanceTimersByTime(wait + BUFFER);
    assertCalledWith(1, 'a');

    // make sure that subsequent function isn't called right away
    debounced(2, 'a');
    expect(func1.mock.calls.length).toBe(1);
    mockClearTimers();
  });

  it('should only call the last function per batch', function() {
    const wait = 200;
    const debounced = debounce(func1, wait);
    debounced(1, 'a');
    expect(func1).not.toBeCalled();
    jest.advanceTimersByTime(100);
    debounced(2, 'a');
    jest.advanceTimersByTime(100);
    debounced(3, 'a');
    jest.advanceTimersByTime(100);
    debounced(4, 'a');
    jest.advanceTimersByTime(100);
    debounced(5, 'a');
    expect(mockGetTimersCount()).toBe(1);
    jest.advanceTimersByTime(wait + BUFFER);
    assertCalledWith(5, 'a');
    debounced(6, 'a');
    debounced(7, 'a');
    jest.advanceTimersByTime(wait + BUFFER);
    assertCalledWith(7, 'a');
    expect(func1.mock.calls.length).toBe(2);
  });

  it('should allow setting a custom setTimeout function', function() {
    const setTimeoutFunc = jest.fn();
    const wait = 200;
    const debounced = debounce(func1, wait, null, setTimeoutFunc);
    debounced(1, 'a');
    debounced(2, 'a');
    expect(setTimeoutFunc.mock.calls.length).toBe(2);
  });

  it('should be reset-able', function() {
    const wait = 300;
    const debounced = debounce(func1, wait);
    debounced(1, 'a');
    debounced.reset();
    expect(mockGetTimersCount()).toBe(0);
    mockRunTimersRepeatedly();
    expect(func1).not.toBeCalled();
  });
});
