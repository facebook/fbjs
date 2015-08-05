/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.dontMock('areEqual');

var areEqual = require('areEqual');

describe('areEqual', function() {
  function First() {
    this.value = 1;
  }
  First.prototype.value = 1;

  function Second() {
    this.value = 1;
  }
  Second.prototype.value = 2;

  it('works with basic equality and identity comparisons', () => {
    // `null` is equal to `null`
    expect(areEqual(null, null)).toBe(true);
    // `undefined` is equal to `undefined`
    expect(areEqual()).toBe(true);
    // `0` is not equal to `-0`
    expect(areEqual(0, -0)).toBe(false);
    // Commutative equality is implemented for `0` and `-0`
    expect(areEqual(-0, 0)).toBe(false);
    // `null` is not equal to `undefined`
    expect(areEqual(null, undefined)).toBe(false);
    // Commutative equality is implemented for `null` and `undefined`
    expect(areEqual(undefined, null)).toBe(false);
  });

  it('works with string object and primitive comparisons', () => {
    // Identical string primitives are equal
    expect(areEqual('Curly', 'Curly')).toBe(true);
    // String objects with identical primitive values are equal
    expect(areEqual(String('Curly'), String('Curly'))).toBe(true);
    // String primitives and their corresponding object wrappers are equal
    expect(areEqual(String('Curly'), 'Curly')).toBe(true);
    // Commutative equality is implemented for string objects and primitives
    expect(areEqual('Curly', String('Curly'))).toBe(true);
    // String primitives with different values are not equal
    expect(areEqual('Curly', 'Larry')).toBe(false);
    // String objects with different primitive values are not equal
    expect(areEqual(String('Curly'), String('Larry'))).toBe(false);
    // String objects and objects with a custom `toString` method are not equal
    expect(areEqual(String('Curly'), {toString() { return 'Curly'; }}))
      .toBe(false);
  });

  it('works with number object and primitive comparisons.', () => {
    // Identical number primitives are equal
    expect(areEqual(75, 75)).toBe(true);
    // Number objects with identical primitive values are equal
    expect(areEqual(Number(75), Number(75))).toBe(true);
    // Number primitives and their corresponding object wrappers are equal
    expect(areEqual(75, Number(75))).toBe(true);
    // Commutative equality is implemented for number objects and primitives
    expect(areEqual(Number(75), 75)).toBe(true);
    // `new Number(0)` and `-0` are not equal
    expect(areEqual(Number(0), -0)).toBe(false);
    // Commutative equality is implemented for `new Number(0)` and `-0`
    expect(areEqual(0, Number(-0))).toBe(false);
    // Number objects with different primitive values are not equal
    expect(areEqual(Number(75), Number(63))).toBe(false);
    // Number objects and objects with a `valueOf` method are not equal
    expect(areEqual(Number(63), {valueOf: function() { return 63; }}))
    .toBe(false);
  });

  it('works with comparisons involving `NaN`', () => {
    // `NaN` is equal to `NaN`
    expect(areEqual(NaN, NaN)).toBe(false);
    // A number primitive is not equal to `NaN`
    expect(areEqual(61, NaN)).toBe(false);
    // A number object is not equal to `NaN`
    expect(areEqual(Number(79), NaN)).toBe(false);
    // `Infinity` is not equal to `NaN`
    expect(areEqual(Infinity, NaN)).toBe(false);
  });

  it('works with boolean object and primitive comparisons', () => {
    // Identical boolean primitives are equal
    expect(areEqual(true, true)).toBe(true);
    // Boolean objects with identical primitive values are equal
    expect(areEqual(Boolean(), Boolean())).toBe(true);
    // Boolean primitives and their corresponding object wrappers are equal
    expect(areEqual(true, Boolean(true))).toBe(true);
    // Commutative equality is implemented for booleans
    expect(areEqual(Boolean(true), true)).toBe(true);
    // Boolean objects with different primitive values are not equal
    expect(areEqual(Boolean(true), Boolean())).toBe(false);
  });

  it('works with common type coercion', () => {
    // Boolean objects are not equal to the boolean primitive `true`
    expect(areEqual(true, Boolean(false))).toBe(false);
    // String and number primitives with like values are not equal
    expect(areEqual('75', 75)).toBe(false);
    // String and number objects with like values are not equal
    expect(areEqual(Number(63), String(63))).toBe(false);
    // Commutative equality is implemented for like string and number values
    expect(areEqual(75, '75')).toBe(false);
    // Number and string primitives with like values are not equal
    expect(areEqual(0, '')).toBe(false);
    // Number and boolean primitives with like values are not equal
    expect(areEqual(1, true)).toBe(false);
    // Boolean and number objects with like values are not equal
    expect(areEqual(Boolean(false), Number(0))).toBe(false);
    // Boolean primitives and string objects with like values are not equal
    expect(areEqual(false, String(''))).toBe(false);
    // Dates and their corresponding numeric primitive values are not equal
    expect(areEqual(12564504e5, new Date(2009, 9, 25))).toBe(false);
  });

  it('works with dates', () => {
    // Date objects referencing identical times are equal
    expect(areEqual(new Date(2009, 9, 25), new Date(2009, 9, 25)))
    .toBe(true);
    // Date objects referencing different times are not equal
    expect(areEqual(new Date(2009, 9, 25), new Date(2009, 11, 13)))
    .toBe(false);
    // Date objects and objects with a `getTime` method are not equal
    expect(areEqual(new Date(2009, 11, 13), {
      getTime: function() {
        return 12606876e5;
      }
    })).toBe(false);
    // Invalid dates are not equal
    expect(areEqual(new Date('Curly'), new Date('Curly'))).toBe(false);
  });

  it('works with functions', () => {
    // Different functions with identical bodies and source code
    // representations are not equal
    expect(areEqual(First, Second)).toBe(false);
  });

  it('works with regular expressions', () => {
    // RegExps with equivalent patterns and flags are equal
    expect(areEqual(/(?:)/gim, /(?:)/gim)).toBe(true);
    // RegExps with equivalent patterns and different flags are not equal
    expect(areEqual(/(?:)/g, /(?:)/gi)).toBe(false);
    // RegExps with different patterns and equivalent flags are not equal
    expect(areEqual(/Moe/gim, /Curly/gim)).toBe(false);
    // Commutative equality is implemented for RegExps
    expect(areEqual(/(?:)/gi, /(?:)/g)).toBe(false);
    // RegExps and RegExp-like objects are not equal
    expect(areEqual(/Curly/g,
        {source: 'Larry', global: true, ignoreCase: false, multiline: false}))
    .toBe(false);
  });

  it('works with empty arrays, array-like objects, and object literals',
    function() {
    // Empty object literals are equal
    expect(areEqual({}, {})).toBe(true);
    // Empty array literals are equal
    expect(areEqual([], [])).toBe(true);
    // Empty nested arrays and objects are equal
    expect(areEqual([{}], [{}])).toBe(true);
    // Array-like objects and arrays are not equal
    expect(areEqual({length: 0}, [])).toBe(false);
    // Commutative equality is implemented for array-like objects
    expect(areEqual([], {length: 0})).toBe(false);
    // Object literals and array literals are not equal
    expect(areEqual({}, [])).toBe(false);
    // Commutative equality is implemented for objects and arrays
    expect(areEqual([], {})).toBe(false);
  });

  it('works with arrays containing primitive and object values',
    function() {
    // Arrays containing identical primitives are equal
    expect(areEqual([1, 'Larry', true], [1, 'Larry', true])).toBe(true);
    // Arrays containing equivalent elements are equal
    expect(areEqual([(/Moe/g), new Date(2009, 9, 25)], [(/Moe/g),
      new Date(2009, 9, 25)])).toBe(true);
  });

  it('works with multidimentional arrays', () => {
    var a = [Number(47), false, 'Larry', /Moe/, new Date(2009, 11, 13),
      ['running', 'biking', String('programming')], {a: 47}];
    var b = [Number(47), false, 'Larry', /Moe/, new Date(2009, 11, 13),
      ['running', 'biking', String('programming')], {a: 47}];
    var c = [Number(47), false, 'Larry', /Moe/, new Date(2009, 11, 13),
      ['running', 'biking', String('programming')], [32]];
    // Arrays containing nested arrays and objects are recursively compared
    expect(areEqual(a, b)).toBe(true);
    expect(areEqual(a, c)).toBe(false);
    // Arrays containing equivalent elements and different non-numeric
    // properties are equal
    expect(areEqual(a, b)).toBe(true);
    a.push('White Rocks');
    // Arrays of different lengths are not equal
    expect(areEqual(a, b)).toBe(false);
    a.push('East Boulder');
    b.push('Gunbarrel Ranch', 'Teller Farm');
    // Arrays of identical lengths containing different elements are not equal
    expect(areEqual(a, b)).toBe(false);
  });

  it('works with sparse arrays', () => {
    // Sparse arrays of identical lengths are equal
    expect(areEqual(Array(3), Array(3))).toBe(true);
    // Sparse arrays of different lengths are not equal when both are empty
    expect(areEqual(Array(3), Array(6))).toBe(false);
  });

  it('works with simple objects', function() {
    // Objects containing identical primitives are equal
    expect(areEqual({a: 'Curly', b: 1, c: true}, {a: 'Curly', b: 1, c: true}))
      .toBe(true);
    // Objects containing equivalent members are equal
    expect(areEqual({b: new Date(2009, 11, 13)}, {b: new Date(2009, 11, 13)}))
      .toBe(true);
    expect(areEqual({a: /Curly/g}, {a: /Curly/g})).toBe(true);
    expect(areEqual({a: /Curly/g}, {b: /Curly/g})).toBe(false);
    expect(areEqual({a: /Curly/g, b: new Date(2009, 11, 13)},
        {a: /Curly/g, b: new Date(2009, 11, 13)})).toBe(true);
    expect(areEqual({a: 1}, {b: 2})).toBe(false);
    // Objects of identical sizes with different values are not equal
    expect(areEqual({a: 63, b: 75}, {a: 61, b: 55})).toBe(false);
    // Objects of identical sizes with different property names are not equal
    expect(areEqual({a: 63, b: 75}, {a: 61, c: 55})).toBe(false);
    // Objects of different sizes are not equal
    expect(areEqual({a: 1, b: 2}, {a: 1})).toBe(false);
    // Commutative equality is implemented for objects
    expect(areEqual({a: 1}, {a: 1, b: 2})).toBe(false);
    // Objects with identical keys and different values are not equivalent
    expect(areEqual({x: 1, z: 3}, {x: 1, z: 2})).toBe(false);
    // `A` contains nested objects and arrays.
    var a = {
      name: String('Moe Howard'),
      age: Number(77),
      stooge: true,
      hobbies: ['acting'],
      film: {
        name: 'Sing a Song of Six Pants',
        release: new Date(1947, 9, 30),
        stars: [String('Larry Fine'), 'Shemp Howard'],
        minutes: Number(16),
        seconds: 54
      }
    };
    // `B` contains equivalent nested objects and arrays.
    var b = {
      name: String('Moe Howard'),
      age: Number(77),
      stooge: true,
      hobbies: ['acting'],
      film: {
        name: 'Sing a Song of Six Pants',
        release: new Date(1947, 9, 30),
        stars: [String('Larry Fine'), 'Shemp Howard'],
        minutes: Number(16),
        seconds: 54
      }
    };
    // Objects with nested equivalent members are recursively compared
    expect(areEqual(a, b)).toBe(true);
    b.hobbies = ['swimming'];
    expect(areEqual(a, b)).toBe(false);
  });

  it('works with instances', () => {
    function First() {
      this.value = 1;
    }
    First.prototype.value = 1;
    function Second() {
      this.value = 1;
    }
    Second.prototype.value = 2;
    // Object instances are equal
    expect(areEqual(new First(), new First())).toBe(true);
    // Objects with different constructors and identical own properties
    // are not equal
    expect(areEqual(new First(), new Second())).toBe(false);
    // Object instances and objects sharing equivalent properties
    // are not equal
    expect(areEqual({value: 1}, new First())).toBe(false);
    // The prototype chain of objects should not be examined
    expect(areEqual({value: 2}, new Second())).toBe(false);
  });

  it('works with circular arrays', () => {
    var a, b;
    (a = []).push(a);
    (b = []).push(b);
    // Arrays containing circular references are equal
    expect(areEqual(a, b)).toBe(true);
    a.push(String('Larry'));
    b.push(String('Larry'));
    // Arrays containing circular references and equivalent properties
    // are equal
    expect(areEqual(a, b)).toBe(true);
    a.push('Shemp');
    b.push('Curly');
    // Arays containing circular references and different properties
    // are not equal
    expect(areEqual(a, b)).toBe(false);
    a = ['everything is checked but', 'this', 'is not'];
    a[1] = a;
    b = ['everything is checked but', ['this', 'array'], 'is not'];
    // Comparison of circular references with non-circular references
    // are not equal
    expect(areEqual(a, b)).toBe(false);
  });

  it('works with circular objects', () => {
    var a, b;
    a = {abc: null};
    b = {abc: null};
    a.abc = a;
    b.abc = b;
    // Objects containing circular references are equal
    expect(areEqual(a, b)).toBe(true);
    a.def = 75;
    b.def = 75;
    // Objects containing circular references and equivalent properties
    // are equal
    expect(areEqual(a, b)).toBe(true);

    a.def = Number(75);
    b.def = Number(63);
    // Objects containing circular references and different properties
    // are not equal
    expect(areEqual(a, b)).toBe(false);

    a = {everything: 'is checked', but: 'this', is: 'not'};
    a.but = a;
    b = {everything: 'is checked', but: {that:'object'}, is: 'not'};
    // Comparison of circular references with non-circular object references
    // are not equal
    expect(areEqual(a, b)).toBe(false);
  });

  it('works with all sorts of cyclic structures', () => {
    var a, b;
    a = [{abc: null}];
    b = [{abc: null}];
    (a[0].abc = a).push(a);
    (b[0].abc = b).push(b);
    // Cyclic structures are equal
    expect(areEqual(a, b)).toBe(true);
    a[0].def = 'Larry';
    b[0].def = 'Larry';
    // Cyclic structures containing equivalent properties are equal
    expect(areEqual(a, b)).toBe(true);
    a[0].def = String('Larry');
    b[0].def = String('Curly');
    // Cyclic structures containing different properties are not equal
    expect(areEqual(a, b)).toBe(false);
  });

  it('works using object implementing `valueOf`', () => {
    class Vector {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.valueOf = this.valueOf;
      }
      valueOf() {
        return this.x + this.y;
      }
    }
    var v1 = new Vector(1, 4);
    var v2 = new Vector(2, 3);
    expect(areEqual(v1, v2)).toBe(true);
    var v3 = new Vector(1, 5);
    expect(areEqual(v1, v3)).toBe(false);

  });

  it('works with primitives', () => {
    expect(areEqual(1, 1)).toBe(true);
    expect(areEqual(3.14, 3)).toBe(false);

    expect(areEqual('a', 'a')).toBe(true);
    expect(areEqual('a', 'b')).toBe(false);

    expect(areEqual(true, true)).toBe(true);
    expect(areEqual(true, false)).toBe(false);

    // We should support Regex and Date Type
    expect(areEqual(/a/, /a/)).toBe(true);
    expect(areEqual(/a/, /b/)).toBe(false);
    expect(areEqual(/a/i, /a/)).toBe(false);
    expect(areEqual(/a/g, /a/)).toBe(false);
    expect(areEqual(/a/m, /a/)).toBe(false);

    expect(areEqual(new Date(1000), new Date(1000))).toBe(true);
    expect(areEqual(new Date(1000), new Date(2000))).toBe(false);
  });

  it('works with null or undefined', () => {
    expect(areEqual(null, null)).toBe(true);
    expect(areEqual(undefined, undefined)).toBe(true);

    // But this should be false
    expect(areEqual(null, undefined)).toBe(false);
  });

  it('should compare two equal arrays and return true', () => {
    expect(areEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(areEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
  });

  it('should be false on arrays with values in different order ', () => {
    var a = [3, 2, 1];
    var b = [2, 3, 1];

    expect(areEqual(a, b)).toBe(false);

    // See if they actually contain the same values
    a.sort();
    b.sort();
    expect(areEqual(a, b)).toBe(true);
  });

  it('should only work with equal values and equal types', () => {
    var a = [1, '2', 3];
    var b = [1, 2, 3];
    expect(areEqual(a, b)).toBe(false);
  });

  it('should be true on empty arrays', () => {
    expect(areEqual([], [])).toBe(true);
  });

  it('should be false on arrays with different length', () => {
    var a = [1, 2];
    var b = [3];

    expect(areEqual(a, b)).toBe(false);
    expect(areEqual(b, a)).toBe(false);
  });

  it('should be true if an array contains equal objects', () => {
    var object = {};
    var div = document.createElement('div');
    var a = [object, div, window];
    var b = [object, div, window];

    expect(areEqual(a, b)).toBe(true);
  });

  it('should be true on null or undefined values', () => {
    var a = [null, 1, undefined];
    var b = [null, 1, undefined];

    expect(areEqual(a, b)).toBe(true);
  });

  it('should compare two equal objects and return true', () => {
    var a = {a: 1, b: 2, c: 3};
    var b = {a: 1, b: 2, c: 3};
    expect(areEqual(a, b)).toBe(true);

    a = {'1': 'a', '2': 'b', '3': 'c'};
    b = {'1': 'a', '2': 'b', '3': 'c'};
    expect(areEqual(a, b)).toBe(true);
  });

  it('should compare two objects with random key order', () => {
    var a = {a: 1, c: 3, b: 2};
    var b = {c: 3, b: 2, a: 1};
    expect(areEqual(a, b)).toBe(true);
  });

  it('should be false on array-like inputs', () => {
    var a = [1, 2, 3];
    var b = [1, 2, 3];
    var arraylike = {'0': 1, '1': 2, '2': 3, length: 3};
    var arraylikeB = {'0': 1, '1': 2, '2': 3, length: 3};

    expect(areEqual(a, arraylike)).toBe(false);
    expect(areEqual(arraylike, a)).toBe(false);

    expect(areEqual(a, b)).toBe(true);
    expect(areEqual(arraylike, arraylikeB)).toBe(true);
  });

  it('works with deep equality checks', () => {
    var a = {array: [1, 2, 3, {a: '1', b: [1, 2, 5]}]};
    var b = {array: [1, 2, 3, {a: '1', b: [1, 2, 5]}]};

    expect(areEqual(a, b)).toBe(true);

    b.array[3] = a.array[3];
    expect(areEqual(a, b)).toBe(true);
  });

  it('works with values where triple-equals returns true', () => {
    var div = document.createElement('div');
    var a = {
      a: null, b: undefined, c: window, d: div, e: true, f: 'string', g: 42
    };
    var b = {
      c: window, b: undefined, g: 42, d: div, f: 'string', a: null, e: true
    };

    expect(areEqual(a, b)).toBe(true);
  });
});
