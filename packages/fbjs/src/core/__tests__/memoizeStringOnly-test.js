/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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

    expect(memoized('foo')).toEqual(callback('foo'));
  });
});
