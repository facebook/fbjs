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

var crc32 = require('crc32');

describe('crc32', () => {
  var samples = [
    {
      input: '1234567890',
      output: 639479525,
    },
    {
      input: 'CRC me!',
      output: 38028046,
    },
    {
      input: '2733338650',
      output: -1561628646,
    },
  ];

  it('computes crc32 correctly', () => {
    samples.forEach(sample => {
      expect(crc32(sample.input)).toBe(sample.output);
    });
  });
});
