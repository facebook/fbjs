/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+unicode, oncall+jsinfra
 */

jest.disableAutomock();

var UnicodeUtilsExtra = require('UnicodeUtilsExtra');

describe('UnicodeUtilsExtra', function() {

  var str0 = '';
  var str1 = 'be bold';
  // UTF-16 encoding for <U+1D5EF, U+1D5FC, U+1D5F9, U+1D5F1>
  var str2 = 'be \uD835\uDDEF\uD835\uDDFC\uD835\uDDF9\uD835\uDDF1';


  describe('formatCodePoint', function() {

    function _expectFormatToBe(str, output) {
      expect(UnicodeUtilsExtra.formatCodePoint.call(null, str))
        .toBe(output);
    }

    it('should convert ASCII characters correctly', function() {
      _expectFormatToBe(0, 'U+0000');
      _expectFormatToBe(NaN, 'U+0000');

      _expectFormatToBe(65, 'U+0041');
      _expectFormatToBe(0x41, 'U+0041');
      _expectFormatToBe('A'.charCodeAt(0), 'U+0041');

      _expectFormatToBe(0x00FFFF, 'U+FFFF');
      _expectFormatToBe(0x010000, 'U+10000');
      _expectFormatToBe(0x0FFFFF, 'U+FFFFF');
      _expectFormatToBe(0x100000, 'U+100000');
      _expectFormatToBe(0x10FFFF, 'U+10FFFF');
    });

  });


  describe('getCodePointsFormatted', function() {

    function _expectCodePointsToBe(str, output) {
      expect(UnicodeUtilsExtra.getCodePointsFormatted.call(null, str))
        .toEqual(output);
    }

    it('should return an empty array on empty string', function() {
      _expectCodePointsToBe(str0, []);
    });

    it('should convert non-surrogate Unicode characters correctly', function() {
      _expectCodePointsToBe(str1,
        ['U+0062', 'U+0065', 'U+0020',
         'U+0062', 'U+006F', 'U+006C', 'U+0064']);
    });

    it('should convert surrogate Unicode characters correctly', function() {
      _expectCodePointsToBe(str2,
        ['U+0062', 'U+0065', 'U+0020',
         'U+1D5EF', 'U+1D5FC', 'U+1D5F9', 'U+1D5F1']);
    });

  });

});
