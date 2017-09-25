/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ads_management_and_editing
 * @flow
 * @typechecks
 */

'use strict';

jest.disableAutomock();

var PrefixIntervalTree = require('PrefixIntervalTree');

var invariant = require('invariant');

class NaiveIntervalStruct {
  constructor(size: number, initialValue: ?number) {
    initialValue = initialValue || 0;

    this._elements = new Array(size);
    for (var i = 0; i < size; ++i) {
      this._elements[i] = initialValue;
    }
  }

  set(index: number, value: number): void {
    this._elements[index] = value;
  }

  get(index: number): number {
    invariant(
      0 <= index && index < this._elements.length,
      'Index out of range %s',
      index,
    );

    return this._elements[index];
  }

  sumUntil(end: number): number {
    invariant(
      0 <= end && end < this._elements.length + 1,
      'Index out of range %s',
      end,
    );

    var sum = 0;
    for (var i = 0; i < end; ++i) {
      sum += this._elements[i];
    }
    return sum;
  }

  leastUpperBound(t: number): number {
    var i;
    var sum = 0;
    for (i = 0; i <= this._elements.length; ++i) {
      if (t <= sum) {
        break;
      }
      sum += this._elements[i];
    }
    return i;
  }

  leastStrictUpperBound(t: number): number {
    var i;
    var sum = 0;
    for (i = 0; i <= this._elements.length; ++i) {
      if (t < sum) {
        break;
      }
      sum += this._elements[i];
    }
    return i;
  }

  greatestLowerBound(t: number): number {
    return this.leastStrictUpperBound(t) - 1;
  }

  greatestStrictLowerBound(t: number): number {
    return this.leastUpperBound(t) - 1;
  }
}

