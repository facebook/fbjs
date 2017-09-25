/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
* @emails zef@fb.com
*/

'use strict';

jest
  .unmock('Heap');

var Heap = require('Heap');

describe('Heap', function() {
  var heap;

  function expectHeap(heap) {
    var size = heap._items.length;

    expect(heap.size()).toBe(size);

    for (var index = 0; index < size; index++) {
      expect(heap._items[index]).toBeDefined();

      var leftChildIndex = 2 * (index + 1) - 1;
      if (leftChildIndex < size) {
        expect(
          heap._comparator(heap._items[index], heap._items[leftChildIndex])
        )
        .toBeTruthy();
      }

      var rightChildIndex = 2 * (index + 1);
      if (rightChildIndex < size) {
        expect(
          heap._comparator(heap._items[index], heap._items[rightChildIndex])
        )
        .toBeTruthy();
      }
    }
  }

  beforeEach(function() {
    jest.resetModuleRegistry();

    heap = new Heap([7, 1, 6, 2, 5, 3, 4]);
    expectHeap(heap);
  });

  it('heapify should work', function() {
    expect(heap).toBeDefined();
  });

  it('test the default min heap', function() {
    for (var ii = 1; ii <= 7; ii++) {
      expect(heap.empty()).toBeFalsy();
      expect(heap.size()).toBe(8 - ii);

      var peek = heap.peek();
      expect(peek).toBe(ii);

      var pop = heap.pop();
      expect(pop).toBe(ii);

      expectHeap(heap);
    }

    expect(heap.empty()).toBeTruthy();
    expect(heap.size()).toBe(0);
  });

  it('test with custom comparator', function() {
    var comparator = function(a, b) {
      return a > b;
    };

    heap = new Heap([1, 2, 3, 4, 5, 6, 7], comparator);
    expectHeap(heap);

    for (var ii = 7; ii >= 1; ii--) {
      expect(heap.empty()).toBeFalsy();
      expect(heap.size()).toBe(ii);

      var peek = heap.peek();
      expect(peek).toBe(ii);

      var pop = heap.pop();
      expect(pop).toBe(ii);

      expectHeap(heap);
    }

    expect(heap.empty()).toBeTruthy();
    expect(heap.size()).toBe(0);
  });

  it('test empty pop', function() {
    heap = new Heap();
    expectHeap(heap);

    expect(heap.peek()).not.toBeDefined();
    expect(heap.pop()).not.toBeDefined();

    expectHeap(heap);

    expect(heap.empty()).toBeTruthy();
    expect(heap.size()).toBe(0);
  });

  it('push should work too', function() {
    var items = [7, 1, 6, 2, 5, 3, 4];
    var min = 8;

    heap = new Heap();
    expectHeap(heap);

    expect(heap.empty()).toBeTruthy();
    expect(heap.size()).toBe(0);

    for (var ii = 0; ii < items.length; ii++) {
      var item = items[ii];
      min = Math.min(min, item);

      heap.push(item);
      expectHeap(heap);

      var peek = heap.peek();
      expect(peek).toBe(min);

      expect(heap.empty()).toBeFalsy();
      expect(heap.size()).toBe(ii + 1);
    }
  });
});

