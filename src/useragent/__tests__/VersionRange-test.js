/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @oncall oncall+jsinfra
 */

'use strict';

jest.dontMock('VersionRange');

var VersionRange = require('VersionRange');

describe('VersionRange', () => {
  function assertVersion(a, b, contains) {
    expect(VersionRange.contains(a, b)).toBe(contains);
  }

  describe('contains', () => {
    it('considers * to match everything', () => {
      assertVersion('*', '1.0', true);
    });

    it('treats the empty string as equivalent to "*"', () => {
      assertVersion('', '1.0', true);
    });

    it('matches literal versions', () => {
      assertVersion('1.0', '1.0', true);

      assertVersion('1.0', '1.1', false);
    });

    it('considers = to indicate an exact match', () => {
      assertVersion('=1.0', '1.0', true);
      assertVersion('= 1.0', '1.0', true);

      assertVersion('=1.0', '1.1', false);
    });

    it('matches using the > operator', () => {
      assertVersion('> 0.1', '2', true);
      assertVersion('> 0.1', '0.2', true);
      assertVersion('> 0.1', '0.1.1', true);
      assertVersion('>0.1', '0.1.1', true);

      assertVersion('> 2.0', '1', false);
      assertVersion('> 2.0', '0.1', false);
      assertVersion('> 2.0', '1.9.9', false);
      assertVersion('>2.0', '1.9.9', false);
    });

    it('matches using the >= operator', () => {
      assertVersion('>= 1.0', '1', true);
      assertVersion('>= 1.0', '1.0', true);
      assertVersion('>= 1.0', '1.1', true);
      assertVersion('>= 1.0', '2.0.0', true);

      assertVersion('>= 2.1', '1', false);
      assertVersion('>= 2.1', '2.0', false);
      assertVersion('>= 2.1', '2.0.9', false);
    });

    it('matches using the < operator', () => {
      assertVersion('< 36.1', '36', true);
      assertVersion('< 36.1', '35.1', true);
      assertVersion('< 36.1', '32.1.0', true);

      assertVersion('< 36.1', '38', false);
      assertVersion('< 36.1', '36.1', false);
      assertVersion('< 36.1', '36.9', false);
      assertVersion('< 36.1', '39.1.1', false);
    });

    it('matches using the <= operator', () => {
      assertVersion('<= 12.0', '11', true);
      assertVersion('<= 12.0', '12', true);
      assertVersion('<= 12.0', '10.9', true);
      assertVersion('<= 12.0', '7.6.1', true);

      assertVersion('<= 12.0', '13', false);
      assertVersion('<= 12.0', '12.1', false);
      assertVersion('<= 12.0', '13.1', false);
      assertVersion('<= 12.0', '13.2.1', false);
    });

    it('matches using the ~ operator', () => {
      assertVersion('~1.0', '1.0.2', true);
      assertVersion('~1.3.1', '1.3.1', true);
      assertVersion('~1.3.1', '1.3.2', true);
      assertVersion('~ 1.3.1', '1.3.1', true); // whitespace variant

      assertVersion('~1', '2', false);
      assertVersion('~1', '0.1', false);
      assertVersion('~1.0', '2.0', false);
      assertVersion('~1.3.1', '1', false);
      assertVersion('~1.3.1', '1.3', false);
      assertVersion('~1.3.1', '1.4', false);
      assertVersion('~1.3.1', '2', false);
    });

    it('matches using the ~> operator', () => {
      assertVersion('~>1', '1.1', true);
      assertVersion('~>1.0', '1.0.2', true);
      assertVersion('~>1.3.1', '1.3.1', true);
      assertVersion('~>1.3.1', '1.3.2', true);
      assertVersion('~> 1.3.1', '1.3.1', true); // whitespace variant

      assertVersion('~>1', '2', false);
      assertVersion('~>1', '0.1', false);
      assertVersion('~>1.0', '2.0', false);
      assertVersion('~>1.3.1', '1', false);
      assertVersion('~>1.3.1', '1.3', false);
      assertVersion('~>1.3.1', '1.4', false);
      assertVersion('~>1.3.1', '2', false);
    });

    it('considers "x" to be a wildcard', () => {
      assertVersion('x', '7', true);
      assertVersion('X', '7', true);
      assertVersion('12.x', '12.1', true);
      assertVersion('12.X', '12.1', true);
      assertVersion('12.x.x', '12.0', true); // due to zero-padding
      assertVersion('12.x.x', '12.9.1', true);

      assertVersion('1.x', '2.0', false);
      assertVersion('1.x.x', '2.0.0', false);
      assertVersion('1.xylophone', '1.1', false); // not a wildcard
    });

    it('treats "*" like "x" in when not used as the last component', () => {
      assertVersion('0.*.9', '0.1.9', true);
      assertVersion('*.*.9', '0.1.9', true);

      assertVersion('0.*.9', '0.1.0', false);
      assertVersion('*.*.9', '0.1.0', false);
    });

    it('treats "*" like a "greedy x" when used as the last component', () => {
      assertVersion('0.*', '0.1', true);
      assertVersion('0.*', '0.1.2.3.4', true);
      assertVersion('0.*.*', '0.1', true); // due to zero-padding
      assertVersion('0.*.*', '0.1.2', true);
      assertVersion('0.*.*', '0.1.2.3.4', true);
      assertVersion('*.*.*', '0', true);
      assertVersion('*.*.*', '0.1', true);
      assertVersion('*.*.*', '0.1.2', true);
      assertVersion('*.*.*', '0.1.2.3.4', true);

      assertVersion('0.*', '1.0', false);
      assertVersion('0.*', '1.0.1', false);
      assertVersion('0.*.*', '1.0.1', false);
    });

    it('matches using the || operator', () => {
      assertVersion('1.0 || 1.1', '1.0', true);
      assertVersion('1.0 || 1.1', '1.1', true);
      assertVersion('1.0||1.1', '1.1', true); // whitespace variant
      assertVersion('1 || 2 || 3', '3', true);
      assertVersion('> 2 || ~> 1.3.1', '1.3.2', true);
      assertVersion('> 2 || ~> 1.3.1', '3', true);

      assertVersion('1.0 || 1.1', '1.2', false);
      assertVersion('1 || 2 || 3', '4', false);
      assertVersion('> 2 || ~> 1.3.1', '1', false);
      assertVersion('> 2 || ~> 1.3.1', '1.4', false);
    });

    it('matches using the - operator', () => {
      assertVersion('1.0 - 1.2', '1.0', true);
      assertVersion('1.0 - 1.2', '1.1', true);
      assertVersion('1.0 - 1.2', '1.2', true);

      assertVersion('1.0 - 1.2', '1.3', false);
    });

    it('considers - to have higher precedence than ||', () => {
      assertVersion('1.0 - 1.2 || 2.0 - 2.1', '1.2', true);
      assertVersion('1.0 - 1.2 || 2.0 - 2.1', '2.0', true);

      assertVersion('1.0 - 1.2 || 2.0 - 2.1', '1.3', false);
    });

    it('requires whitespace around the - operator', () => {
      assertVersion('1.0-1.2', '1.0-1.2', true);

      assertVersion('1.0-1.2', '1.1', false);
    });

    it('complains about invalid range expressions', () => {
      // too many operands
      expect(() => VersionRange.contains('1 - 2 - 3', '2')).toThrow();

      // non-simple operands
      expect(() => VersionRange.contains('>= 1.0 - > 2.1')).toThrow();
    });
  });
});
