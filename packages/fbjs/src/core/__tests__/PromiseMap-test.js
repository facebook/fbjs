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

const PromiseMap = require('PromiseMap');

describe('PromiseMap', () => {
  beforeEach(() => {
    jest.resetModuleRegistry();
  });

  it('can get a value after resolving it', () => {
    const map = new PromiseMap();
    map.resolveKey('foo', 42);
    map.resolveKey('bar', 1337);
    return Promise.resolve()
      .then(() => map.get('foo'))
      .then(fooValue => expect(fooValue).toEqual(42))
      .then(() => map.get('bar'))
      .then(barValue => expect(barValue).toEqual(1337));
  });

  it('can get a value before resolving it', () => {
    const map = new PromiseMap();

    const ret = Promise.resolve()
      .then(() => map.get('foo'))
      .then(fooValue => expect(fooValue).toEqual(42))
      .then(() => map.get('bar'))
      .then(barValue => expect(barValue).toEqual(1337));

    map.resolveKey('foo', 42);
    map.resolveKey('bar', 1337);

    return ret;
  });

  it('can get an error after rejecting it', () => {
    const map = new PromiseMap();
    map.rejectKey('foo', 42);
    map.rejectKey('bar', 1337);
    return Promise.resolve()
      .then(() => map.get('foo'))
      .catch(fooValue => expect(fooValue).toEqual(42))
      .then(() => map.get('bar'))
      .catch(barValue => expect(barValue).toEqual(1337));
  });

  it('can get an error before rejecting it', () => {
    const map = new PromiseMap();

    const ret = Promise.resolve()
      .then(() => map.get('foo'))
      .catch(fooValue => expect(fooValue).toEqual(42))
      .then(() => map.get('bar'))
      .catch(barValue => expect(barValue).toEqual(1337));

    map.rejectKey('foo', 42);
    map.rejectKey('bar', 1337);

    return ret;
  });

  it('throws if the same key is resolved more than once', () => {
    const map = new PromiseMap();
    map.resolveKey('foo', 42);

    expect(() => {
      map.resolveKey('foo', 1337);
    }).toThrowError('PromiseMap: Already settled `foo`.');

    return Promise.resolve()
      .then(() => map.get('foo'))
      .then(fooValue => expect(fooValue).toEqual(42));
  });

  it('throws if the same key is rejected more than once', () => {
    const map = new PromiseMap();
    map.rejectKey('foo', 42);

    expect(() => {
      map.rejectKey('foo', 1337);
    }).toThrowError('PromiseMap: Already settled `foo`.');

    return Promise.resolve()
      .then(() => map.get('foo'))
      .catch(fooValue => expect(fooValue).toEqual(42));
  });

  it('throws if the same key is both rejected and resolved', () => {
    const map = new PromiseMap();
    map.resolveKey('foo', 42);

    expect(() => {
      map.rejectKey('foo', 1337);
    }).toThrowError('PromiseMap: Already settled `foo`.');

    return Promise.resolve()
      .then(() => map.get('foo'))
      .then(fooValue => expect(fooValue).toEqual(42));
  });
});
