/**
 * Copyright 2015-present Facebook. All Rights Reserved.
 *
 * @emails oncall+jsinfra
 */

jest
  .unmock('partitionObject');

var partitionObject = require('partitionObject');

describe('partitionObject', function() {

  it('should partition based on predicate', function() {
    var baseObject = {a: 42, b: 189, c: 67, d: 101};
    expect(partitionObject(baseObject, x => x > 100))
      .toEqual([{b: 189, d: 101}, {a: 42, c: 67}]);
    expect(partitionObject(baseObject, _ => false))
      .toEqual([{}, baseObject]);
    expect(partitionObject(baseObject, _ => true))
      .toEqual([baseObject, {}]);
  });

});
