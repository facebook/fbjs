/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const performance = require('performance');

beforeEach(() => {
  jest.resetModules();
});

test('should use performance.now if available', () => {
  const PERFORMANCE_NOW = 123;
  performance.now = jest.fn(() => PERFORMANCE_NOW);

  const performanceNow = require('../performanceNow');

  expect(performanceNow()).toEqual(PERFORMANCE_NOW);
  expect(performance.now).toHaveBeenCalled();
});

test('should fallback to custom implementation if performance.now is not available', () => {
  const TIME_1 = 1000;
  const TIME_2 = 1100;

  Date.now = jest.fn().mockReturnValueOnce(TIME_1).mockReturnValueOnce(TIME_2);
  performance.now = null;

  const performanceNow = require('../performanceNow');

  expect(Date.now).toHaveBeenCalledTimes(1);
  expect(performanceNow()).toEqual(TIME_2 - TIME_1);
  expect(Date.now).toHaveBeenCalledTimes(2);
});
