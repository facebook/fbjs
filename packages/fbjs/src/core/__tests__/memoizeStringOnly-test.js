/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */

'use strict';

describe('memoizeStringOnly', function() {
  let memoizeStringOnly;

  beforeEach(function() {
    jest.resetModuleRegistry();
    memoizeStringOnly = require('memoizeStringOnly');
  });

  it('should be transparent to callers', function() {
    const callback = function(string) {
      return string;
    };
    const memoized = memoizeStringOnly(callback);

    expect(memoized('foo'), callback('foo'));
  });
});
