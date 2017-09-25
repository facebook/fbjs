/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+relay
 */

'use strict';

const base62 = require('base62');

describe('base62', () => {
  var samples = [
    {
      input: 0,
      output: '0',
    },
    {
      input: 1,
      output: '1',
    },
    {
      input: 10,
      output: 'a',
    },
    {
      input: 35,
      output: 'z',
    },
    {
      input: 36,
      output: 'A',
    },
    {
      input: 61,
      output: 'Z',
    },
    {
      input: 62,
      output: '10',
    },
  ];

  it('computes base62 correctly', () => {
    samples.forEach(sample => {
      expect(base62(sample.input)).toBe(sample.output);
    });
  });
});
