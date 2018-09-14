/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

jest.autoMockOff();

var babel = require('@babel/core');

describe('inline-requires', function() {
  it('should inline single usage', function() {
    compare([
      'var foo = require("foo");',
      'foo.bar()',
    ], [
      'require("foo").bar();',
    ]);
  });

  it('should inline multiple usage', function() {
    compare([
      'var foo = require("foo");',
      'foo.bar()',
      'foo.baz()',
    ], [
      'require("foo").bar();',
      'require("foo").baz();',
    ]);
  });

  it('should not matter the variable declaration length', function() {
    compare([
      'var foo = require("foo"), bar = require("bar"), baz = 4;',
      'foo.method()',
    ], [
      'var baz = 4;',
      'require("foo").method();',
    ]);

    compare([
      'var foo = require("foo"), bar = require("bar");',
      'foo.method()',
    ], [
      'require("foo").method();',
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

  it('should avoid inlining when re-assigning to a require', function() {
    compare([
      'var foo = require("foo");',
      'foo = "bar";',
    ], [
      'var foo = require("foo");',
      'foo = "bar";',
    ]);
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

  it('should be compatible with destructuring', function() {
    compare([
      'var tmp = require("./a");',
      'var a = tmp.a',
      'var D = {',
      '  b: function(c) { c ? a(c.toString()) : a("No c!"); },',
      '};',
    ], [
      'var D = {',
      '  b: function (c) {',
      '    c ? require("./a").a(c.toString()) : require("./a").a("No c!");',
      '  }',
      '};',
    ]);
  });

  it('should be compatible with other transforms like transform-modules-commonjs', function() {
    compare([
      'import Imported from "foo";',
      'console.log(Imported);',
    ], [
      'var _foo = _interopRequireDefault(require("foo"));',
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }',
      'console.log(_foo.default);',
    ]);
  });

  it('should be compatible with `transform-modules-commonjs` when using named imports', function() {
    compare([
      'import {a} from "./a";',
      'var D = {',
      '  b: function(c) { c ? a(c.toString()) : a("No c!"); },',
      '};',
    ], [
      'var D = {',
      '  b: function (c) {',
      '    c ? (0, require("./a").a)(c.toString()) : (0, require("./a").a)("No c!");',
      '  }',
      '};',
    ]);
  });

  it('should inline the given method calls', function() {
    compare([
      'const inlinedCustom = customStuff("foo");',
      'const inlinedRequire = require("bar");',
      '',
      'inlinedCustom();',
      'inlinedRequire();',
    ], [
      'customStuff("foo")();',
      'require("bar")();',
    ], {
      inlineableCalls: ['customStuff'],
    });
  });

  it('should remove loc information from nodes', function() {
    var ast = transform(['var x = require("x"); x']).ast;
    var expression = ast.program.body[0].expression;

    function noLoc(node) {
      expect(node.start).toBeUndefined();
      expect(node.end).toBeUndefined();
      expect(node.loc).toBeUndefined();
    }

    noLoc(expression);
    noLoc(expression.arguments[0]);
  });
});

function transform(input, opts) {
  return babel.transform(input.join('\n'), {
    ast: true,
    compact: true,
    plugins: [
      [require('@babel/plugin-transform-modules-commonjs'), {strict: false}],
      [require('../inline-requires.js'), opts],
    ],
  });
}

function compare(input, output, opts) {
  expect(transform(input, opts).code).toBe(transform(output, opts).code);
}
