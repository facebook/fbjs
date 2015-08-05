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

/*eslint-disable fb-www/promise-termination */

'use strict';

jest.dontMock('PromiseMap');

describe('PromiseMap', () => {
  var PromiseMap;

  beforeEach(() => {
    jest.resetModuleRegistry();
    PromiseMap = require('PromiseMap');
  });

  it('can get a value after resolving it', () => {
    var map = new PromiseMap();
    var fooValue;
    var barValue;

    map.resolveKey('foo', 42);
    map.resolveKey('bar', 1337);
    map.get('foo').then(value => {
      fooValue = value;
    });
    map.get('bar').then(value => {
      barValue = value;
    });

    jest.runAllTimers();

    expect(fooValue).toBe(42);
    expect(barValue).toBe(1337);
  });

  it('can get a value before resolving it', () => {
    var map = new PromiseMap();
    var fooValue;
    var barValue;

    map.get('foo').then(value => {
      fooValue = value;
    });
    map.get('bar').then(value => {
      barValue = value;
    });
    map.resolveKey('foo', 42);
    map.resolveKey('bar', 1337);

    jest.runAllTimers();

    expect(fooValue).toBe(42);
    expect(barValue).toBe(1337);
  });

  it('can get an error after rejecting it', () => {
    var map = new PromiseMap();
    var fooValue;
    var barValue;

    map.rejectKey('foo', 42);
    map.rejectKey('bar', 1337);
    map.get('foo').catch(value => {
      fooValue = value;
    });
    map.get('bar').catch(value => {
      barValue = value;
    });

    jest.runAllTimers();

    expect(fooValue).toBe(42);
    expect(barValue).toBe(1337);
  });

  it('can get an error before rejecting it', () => {
    var map = new PromiseMap();
    var fooValue;
    var barValue;

    map.get('foo').catch(value => {
      fooValue = value;
    });
    map.get('bar').catch(value => {
      barValue = value;
    });
    map.rejectKey('foo', 42);
    map.rejectKey('bar', 1337);

    jest.runAllTimers();

    expect(fooValue).toBe(42);
    expect(barValue).toBe(1337);
  });

  it('throws if the same key is resolved more than once', () => {
    var map = new PromiseMap();
    var getValue;

    map.resolveKey('foo', 42);

    expect(() => {
      map.resolveKey('foo', 1337);
    }).toThrow('Invariant Violation: PromiseMap: Already settled `foo`.');

    map.get('foo').then(value => {
      getValue = value;
    });

    jest.runAllTimers();

    expect(getValue).toBe(42);
  });

  it('throws if the same key is rejected more than once', () => {
    var map = new PromiseMap();
    var getValue;

    map.rejectKey('foo', 42);

    expect(() => {
      map.rejectKey('foo', 1337);
    }).toThrow('Invariant Violation: PromiseMap: Already settled `foo`.');

    map.get('foo').catch(value => {
      getValue = value;
    });

    jest.runAllTimers();

    expect(getValue).toBe(42);
  });

  it('throws if the same key is both rejected and resolved', () => {
    var map = new PromiseMap();
    var getValue;

    map.resolveKey('foo', 42);

    expect(() => {
      map.rejectKey('foo', 1337);
    }).toThrow('Invariant Violation: PromiseMap: Already settled `foo`.');

    map.get('foo').then(value => {
      getValue = value;
    });

    jest.runAllTimers();

    expect(getValue).toBe(42);
  });
});
