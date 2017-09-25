/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

/*eslint-disable fb-www/promise-termination */

'use strict';

jest.dontMock('PromiseMap');

const PromiseMap = require('PromiseMap');

describe('PromiseMap', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
  });

  it('can get a value after resolving it', () => {
    const map = new PromiseMap();
    let fooValue;
    let barValue;

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
    const map = new PromiseMap();
    let fooValue;
    let barValue;

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
    const map = new PromiseMap();
    let fooValue;
    let barValue;

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
    const map = new PromiseMap();
    let fooValue;
    let barValue;

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
    const map = new PromiseMap();
    let getValue;

    map.resolveKey('foo', 42);

    expect(() => {
      map.resolveKey('foo', 1337);
    }).toThrowError('PromiseMap: Already settled `foo`.');

    map.get('foo').then(value => {
      getValue = value;
    });

    jest.runAllTimers();

    expect(getValue).toBe(42);
  });

  it('throws if the same key is rejected more than once', () => {
    const map = new PromiseMap();
    let getValue;

    map.rejectKey('foo', 42);

    expect(() => {
      map.rejectKey('foo', 1337);
    }).toThrowError('PromiseMap: Already settled `foo`.');

    map.get('foo').catch(value => {
      getValue = value;
    });

    jest.runAllTimers();

    expect(getValue).toBe(42);
  });

  it('throws if the same key is both rejected and resolved', () => {
    const map = new PromiseMap();
    let getValue;

    map.resolveKey('foo', 42);

    expect(() => {
      map.rejectKey('foo', 1337);
    }).toThrowError('PromiseMap: Already settled `foo`.');

    map.get('foo').then(value => {
      getValue = value;
    });

    jest.runAllTimers();

    expect(getValue).toBe(42);
  });
});
