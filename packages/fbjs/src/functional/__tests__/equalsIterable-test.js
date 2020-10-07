/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.unmock('equalsIterable');

var Immutable = require('immutable');
var equalsIterable = require('equalsIterable');

describe('equalsIterable', () => {
  var TEST_CASES = [
    {
      name: 'should be equal for empty iterables',
      one: [],
      two: [],
      equal: true,
    },
    {
      name: 'should not be equal for one empty iterable',
      one: [1],
      two: [],
      equal: false,
    },
    {
      name: 'should be equal with the same values',
      one: [1, 2, 3, 4, 5],
      two: [1, 2, 3, 4, 5],
      equal: true,
    },
    {
      name: 'should not be equal with the different values',
      one: [1, 2, 3, 4, 5],
      two: [1, 2, 3, 5],
      equal: false,
    },
    {
      name: 'should not be equal with the different ordered values',
      one: [1, 2, 3, 4, 5],
      two: [1, 2, 4, 3, 5],
      equal: false,
    },
    {
      name: 'should not be equal with the different values by reference',
      one: [1, 2, 3, {}],
      two: [1, 2, 3, {}],
      equal: false,
    },
  ];

  // Note: even though Sets and Maps are not ordered they should still be
  // deterministic, so it should be safe to compare the order of the Set/Map
  // iterators to each other
  var CONSTRUCTORS = [
    (array) => array,
    (array) => new Set(array),
    (array) => Immutable.List(array),
    (array) => Immutable.Set(array),

    // Maps need special ARE_EQUAL functions. Make sure the index of these
    // constructors correspond to the correct ARE_EQUALS functions below.
    (array) => new Map(array.map((item, index) => [index, item])),
    (array) => Immutable.Map(array.map((item, index) => [index, item])),
  ];

  var ARE_EQUAL = [
    null,
    null,
    null,
    null,
    (one, two) => one[0] === two[0] && one[1] === two[1],
    (one, two) => one[0] === two[0] && one[1] === two[1],
  ];

  CONSTRUCTORS.forEach((constructor, index) => {
    var areEqual = ARE_EQUAL[index];
    TEST_CASES.forEach((testCase) => {
      it(testCase.name, () => {
        var one = constructor(testCase.one);
        var two = constructor(testCase.two);
        expect(equalsIterable(one, two, areEqual)).toBe(testCase.equal);
        expect(equalsIterable(two, one, areEqual)).toBe(testCase.equal);
      });
    });
  });
});
