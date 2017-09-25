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
var UnicodeBidi = require('UnicodeBidi');

describe('UnicodeBidi', function() {

  var sEmpty        = '';
  var sAsciiPuncts  = '([{}])';
  var sAsciiDigits  = '1234567890';
  var sAsciiLetters = 'ascii';
  var sFrench  = 'Fran\u00E7ais';
  var sGreek   = '\u03B5\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC';
  var sRussian = '\u0440\u0443\u0301\u0441\u0441\u043A\u0438\u0439';
  var sHebrew  = '\u05D0\u05DC\u05E4\u05D1\u05D9\u05EA';
  var sArabic  = '\u0639\u0631\u0628\u064A';
  var sKorean  = '\uD55C\uAD6D\uC5B4';


  describe('firstStrongChar', function() {
    var fsc = UnicodeBidi.firstStrongChar;

    it('should return null for non-Strong characters', function() {
      expect(fsc(sEmpty)).toBeNull();
      expect(fsc(sAsciiPuncts)).toBeNull();
      expect(fsc(sAsciiDigits)).toBeNull();
    });

    it('should detect leading strong chars', function() {
      function test(s) {
        expect(fsc(s)).toBe(s[0]);
      }

      test(sAsciiLetters);
      test(sFrench);
      test(sGreek);
      test(sRussian);
      test(sHebrew);
      test(sArabic);
      test(sKorean);
    });

    it('should skip non-Strong characters', function() {
      function test(s) {
        expect(fsc(sAsciiDigits + sAsciiPuncts + s)).toBe(s[0]);
      }

      test(sAsciiLetters);
      test(sFrench);
      test(sGreek);
      test(sRussian);
      test(sHebrew);
      test(sArabic);
      test(sKorean);
    });
  });


  describe('firstStrongCharDir', function() {
    var fsd = UnicodeBidi.firstStrongCharDir;

    it('should return NEUTRAL for non-Strong characters', function() {
      expect(fsd(sEmpty)).toBe(Dir.NEUTRAL);
      expect(fsd(sAsciiPuncts)).toBe(Dir.NEUTRAL);
      expect(fsd(sAsciiDigits)).toBe(Dir.NEUTRAL);
    });

    it('should return LTR for English (ASCII)', function() {
      expect(fsd(sAsciiLetters)).toBe(Dir.LTR);
      expect(fsd(sAsciiLetters + sHebrew)).toBe(Dir.LTR);
      expect(fsd(sAsciiLetters + sArabic)).toBe(Dir.LTR);
      expect(fsd(sAsciiLetters + sAsciiPuncts)).toBe(Dir.LTR);
      expect(fsd(sAsciiLetters + sAsciiDigits)).toBe(Dir.LTR);

      expect(fsd(sAsciiPuncts + sAsciiLetters)).toBe(Dir.LTR);
      expect(fsd(sAsciiDigits + sAsciiLetters)).toBe(Dir.LTR);
    });

    it('should return LTR for French', function() {
      expect(fsd(sFrench)).toBe(Dir.LTR);
      expect(fsd(sFrench + sHebrew)).toBe(Dir.LTR);
      expect(fsd(sFrench + sArabic)).toBe(Dir.LTR);
    });

    it('should return LTR for Cyrillic', function() {
      expect(fsd(sGreek)).toBe(Dir.LTR);
      expect(fsd(sGreek + sHebrew)).toBe(Dir.LTR);
      expect(fsd(sGreek + sArabic)).toBe(Dir.LTR);
    });

    it('should return LTR for Greek', function() {
      expect(fsd(sRussian)).toBe(Dir.LTR);
      expect(fsd(sRussian + sHebrew)).toBe(Dir.LTR);
      expect(fsd(sRussian + sArabic)).toBe(Dir.LTR);

    });

    it('should return LTR for Korean', function() {
      expect(fsd(sKorean)).toBe(Dir.LTR);
      expect(fsd(sKorean + sHebrew)).toBe(Dir.LTR);
      expect(fsd(sKorean + sArabic)).toBe(Dir.LTR);
    });

    it('should return RTL for Hebrew', function() {
      expect(fsd(sHebrew)).toBe(Dir.RTL);
      expect(fsd(sHebrew + sAsciiLetters)).toBe(Dir.RTL);
      expect(fsd(sHebrew + sFrench)).toBe(Dir.RTL);
      expect(fsd(sHebrew + sGreek)).toBe(Dir.RTL);
      expect(fsd(sHebrew + sRussian)).toBe(Dir.RTL);

      expect(fsd(sAsciiPuncts + sHebrew)).toBe(Dir.RTL);
      expect(fsd(sAsciiDigits + sHebrew)).toBe(Dir.RTL);
    });

    it('should return RTL for Arabic', function() {
      expect(fsd(sArabic)).toBe(Dir.RTL);
      expect(fsd(sArabic + sAsciiLetters)).toBe(Dir.RTL);
      expect(fsd(sArabic + sFrench)).toBe(Dir.RTL);
      expect(fsd(sArabic + sGreek)).toBe(Dir.RTL);
      expect(fsd(sArabic + sRussian)).toBe(Dir.RTL);

      expect(fsd(sAsciiPuncts + sArabic)).toBe(Dir.RTL);
      expect(fsd(sAsciiDigits + sArabic)).toBe(Dir.RTL);
    });

  });


  describe('resolveBlockDir', function() {
    var rbd = UnicodeBidi.resolveBlockDir;

    it('should return NEUTRAL for non-Strong characters', function() {
      expect(rbd(sEmpty)).toBe(Dir.NEUTRAL);
      expect(rbd(sEmpty, Dir.NEUTRAL)).toBe(Dir.NEUTRAL);
      expect(rbd(sEmpty, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sEmpty, Dir.RTL)).toBe(Dir.RTL);

      expect(rbd(sAsciiPuncts, Dir.NEUTRAL)).toBe(Dir.NEUTRAL);
      expect(rbd(sAsciiPuncts, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sAsciiPuncts, Dir.RTL)).toBe(Dir.RTL);

      expect(rbd(sAsciiDigits, Dir.NEUTRAL)).toBe(Dir.NEUTRAL);
      expect(rbd(sAsciiDigits, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sAsciiDigits, Dir.RTL)).toBe(Dir.RTL);
    });

    it('should return LTR for English (ASCII)', function() {
      expect(rbd(sAsciiLetters)).toBe(Dir.LTR);
      expect(rbd(sAsciiLetters, Dir.NEUTRAL)).toBe(Dir.LTR);
      expect(rbd(sAsciiLetters, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sAsciiLetters, Dir.RTL)).toBe(Dir.LTR);
    });

    it('should return LTR for French', function() {
      expect(rbd(sFrench, Dir.NEUTRAL)).toBe(Dir.LTR);
      expect(rbd(sFrench, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sFrench, Dir.RTL)).toBe(Dir.LTR);
    });

    it('should return LTR for Cyrillic', function() {
      expect(rbd(sGreek, Dir.NEUTRAL)).toBe(Dir.LTR);
      expect(rbd(sGreek, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sGreek, Dir.RTL)).toBe(Dir.LTR);
    });

    it('should return LTR for Greek', function() {
      expect(rbd(sRussian, Dir.NEUTRAL)).toBe(Dir.LTR);
      expect(rbd(sRussian, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sRussian, Dir.RTL)).toBe(Dir.LTR);
    });

    it('should return LTR for Korean', function() {
      expect(rbd(sKorean, Dir.NEUTRAL)).toBe(Dir.LTR);
      expect(rbd(sKorean, Dir.LTR)).toBe(Dir.LTR);
      expect(rbd(sKorean, Dir.RTL)).toBe(Dir.LTR);
    });

    it('should return RTL for Hebrew', function() {
      expect(rbd(sHebrew, Dir.NEUTRAL)).toBe(Dir.RTL);
      expect(rbd(sHebrew, Dir.LTR)).toBe(Dir.RTL);
      expect(rbd(sHebrew, Dir.RTL)).toBe(Dir.RTL);
    });

    it('should return RTL for Arabic', function() {
      expect(rbd(sArabic, Dir.NEUTRAL)).toBe(Dir.RTL);
      expect(rbd(sArabic, Dir.LTR)).toBe(Dir.RTL);
      expect(rbd(sArabic, Dir.RTL)).toBe(Dir.RTL);
    });

  });

  describe('getDirection', function() {
    var getDir = UnicodeBidi.getDirection;

    it('should fallback for non-Strong characters', function() {
      expect(getDir(sEmpty)).toBe(Dir.LTR);
      expect(getDir(sEmpty, Dir.LTR)).toBe(Dir.LTR);
      expect(getDir(sEmpty, Dir.RTL)).toBe(Dir.RTL);
      expect(() => getDir(sEmpty, Dir.NEUTRAL)).toThrow();
    });

    it('should return LTR for Strong LTR characters', function() {
      expect(getDir(sFrench)).toBe(Dir.LTR);
    });

    it('should return RTL for Strong RTL characters', function() {
      expect(getDir(sHebrew)).toBe(Dir.RTL);
    });

  });

  describe('isDirectionLTR', function() {
    var isDirLTR = UnicodeBidi.isDirectionLTR;

    it('should fallback for non-Strong characters', function() {
      expect(isDirLTR(sEmpty)).toBe(true);
      expect(isDirLTR(sEmpty, Dir.LTR)).toBe(true);
      expect(isDirLTR(sEmpty, Dir.RTL)).toBe(false);
      expect(() => isDirLTR(sEmpty, Dir.NEUTRAL)).toThrow();
    });

    it('should return true for Strong LTR characters', function() {
      expect(isDirLTR(sFrench)).toBe(true);
    });

    it('should return false for Strong RTL characters', function() {
      expect(isDirLTR(sHebrew)).toBe(false);
    });

  });

  describe('isDirectionRTL', function() {
    var isDirRTL = UnicodeBidi.isDirectionRTL;

    it('should fallback for non-Strong characters', function() {
      expect(isDirRTL(sEmpty)).toBe(false);
      expect(isDirRTL(sEmpty, Dir.LTR)).toBe(false);
      expect(isDirRTL(sEmpty, Dir.RTL)).toBe(true);
      expect(() => isDirRTL(sEmpty, Dir.NEUTRAL)).toThrow();
    });

    it('should return false for Strong LTR characters', function() {
      expect(isDirRTL(sFrench)).toBe(false);
    });

    it('should return true for Strong RTL characters', function() {
      expect(isDirRTL(sHebrew)).toBe(true);
    });

  });

});
