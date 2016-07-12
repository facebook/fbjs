/**
 * Copyright 2015-present Facebook. All Rights Reserved.
 *
 * @emails oncall+jsinfra
 */

jest
  .unmock('partitionObject')
  .unmock('partitionObjectByKey');

var Set = require('Set');

var partitionObjectByKey = require('partitionObjectByKey');

describe('partitionObjectByKey', function() {

  it('should partition some properties of an object', function() {
    var baseObject = {a: 'A', b: 'B', c: 'C'};
    expect(partitionObjectByKey(baseObject, new Set(['a'])))
      .toEqual([{a: 'A'}, {b: 'B', c: 'C'}]);
    expect(partitionObjectByKey(baseObject, new Set(['a', 'b'])))
      .toEqual([{a: 'A', b: 'B'}, {c: 'C'}]);
    expect(partitionObjectByKey(baseObject, new Set()))
      .toEqual([{}, baseObject]);
  });

  it('should ignore keys that do not exist in the source object', function() {
    var baseObject = {a: 'A', b: 'B', c: 'C'};
    expect(partitionObjectByKey(baseObject, new Set(['a', 'd'])))
      .toEqual([{a: 'A'}, {b: 'B', c: 'C'}]);
  });

});