describe('PrefixIntervalTree-test', () => {
  it('should return correct partial sums', () => {
    var tree = PrefixIntervalTree.uniform(10, 10);

    expect(tree.sumUntil(0)).toBe(0);
    expect(tree.sumUntil(1)).toBe(10);
    expect(tree.sumUntil(2)).toBe(20);
    expect(tree.sumUntil(9)).toBe(90);
    expect(tree.sumUntil(10)).toBe(100);
    expect(() => tree.sumUntil(-1)).toThrow();
    expect(() => tree.sumUntil(11)).toThrow();
  });

  it('should return correct bounds partial sums of an empty array', () => {
    var tree = PrefixIntervalTree.empty(0);

    expect(tree.leastUpperBound(0)).toBe(0);
    expect(tree.greatestLowerBound(0)).toBe(0);
    expect(tree.leastStrictUpperBound(0)).toBe(1);
    expect(tree.greatestStrictLowerBound(0)).toBe(-1);

    expect(tree.leastUpperBound(-1)).toBe(0);
    expect(tree.greatestLowerBound(-1)).toBe(-1);
    expect(tree.leastStrictUpperBound(-1)).toBe(0);
    expect(tree.greatestStrictLowerBound(-1)).toBe(-1);

    expect(tree.leastUpperBound(1)).toBe(1);
    expect(tree.greatestLowerBound(1)).toBe(0);
    expect(tree.leastStrictUpperBound(1)).toBe(1);
    expect(tree.greatestStrictLowerBound(1)).toBe(0);
  });

  it(
    'should return correct bounds for partial sums of an unifrmly zero array',
    () => {
    var tree = PrefixIntervalTree.empty(10);

    expect(tree.leastUpperBound(0)).toBe(0);
    expect(tree.greatestLowerBound(0)).toBe(10);
    expect(tree.leastStrictUpperBound(0)).toBe(11);
    expect(tree.greatestStrictLowerBound(0)).toBe(-1);

    expect(tree.leastUpperBound(-1)).toBe(0);
    expect(tree.greatestLowerBound(-1)).toBe(-1);
    expect(tree.leastStrictUpperBound(-1)).toBe(0);
    expect(tree.greatestStrictLowerBound(-1)).toBe(-1);

    expect(tree.leastUpperBound(1)).toBe(11);
    expect(tree.greatestLowerBound(1)).toBe(10);
    expect(tree.leastStrictUpperBound(1)).toBe(11);
    expect(tree.greatestStrictLowerBound(1)).toBe(10);
  });

  it(
    'should return correct bounds for partial sums of an uniform array',
    () => {
    var tree = PrefixIntervalTree.uniform(10, 10);

    expect(tree.leastUpperBound(-1)).toBe(0);
    expect(tree.leastUpperBound(0)).toBe(0);
    expect(tree.leastUpperBound(9)).toBe(1);
    expect(tree.leastUpperBound(10)).toBe(1);
    expect(tree.leastUpperBound(19)).toBe(2);
    expect(tree.leastUpperBound(20)).toBe(2);
    expect(tree.leastUpperBound(89)).toBe(9);
    expect(tree.leastUpperBound(90)).toBe(9);
    expect(tree.leastUpperBound(99)).toBe(10);
    expect(tree.leastUpperBound(100)).toBe(10);
    expect(tree.leastUpperBound(200)).toBe(11);

    expect(tree.greatestLowerBound(-1)).toBe(-1);
    expect(tree.greatestLowerBound(0)).toBe(0);
    expect(tree.greatestLowerBound(9)).toBe(0);
    expect(tree.greatestLowerBound(10)).toBe(1);
    expect(tree.greatestLowerBound(19)).toBe(1);
    expect(tree.greatestLowerBound(20)).toBe(2);
    expect(tree.greatestLowerBound(89)).toBe(8);
    expect(tree.greatestLowerBound(90)).toBe(9);
    expect(tree.greatestLowerBound(99)).toBe(9);
    expect(tree.greatestLowerBound(100)).toBe(10);
    expect(tree.greatestLowerBound(200)).toBe(10);
  });

  it('should return correct bounds for partial sums', () => {
    var tree = PrefixIntervalTree.uniform(10, 10);
    // (10, 10, 10, 10, 10, 10, 10, 10, 10, 10)

    tree.set(1, 0);
    // (10, 0, 10, 10, 10, 10, 10, 10, 10, 10)
    expect(tree.greatestLowerBound(9)).toBe(0);
    expect(tree.greatestLowerBound(10)).toBe(2);
    expect(tree.greatestLowerBound(11)).toBe(2);
    expect(tree.greatestLowerBound(20)).toBe(3);
    expect(tree.leastUpperBound(9)).toBe(1);
    expect(tree.leastUpperBound(10)).toBe(1);

    tree.set(0, 1);
    // (1, 0, 10, 10, 10, 10, 10, 10, 10, 10)
    expect(tree.greatestLowerBound(0)).toBe(0);
    expect(tree.greatestLowerBound(1)).toBe(2);
    expect(tree.greatestLowerBound(2)).toBe(2);
    expect(tree.greatestLowerBound(11)).toBe(3);
    expect(tree.leastUpperBound(0)).toBe(0);
    expect(tree.leastUpperBound(1)).toBe(1);
    expect(tree.leastUpperBound(11)).toBe(3);

    tree.set(0, 0);
    // (0, 0, 10, 10, 10, 10, 10, 10, 10, 10)
    expect(tree.greatestLowerBound(0)).toBe(2);
    expect(tree.greatestLowerBound(1)).toBe(2);
    expect(tree.greatestLowerBound(10)).toBe(3);
    expect(tree.leastUpperBound(0)).toBe(0);
    expect(tree.leastUpperBound(10)).toBe(3);

    tree.set(9, 5);
    // (0, 0, 10, 10, 10, 10, 10, 10, 10, 5)
    expect(tree.greatestLowerBound(70)).toBe(9);
    expect(tree.greatestLowerBound(74)).toBe(9);
    expect(tree.greatestLowerBound(75)).toBe(10);
    expect(tree.greatestLowerBound(76)).toBe(10);
    expect(tree.leastUpperBound(70)).toBe(9);
    expect(tree.leastUpperBound(74)).toBe(10);
    expect(tree.leastUpperBound(75)).toBe(10);
    expect(tree.leastUpperBound(76)).toBe(11);
  });

  it('randomized test against naive implementation', () => {
    // run 25 test cases
    for (var i = 0; i < 25; ++i) {
      var size = Math.floor(Math.random() * 20) + 1;
      var initialValue = Math.floor(Math.random() * 10);
      var tree = PrefixIntervalTree.uniform(size, initialValue);
      var struct = new NaiveIntervalStruct(size, initialValue);

      // generate 1000 commands to run against both implementations
      for (var j = 0; j < 1000; ++j) {
        var operation = Math.floor(Math.random() * 2);
        var position;
        var value;
        var index;
        switch (operation) {
          case 0:
            // operation 0 is set function
            position = Math.floor(Math.random() * size);
            value = Math.floor(Math.random() * 10);
            tree.set(position, value);
            struct.set(position, value);
            break;

          case 1:
            // 1 is check of lower and upper bound on random value
            // average sum of elements should be around size * 5
            value = Math.floor(Math.random() * size * 5);
            expect(
              tree.leastUpperBound(value)
            ).toBe(
              struct.leastUpperBound(value)
            );
            expect(
              tree.greatestLowerBound(value)
            ).toBe(
              struct.greatestLowerBound(value)
            );
            expect(
              tree.leastStrictUpperBound(value)
            ).toBe(
              struct.leastStrictUpperBound(value)
            );
            expect(
              tree.greatestStrictLowerBound(value)
            ).toBe(
              struct.greatestStrictLowerBound(value)
            );

            index = Math.floor(Math.random() * size);
            expect(
              tree.get(index)
            ).toBe(
              struct.get(index)
            );

            index = Math.floor(Math.random() * (size + 1));
            expect(
              tree.sumUntil(index)
            ).toBe(
              struct.sumUntil(index)
            );
            break;
        }
      }
    }
  });
});
