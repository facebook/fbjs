/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+unicode
 */

jest.disableAutomock();

var UnicodeHangulKorean = require('UnicodeHangulKorean');

describe('UnicodeHangulKorean', function() {

  describe('toConjoiningJamo', function() {

    function _expectConjoiningJamoToBe(input, output) {
      expect(UnicodeHangulKorean.toConjoiningJamo(input)).toBe(output);
    }

    it('should return ASCII characters as-is', function() {
      var str = '0123456789 abcdefghij ABCDEFGHIJ';
      _expectConjoiningJamoToBe(str, str);
    });

    it('should return non-Hangul characters as-is', function() {
      var str = '\u0080\u0090\u00A0\u00B0\u00C0\u00D0\u00E0\u00F0';
      _expectConjoiningJamoToBe(str, str);
    });

    it('should return initial consonants Hangul Jamo chars as-is', function() {
      var str = '\u1100\u1101\u1102\u1103\u1104\u1105\u1106\u1107'
              + '\u1108\u1109\u110A\u110B\u110C\u110D\u110E\u110F'
              + '\u1110\u1111\u1112';
      _expectConjoiningJamoToBe(str, str);
    });

    it('should return Hangul Jamo (vowels) chars as-is', function() {
      var str =       '\u1161\u1162\u1163\u1164\u1165\u1166\u1167'
              + '\u1168\u1169\u116A\u116B\u116C\u116D\u116E\u116F'
              + '\u1170\u1171\u1172\u1173\u1174\u1175';
      _expectConjoiningJamoToBe(str, str);
    });

    it('should return final consonants Hangul Jamo chars as-is', function() {
      var str = '\u11A8\u11A9\u11AA\u11AB\u11AC\u11AD\u11AE\u11AF'
              + '\u11B0\u11B1\u11B2\u11B3\u11B4\u11B5\u11B6\u11B7'
              + '\u11B8\u11B9\u11BA\u11BB\u11BC\u11BD\u11BE\u11BF'
              + '\u11C0\u11C1\u11C2';
      _expectConjoiningJamoToBe(str, str);
    });

    it('should convert Hangul Compatibility characters', function() {
      var str1 = '\u3131\u3140\u3150\u3160\u3170\u3180\u318E';
      var str2 = '\u1100\u111A\u1162\u1172\u11DF\u1147\u11A1';
      _expectConjoiningJamoToBe(str1, str2);
    });

    it('should decompose Hangul Syllable characters', function() {
      var str1 = '\uAC00\uAC01\uAC02\uAC03';
      var str2 = '\u1100\u1161'
               + '\u1100\u1161\u11A8'
               + '\u1100\u1161\u11A9'
               + '\u1100\u1161\u11AA';
      _expectConjoiningJamoToBe(str1, str2);
    });

    it('should decompose mixed scripts/encodings correctly', function() {
      var str1 = 'abc\u1101\u1161\u11A8\uAC00\uAC01\u3131\u3140\u3150';
      var str2 = 'abc\u1101\u1161\u11A8'
               + '\u1100\u1161'
               + '\u1100\u1161\u11A8'
               + '\u1100\u111A\u1162';
      _expectConjoiningJamoToBe(str1, str2);
    });

  });

});
