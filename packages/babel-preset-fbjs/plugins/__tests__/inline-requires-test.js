/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

const babel = require('@babel/core');
const inlineRequiresPlugin = require('../inline-requires');
const pluginTester = require('babel-plugin-tester');

pluginTester({
  plugin: inlineRequiresPlugin,
  pluginName: 'inline-requires',
  pluginOptions: {
    inlineableCalls: ['customStuff'],
  },
  tests: {
    'inlines single usage': {
      code: ['var foo = require("foo");', 'foo.bar()'].join('\n'),
      snapshot: true,
    },

    'inlines multiple usages': {
      code: ['var foo = require("foo");', 'foo.bar()', 'foo.baz()'].join('\n'),
      snapshot: true,
    },

    'inlines any number of variable declarations': {
      code: [
        'var foo = require("foo"), bar = require("bar"), baz = 4;',
        'foo.method()',
      ].join('\n'),
      snapshot: true,
    },

    'ignores requires that are not assigned': {
      code: ['require("foo");'].join('\n'),
      snapshot: false,
    },

    'delete unused requires': {
      code: ['var foo = require("foo");'].join('\n'),
      snapshot: true,
    },

    'ignores requires that are re-assigned': {
      code: ['var foo = require("foo");', 'foo = "bar";'].join('\n'),
      snapshot: false,
    },

    'inlines requires that are referenced before the require statement': {
      code: [
        'function foo() {',
        '  bar();',
        '}',
        'var bar = require("baz");',
        'foo();',
        'bar();',
      ].join('\n'),
      snapshot: true,
    },

    'inlines destructured require properties': {
      code: [
        'var tmp = require("./a");',
        'var a = tmp.a',
        'var D = {',
        '  b: function(c) { c ? a(c.toString()) : a("No c!"); },',
        '};',
      ].join('\n'),
      snapshot: true,
    },

    'inlines functions provided via `inlineableCalls`': {
      code: [
        'const inlinedCustom = customStuff("foo");',
        'const inlinedRequire = require("bar");',
        '',
        'inlinedCustom();',
        'inlinedRequire();',
      ].join('\n'),
      snapshot: true,
    },
  },
});

describe('inline-requires', () => {
  const transform = (source, options) =>
    babel.transform(source.join('\n'), {
      ast: true,
      compact: true,
      plugins: [
        [require('@babel/plugin-transform-modules-commonjs'), {strict: false}],
        [inlineRequiresPlugin, options],
      ],
    });

  const compare = (input, output, options) => {
    expect(transform(input, options).code).toBe(
      transform(output, options).code,
    );
  };

  it('should be compatible with other transforms like transform-modules-commonjs', function() {
    compare(
      ['import Imported from "foo";', 'console.log(Imported);'],
      [
        'var _foo = _interopRequireDefault(require("foo"));',
        'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }',
        'console.log(_foo.default);',
      ],
    );
  });

  it('should be compatible with `transform-modules-commonjs` when using named imports', function() {
    compare(
      [
        'import {a} from "./a";',
        'var D = {',
        '  b: function(c) { c ? a(c.toString()) : a("No c!"); },',
        '};',
      ],
      [
        'var D = {',
        '  b: function (c) {',
        '    c ? (0, require("./a").a)(c.toString()) : (0, require("./a").a)("No c!");',
        '  }',
        '};',
      ],
    );
  });

  it('should remove loc information from nodes', function() {
    const ast = transform(['var x = require("x"); x']).ast;
    const expression = ast.program.body[0].expression;

    function expectNoLocation(node) {
      expect(node.start).toBeUndefined();
      expect(node.end).toBeUndefined();
      expect(node.loc).toBeUndefined();
    }

    expectNoLocation(expression);
    expectNoLocation(expression.arguments[0]);
  });
});
