/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/* eslint-disable max-len */

let babel = require('@babel/core');
let devExpression = require('../dev-expression');
const validateOutputAst = require('../test-utils/validateOutputAst');

function transform(input) {
  const result = babel.transform(input, {
    plugins: [devExpression],
  });
  validateOutputAst(result.ast);
  return result.code;
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
`if (process.env.NODE_ENV !== "production") {
  console.log('foo');
}`
    );
  });

  it('should replace warning calls', () => {
    compare(
      "warning(condition, 'a %s b', 'c');",
      `process.env.NODE_ENV !== "production" ? warning(condition, 'a %s b', 'c') : void 0;`
    );
  });

  it('should replace invariant calls', () => {
    compare(
      "invariant(condition, 'a %s b', 'c');",
      `!condition ? process.env.NODE_ENV !== "production" ? invariant(false, 'a %s b', 'c') : invariant(false) : void 0;`
    );
  });
});
