/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

'use strict';

jest.unmock('joinClasses');

const joinClasses = require('joinClasses');

describe('joinClasses', function() {

  it('should return a single className', function() {
    expect(joinClasses('aaa')).toEqual('aaa');
  });

  it('should join two classes together', function() {
    const aaa = 'aaa';
    const bbb = 'bbb';
    expect(joinClasses(aaa, bbb)).toEqual('aaa bbb');
  });

  it('should join many classes together', function() {
    const aaa = 'aaa';
    const bbb = 'bbb';
    const ccc = 'ccc';
    const ddd = 'ddd';
    const eee = 'eee';
    expect(joinClasses(aaa, bbb, ccc, ddd, eee)).toEqual('aaa bbb ccc ddd eee');
  });

  it('should omit undefined and empty classes', function() {
    const aaa = 'aaa';
    let bbb;
    const ccc = null;
    const ddd = '';
    const eee = 'eee';
    expect(joinClasses(bbb)).toEqual('');
    expect(joinClasses(bbb, bbb, bbb)).toEqual('');
    expect(joinClasses(aaa, bbb, ccc, ddd, eee)).toEqual('aaa eee');
  });

});
