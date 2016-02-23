/**
 * Copyright (c) 2015, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

let babel = require('babel-core');
let devExpression = require('../dev-expression');

function transform(input) {
  return babel.transform(input, {
    plugins: [devExpression],
  }).code;
}

function compare(input, output) {
  var compiled = transform(input);
  expect(compiled).toEqual(output);
}

var oldEnv;

describe('dev-expression', function() {
  beforeEach(() => {
    oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = '';
  });

  afterEach(() => {
    process.env.NODE_ENV = oldEnv;
  });

  it('should replace __DEV__ in if', () => {
    compare(
`
if (__DEV__) {
  console.log('foo')
}`,
`
if (process.env.NODE_ENV !== 'production') {
  console.log('foo');
}`
    );
  });

  it('should replace warning calls', () => {
    compare(
      `warning(condition, 'a %s b', 'c');`,
      `process.env.NODE_ENV !== 'production' ? warning(condition, 'a %s b', 'c') : undefined;`
    );
  });

  it('should replace invariant calls', () => {
    compare(
      `invariant(condition, 'a %s b', 'c');`,
      `!condition ? process.env.NODE_ENV !== 'production' ? invariant(false, 'a %s b', 'c') : invariant(false) : undefined;`
    );
  });
});
