/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+unicode, oncall+jsinfra
 */

jest.disableAutomock();

var Dir = require('UnicodeBidiDirection');

describe('UnicodeBidiDirection', function() {

  it('should be comparable with string values', function() {
    expect(Dir.NEUTRAL).toBe('NEUTRAL');
    expect(Dir.LTR).toBe('LTR');
    expect(Dir.RTL).toBe('RTL');
  });

  it('should fail on comparing distinct values', function() {
    expect(Dir.NEUTRAL).not.toBe(Dir.LTR);
    expect(Dir.NEUTRAL).not.toBe(Dir.RTL);
    expect(Dir.LTR).not.toBe(Dir.RTL);
  });

  describe('isStrong', function() {

    it('should be negative for NEUTRAL', function() {
      expect(Dir.isStrong(Dir.NEUTRAL)).toBe(false);
    });

    it('should be positive for LTR/RTL', function() {
      expect(Dir.isStrong(Dir.RTL)).toBe(true);
      expect(Dir.isStrong(Dir.LTR)).toBe(true);
    });

  });

  describe('getHTMLDir', function() {

    it('should not accept NEUTRAL', function() {
      expect(() => Dir.getHTMLDir(Dir.NEUTRAL)).toThrow();
    });

    it('should accept LTR/RTL', function() {
      expect(Dir.getHTMLDir(Dir.RTL)).toBe('rtl');
      expect(Dir.getHTMLDir(Dir.LTR)).toBe('ltr');
    });

  });

  describe('getHTMLDirIfDifferent', function() {

    it('should accept LTR/RTL', function() {
      expect(Dir.getHTMLDirIfDifferent(Dir.RTL, Dir.RTL)).toBe(null);
      expect(Dir.getHTMLDirIfDifferent(Dir.RTL, Dir.LTR)).toBe('rtl');
      expect(Dir.getHTMLDirIfDifferent(Dir.LTR, Dir.RTL)).toBe('ltr');
      expect(Dir.getHTMLDirIfDifferent(Dir.LTR, Dir.LTR)).toBe(null);
    });

  });

});
