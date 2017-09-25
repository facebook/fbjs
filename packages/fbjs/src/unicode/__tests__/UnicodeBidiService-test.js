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
var UnicodeBidiService = require('UnicodeBidiService');

describe('UnicodeBidiService', function() {

  var sEmpty        = '';
  var sAsciiPuncts  = '([{}])';
  var sAsciiDigits  = '1234567890';
  var sAsciiLetters = 'ascii';
  var sFrench  = 'Fran\u00E7ais';
  var sHebrew  = '\u05D0\u05DC\u05E4\u05D1\u05D9\u05EA';
  var sArabic  = '\u0639\u0631\u0628\u064A';
  var sKorean  = '\uD55C\uAD6D\uC5B4';

  describe('ctor', function() {

    it('should set default dir from global direction', function() {
      new UnicodeBidiService();
    });

    it('should accept strong default directions', function() {
      new UnicodeBidiService(Dir.LTR);
      new UnicodeBidiService(Dir.RTL);
    });

  });

  describe('reset', function() {

    it('should reset to default direction (LTR)', function() {
      var bidiService = new UnicodeBidiService(Dir.LTR);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.LTR);
      expect(bidiService.getDirection(sHebrew)).toBe(Dir.RTL);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.RTL);

      bidiService.reset();
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.LTR);

      bidiService.reset();
      expect(bidiService.getDirection(sArabic)).toBe(Dir.RTL);

      bidiService.reset();
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.LTR);
    });

    it('should reset to default direction (RTL)', function() {
      var bidiService = new UnicodeBidiService(Dir.RTL);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.RTL);
      expect(bidiService.getDirection(sFrench)).toBe(Dir.LTR);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.LTR);

      bidiService.reset();
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.RTL);

      bidiService.reset();
      expect(bidiService.getDirection(sKorean)).toBe(Dir.LTR);

      bidiService.reset();
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.RTL);
    });

  });

  describe('getDirection', function() {
    it('should remember the last direction', function() {
      var bidiService = new UnicodeBidiService();

      expect(bidiService.getDirection(sAsciiLetters)).toBe(Dir.LTR);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.LTR);
      expect(bidiService.getDirection(sAsciiPuncts)).toBe(Dir.LTR);
      expect(bidiService.getDirection(sAsciiDigits)).toBe(Dir.LTR);

      expect(bidiService.getDirection(sHebrew)).toBe(Dir.RTL);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.RTL);
      expect(bidiService.getDirection(sAsciiPuncts)).toBe(Dir.RTL);
      expect(bidiService.getDirection(sAsciiDigits)).toBe(Dir.RTL);

      expect(bidiService.getDirection(sFrench)).toBe(Dir.LTR);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.LTR);

      expect(bidiService.getDirection(sArabic)).toBe(Dir.RTL);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.RTL);

      expect(bidiService.getDirection(sKorean)).toBe(Dir.LTR);
      expect(bidiService.getDirection(sEmpty)).toBe(Dir.LTR);
    });
  });

});
