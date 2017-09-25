/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+ads_management_and_editing
 * @typechecks
 */

'use strict';

jest
  .unmock('IntegerBufferSet')
  .unmock('Heap');

var IntegerBufferSet = require('IntegerBufferSet');

describe('IntegerBufferSet-test', function() {
  beforeEach(function() {
    jest.resetModuleRegistry();
  });

  it('set should be empty right after creating it', function() {
    var bufferSet = new IntegerBufferSet();
    expect(bufferSet.getSize()).toEqual(0);
  });

  it('set should allow to add new elements on new positions', function() {
    var bufferSet = new IntegerBufferSet();
    bufferSet.getNewPositionForValue(0);
    expect(bufferSet.getSize()).toEqual(1);
    expect(bufferSet.getValuePosition(0)).toEqual(0);

    bufferSet.getNewPositionForValue(999);
    expect(bufferSet.getSize()).toEqual(2);
    expect(bufferSet.getValuePosition(999)).toEqual(1);

    bufferSet.getNewPositionForValue(5);
    expect(bufferSet.getSize()).toEqual(3);
    expect(bufferSet.getValuePosition(5)).toEqual(2);
  });

  it('set should allow to replace vales out of specified range', function() {
    var bufferSet = new IntegerBufferSet();
    bufferSet.getNewPositionForValue(0);
    bufferSet.getNewPositionForValue(999);
    bufferSet.getNewPositionForValue(5);
    // [0, 999, 5]

    var assignedPosition = bufferSet.replaceFurthestValuePosition(
      580, // beginning of the range
      900, // end of range
      22
    );
    // Should be [22, 999, 5]
    expect(bufferSet.getValuePosition(22)).toEqual(0);
    expect(bufferSet.getValuePosition(22)).toEqual(assignedPosition);

    bufferSet.replaceFurthestValuePosition(
      25, // beginning of the range
      990, // end of range
      17
    );
    // Should be [22, 999, 17]
    expect(bufferSet.getValuePosition(17)).toEqual(2);
  });

  it(
    'replaceFurthestValuePosition should not replace if all values are in ' +
    'range',
    function() {
      var bufferSet = new IntegerBufferSet();
      bufferSet.getNewPositionForValue(0);
      bufferSet.getNewPositionForValue(999);
      bufferSet.getNewPositionForValue(5);
      // [0, 999, 5]

      var position = bufferSet.replaceFurthestValuePosition(
        0, // beginning of the range
        1000, // end of range
        22
      );
      expect(position).toEqual(null);
    }
  );

  it(
    'getValuePosition should return null if value is not in set',
    function() {
      var bufferSet = new IntegerBufferSet();
      bufferSet.getNewPositionForValue(0);
      bufferSet.getNewPositionForValue(999);
      bufferSet.getNewPositionForValue(5);
      // [0, 999, 5]

      expect(bufferSet.getValuePosition(5)).toEqual(2);
      expect(bufferSet.getValuePosition(10)).toEqual(null);
    }
  );
});
