/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+unicode, oncall+jsinfra
 */

jest.disableAutomock();

var UnicodeUtils = require('UnicodeUtils');

describe('UnicodeUtils', function() {

  var str0 = '';
  var str1 = 'be bold';
  // UTF-16 encoding for <U+1D5EF, U+1D5FC, U+1D5F9, U+1D5F1>
  var str2_bo = '\uD835\uDDEF\uD835\uDDFC';
  var str2_ld = '\uD835\uDDF9\uD835\uDDF1';
  var str2_bold = str2_bo + str2_ld;
  var str2 = 'be ' + str2_bold;

  describe('isCodeUnitInSurrogateRange', function() {
    function _expectResultToBe(codeUnit, result) {
      expect(UnicodeUtils.isCodeUnitInSurrogateRange.call(null, codeUnit))
        .toBe(result);
    }

    it('should return false for code units outside range', function() {
      _expectResultToBe(str1.charCodeAt(0), false);
      _expectResultToBe(str1.charCodeAt(2), false);
      _expectResultToBe(str2.charCodeAt(0), false);
    });

    it('should return true for code units within range', function() {
      _expectResultToBe(str2_bo.charCodeAt(0), true);
      _expectResultToBe(str2_bo.charCodeAt(1), true);
      _expectResultToBe(str2_ld.charCodeAt(2), true);
      _expectResultToBe(str2_ld.charCodeAt(3), true);
      _expectResultToBe(str2_bold.charCodeAt(5), true);
    });
  });

  describe('isSurrogatePair', function() {
    function _expectResultToBe(str, index, result) {
      expect(UnicodeUtils.isSurrogatePair.call(null, str, index)).toBe(result);
    }

    it('should return true when pointing at surrogate pairs', function() {
      _expectResultToBe(str2, 3, true);
      _expectResultToBe(str2, 5, true);
      _expectResultToBe(str2, 7, true);
      _expectResultToBe(str2, 9, true);
    });

    it('should return false when not pointing at surrogate pairs', function() {
      _expectResultToBe(str1, 0, false);
      _expectResultToBe(str1, 1, false);
      _expectResultToBe(str1, 2, false);
      _expectResultToBe(str1, 3, false);
      _expectResultToBe(str1, 4, false);
      _expectResultToBe(str1, 5, false);
      _expectResultToBe(str1, 6, false);

      _expectResultToBe(str2, 0, false);
      _expectResultToBe(str2, 1, false);
      _expectResultToBe(str2, 2, false);
      _expectResultToBe(str2, 4, false);
      _expectResultToBe(str2, 6, false);
      _expectResultToBe(str2, 8, false);
      _expectResultToBe(str2, 10, false);
    });
  });

  describe('strlen', function() {

    function _expectLengthToBe(str, output) {
      expect(UnicodeUtils.strlen.call(null, str))
        .toBe(output);
    }

    it('should return zero on empty string', function() {
      _expectLengthToBe(str0, 0);
    });

    it('should count non-surrogate Unicode characters correctly', function() {
      _expectLengthToBe(str1, 7);
    });

    it('should count surrogate Unicode characters correctly', function() {
      _expectLengthToBe(str2, 7);
    });

  });


  describe('substr', function() {

    function _expectSubstrToMatch(str, start, end, output) {
      expect(UnicodeUtils.substr.call(null, str, start, end))
        .toBe(output);
    }

    it('should convert NaN to zero', function() {
      _expectSubstrToMatch(str1, NaN, 2, 'be');
      _expectSubstrToMatch(str1, 2, NaN, '');
    });

    it('should default optional length parameter to Infinity', function() {
      _expectSubstrToMatch(str1, 0, undefined, str1);
      _expectSubstrToMatch(str1, 3, undefined, 'bold');
      _expectSubstrToMatch(str2, 0, undefined, str2);
    });

    it('should return empty string on zero/negative length', function() {
      _expectSubstrToMatch(str1, 0, 0, '');
      _expectSubstrToMatch(str2, 0, 0, '');
      _expectSubstrToMatch(str1, 0, -1, '');
      _expectSubstrToMatch(str2, 0, -1, '');
      _expectSubstrToMatch(str1, 0, -Infinity, '');
      _expectSubstrToMatch(str2, 0, -Infinity, '');
    });

    it('should return empty string on empty string', function() {
      _expectSubstrToMatch(str0, -10, 0, '');
      _expectSubstrToMatch(str0, 0, 0, '');
      _expectSubstrToMatch(str0, 10, 0, '');
      _expectSubstrToMatch(str0, -10, 10, '');
      _expectSubstrToMatch(str0, 0, 10, '');
      _expectSubstrToMatch(str0, 10, 10, '');
    });

    it('should return empty string on large starting position', function() {
      _expectSubstrToMatch(str0, 1, 10, '');
      _expectSubstrToMatch(str1, 7, 10, '');
      _expectSubstrToMatch(str2, 7, 10, '');
      _expectSubstrToMatch(str1, Infinity, 10, '');
      _expectSubstrToMatch(str2, Infinity, 10, '');
    });

    it('should count non-surrogate Unicode characters correctly', function() {
      _expectSubstrToMatch(str1, 0, 2, 'be');
      _expectSubstrToMatch(str1, 3, 2, 'bo');
      _expectSubstrToMatch(str1, 3, 4, 'bold');
      _expectSubstrToMatch(str1, 5, 2, 'ld');
    });

    it('should count surrogate Unicode characters correctly', function() {
      _expectSubstrToMatch(str2, 0, 2, 'be');
      _expectSubstrToMatch(str2, 3, 2, str2_bo);
      _expectSubstrToMatch(str2, 3, 4, str2_bold);
      _expectSubstrToMatch(str2, 5, 2, str2_ld);
    });

    it('should go backwards from the end with negative start', function() {
      _expectSubstrToMatch(str1, -Infinity, 2, 'be');
      _expectSubstrToMatch(str1, -7, 2, 'be');
      _expectSubstrToMatch(str1, -4, 2, 'bo');
      _expectSubstrToMatch(str1, -4, 4, 'bold');
      _expectSubstrToMatch(str1, -2, 2, 'ld');
      _expectSubstrToMatch(str2, -Infinity, 2, 'be');
      _expectSubstrToMatch(str2, -7, 2, 'be');
      _expectSubstrToMatch(str2, -4, 2, str2_bo);
      _expectSubstrToMatch(str2, -4, 4, str2_bold);
      _expectSubstrToMatch(str2, -2, 2, str2_ld);
    });

  });


  describe('substring', function() {

    function _expectSubstringToMatch(str, start, end, output) {
      expect(UnicodeUtils.substring.call(null, str, start, end))
        .toBe(output);
    }

    it('should convert NaN to zero', function() {
      _expectSubstringToMatch(str1, NaN, 2, 'be');
      _expectSubstringToMatch(str1, 2, NaN, 'be');
    });

    it('should default optional length parameter to Infinity', function() {
      _expectSubstringToMatch(str1, 0, undefined, str1);
      _expectSubstringToMatch(str1, 3, undefined, 'bold');
      _expectSubstringToMatch(str2, 0, undefined, str2);
    });

    it('should return empty string on zero/negative length', function() {
      _expectSubstringToMatch(str1, 0, 0, '');
      _expectSubstringToMatch(str2, 0, 0, '');
      _expectSubstringToMatch(str1, 0, -1, '');
      _expectSubstringToMatch(str2, 0, -1, '');
      _expectSubstringToMatch(str1, 0, -Infinity, '');
      _expectSubstringToMatch(str2, 0, -Infinity, '');
    });

    it('should return empty string on empty string', function() {
      _expectSubstringToMatch(str0, -10, 0, '');
      _expectSubstringToMatch(str0, 0, 0, '');
      _expectSubstringToMatch(str0, 10, 0, '');
      _expectSubstringToMatch(str0, -10, 10, '');
      _expectSubstringToMatch(str0, 0, 10, '');
      _expectSubstringToMatch(str0, 10, 10, '');
    });

    it('should count non-surrogate Unicode characters correctly', function() {
      _expectSubstringToMatch(str1, 0, 2, 'be');
      _expectSubstringToMatch(str1, 3, 5, 'bo');
      _expectSubstringToMatch(str1, 3, 7, 'bold');
      _expectSubstringToMatch(str1, 5, 7, 'ld');
    });

    it('should count surrogate Unicode characters correctly', function() {
      _expectSubstringToMatch(str2, 0, 2, 'be');
      _expectSubstringToMatch(str2, 3, 5, str2_bo);
      _expectSubstringToMatch(str2, 3, 7, str2_bold);
      _expectSubstringToMatch(str2, 5, 7, str2_ld);
    });

    it('should swap start and end if appropriate', function() {
      _expectSubstringToMatch(str1, 2, 0, 'be');
      _expectSubstringToMatch(str1, 5, 3, 'bo');
      _expectSubstringToMatch(str1, 7, 3, 'bold');
      _expectSubstringToMatch(str1, 7, 5, 'ld');
      _expectSubstringToMatch(str2, 2, 0, 'be');
      _expectSubstringToMatch(str2, 5, 3, str2_bo);
      _expectSubstringToMatch(str2, 7, 3, str2_bold);
      _expectSubstringToMatch(str2, 7, 5, str2_ld);
    });

  });


  describe('getCodePoints', function() {

    function _expectCodePointsToBe(str, output) {
      expect(UnicodeUtils.getCodePoints.call(null, str))
        .toEqual(output);
    }

    it('should return an empty array on empty string', function() {
      _expectCodePointsToBe(str0, []);
    });

    it('should convert non-surrogate Unicode characters correctly', function() {
      _expectCodePointsToBe(str1,
        [0x62, 0x65, 0x20, 0x62, 0x6F, 0x6C, 0x64]);
    });

    it('should convert surrogate Unicode characters correctly', function() {
      _expectCodePointsToBe(str2,
        [0x62, 0x65, 0x20, 0x1D5EF, 0x1D5FC, 0x1D5F9, 0x1D5F1]);
    });

  });

});
