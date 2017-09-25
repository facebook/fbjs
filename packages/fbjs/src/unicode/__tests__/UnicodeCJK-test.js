/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+unicode
 * @nolint
 */

jest.disableAutomock();

var UnicodeCJK = require('UnicodeCJK');

describe('UnicodeCJK', function() {

  // Latin
  var s_ascii = 'samurai';
  var s_fullw = '\uFF53\uFF41\uFF4D\uFF55\uFF52\uFF41\uFF49'; // ｓａｍｕｒａｉ

  // Hiragana & Katakana
  var s_hira  = '\u3055\u3080\u3089\u3044'; // さむらい
  var s_kata  = '\u30B5\u30E0\u30E9\u30A4'; // サムライ

  // Hanzi/Kanji/Hanja
  var s_ideo  = '\u4F8D'; // 侍

  // Hangul
  var s_hang_syll = '\uC0AC\uBB34\uB77C\uC774'; // 사무라이


  describe('hasKana', function() {

    it('should return false for non-Kana chars', function() {
      expect(UnicodeCJK.hasKana(s_ascii)).toBe(false);
      expect(UnicodeCJK.hasKana(s_ideo)).toBe(false);
      expect(UnicodeCJK.hasKana(s_fullw)).toBe(false);
    });

    it('should return true for Kana chars', function() {
      expect(UnicodeCJK.hasKana(s_hira)).toBe(true);
      expect(UnicodeCJK.hasKana(s_ascii + s_hira)).toBe(true);
      expect(UnicodeCJK.hasKana(s_hira + s_ascii)).toBe(true);
      expect(UnicodeCJK.hasKana(s_kata)).toBe(true);
      expect(UnicodeCJK.hasKana(s_ascii + s_kata)).toBe(true);
      expect(UnicodeCJK.hasKana(s_kata + s_ascii)).toBe(true);
    });

  });


  describe('hasIdeograph', function() {

    it('should return false for non-CJK-Ideograph chars', function() {
      expect(UnicodeCJK.hasIdeograph(s_ascii)).toBe(false);
      expect(UnicodeCJK.hasIdeograph(s_hira)).toBe(false);
      expect(UnicodeCJK.hasIdeograph(s_kata)).toBe(false);
      expect(UnicodeCJK.hasIdeograph(s_fullw)).toBe(false);
    });

    it('should return true for CJK-Ideograph chars', function() {
      expect(UnicodeCJK.hasIdeograph(s_ideo)).toBe(true);
      expect(UnicodeCJK.hasIdeograph(s_ascii + s_ideo)).toBe(true);
      expect(UnicodeCJK.hasIdeograph(s_ideo + s_ascii)).toBe(true);
    });

  });


  describe('hasIdeoOrSyll', function() {

    it('should return false for non-CJK-Ideograph chars', function() {
      expect(UnicodeCJK.hasIdeoOrSyll(s_ascii)).toBe(false);
      expect(UnicodeCJK.hasIdeoOrSyll(s_fullw)).toBe(false);
    });

    it('should return true for CJK-Ideograph chars', function() {
      expect(UnicodeCJK.hasIdeoOrSyll(s_hira)).toBe(true);
      expect(UnicodeCJK.hasIdeoOrSyll(s_kata)).toBe(true);
      expect(UnicodeCJK.hasIdeoOrSyll(s_ideo)).toBe(true);
      expect(UnicodeCJK.hasIdeoOrSyll(s_hang_syll)).toBe(true);
      expect(UnicodeCJK.hasIdeoOrSyll(s_ascii + s_ideo)).toBe(true);
      expect(UnicodeCJK.hasIdeoOrSyll(s_ideo + s_ascii)).toBe(true);
    });

  });


  describe('hiraganaToKatakana', function() {

    it('should convert Hiragana to Katakana', function() {
      expect(UnicodeCJK.hiraganaToKatakana(s_hira)).toBe(s_kata);
      expect(UnicodeCJK.hiraganaToKatakana(s_hira + s_kata)
                                    ).toBe(s_kata + s_kata);
      expect(UnicodeCJK.hiraganaToKatakana(s_kata + s_hira)
                                    ).toBe(s_kata + s_kata);
      expect(UnicodeCJK.hiraganaToKatakana(s_hira + s_ascii)
                                    ).toBe(s_kata + s_ascii);
      expect(UnicodeCJK.hiraganaToKatakana(s_ascii + s_hira)
                                    ).toBe(s_ascii + s_kata);
    });

    it('should convert not touch anything besides Hiragana', function() {
      expect(UnicodeCJK.hiraganaToKatakana(s_ascii)).toBe(s_ascii);
      expect(UnicodeCJK.hiraganaToKatakana(s_fullw)).toBe(s_fullw);
      expect(UnicodeCJK.hiraganaToKatakana(s_kata)).toBe(s_kata);
      expect(UnicodeCJK.hiraganaToKatakana(s_ideo)).toBe(s_ideo);
      expect(UnicodeCJK.hiraganaToKatakana(s_hang_syll)).toBe(s_hang_syll);
    });

  });


  describe('isKanaWithTrailingLatin', function() {
    it('should only match a sequence of Kana with one trailing Latin', function() {
      expect(UnicodeCJK.isKanaWithTrailingLatin('s')).toBe(false);
      expect(UnicodeCJK.isKanaWithTrailingLatin('\u3055')).toBe(false);
      expect(UnicodeCJK.isKanaWithTrailingLatin('\u3055m')).toBe(true);
      expect(UnicodeCJK.isKanaWithTrailingLatin('\u3055\u3080')).toBe(false);
      expect(UnicodeCJK.isKanaWithTrailingLatin('\u3055\u3080r')).toBe(true);
      expect(UnicodeCJK.isKanaWithTrailingLatin('\u3055\u3080\u3089')
        ).toBe(false);
      expect(UnicodeCJK.isKanaWithTrailingLatin('\u3055\u3080\u3089\u3044')
        ).toBe(false);
    });
  });


  describe('kanaRemoveTrailingLatin', function() {
    it('should drop the trailing Latin character', function() {
      expect(UnicodeCJK.kanaRemoveTrailingLatin('s')
                                         ).toBe('s');
      expect(UnicodeCJK.kanaRemoveTrailingLatin('\u3055')
                                         ).toBe('\u3055');
      expect(UnicodeCJK.kanaRemoveTrailingLatin('\u3055m')
                                         ).toBe('\u3055');
      expect(UnicodeCJK.kanaRemoveTrailingLatin('\u3055\u3080')
                                         ).toBe('\u3055\u3080');
      expect(UnicodeCJK.kanaRemoveTrailingLatin('\u3055\u3080r')
                                         ).toBe('\u3055\u3080');
      expect(UnicodeCJK.kanaRemoveTrailingLatin('\u3055\u3080\u3089')
                                         ).toBe('\u3055\u3080\u3089');
      expect(UnicodeCJK.kanaRemoveTrailingLatin('\u3055\u3080\u3089\u3044')
                                         ).toBe('\u3055\u3080\u3089\u3044');
    });
  });

});
