/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

jest.autoMockOff();

var babel = require('babel-core');

describe('inline-requires', function() {
  it('should inline single usage', function() {
    compare([
      'var foo = require("foo");',
      'foo.bar()',
    ], [
      'require("foo").bar();',
    ]);
  });

  it('should inline requires that are not assigned', function() {
    compare([
      'require("foo");',
    ], [
      'require("foo");',
    ]);
  });

  it('should delete unused requires', function() {
    compare([
      'var foo = require("foo");',
    ], [
      '',
    ]);
  });

  it('should throw when assigning to a require', function() {
    expect(function() {
      transform([
        'var foo = require("foo");',
        'foo = "bar";',
      ]);
    }).toThrow();
  });

  it('should properly handle identifiers declared before their corresponding require statement', function() {
    compare([
      'function foo() {',
      '  bar();',
      '}',
      'var bar = require("baz");',
      'foo();',
      'bar();',
    ], [
      'function foo() {',
      '  require("baz")();',
      '}',
      'foo();',
      'require("baz")();',
    ]);
  });

  it('should be compatible with other transforms like transform-es2015-modules-commonjs', function() {
    compare([
      'import Imported from "foo";',
      'console.log(Imported);',
    ], [
      'var _foo2 = _interopRequireDefault(require(\"foo\"));',
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }',
      'console.log(_foo2.default);',
    ]);
  });
});

function transform(input) {
  return babel.transform(normalise(input), {
    plugins: [
      [require('babel-plugin-transform-es2015-modules-commonjs'), {strict: false}],
      require('../inline-requires.js')
    ],
  }).code;
}

function normalise(input) {
  return Array.isArray(input) ? input.join('\n') : input;
}

function compare(input, output) {
  var compiled = transform(input);
  output = normalise(output);
  expect(strip(compiled)).toEqual(strip(output));
}

function strip(input) {
  return input.trim().replace(/\n\n/g, '\n');
}
