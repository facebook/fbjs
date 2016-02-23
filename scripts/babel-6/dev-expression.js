/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var t = require('babel-types');

var DEV_EXPRESSION = t.binaryExpression(
  '!==',
  t.memberExpression(
    t.memberExpression(
      t.identifier('process'),
      t.identifier('env'),
      false
    ),
    t.identifier('NODE_ENV'),
    false
  ),
  t.stringLiteral('production')
);

module.exports = function(babel) {
  return {
    visitor: {
      Identifier: {
        enter(path) {
          // Do nothing when testing
          if (process.env.NODE_ENV === 'test') {
            return;
          }
          // replace __DEV__ with process.env.NODE_ENV !== 'production'
          if (t.isIdentifier(path.node, {name: '__DEV__'})) {
            path.replaceWith(DEV_EXPRESSION);
          }
        },
      },
      CallExpression: {
        exit(path) {
          // Do nothing when testing or if we've seen the node
          var node = path.node;
          if (process.env.NODE_ENV === 'test' || node.seen) {
            return;
          }
          if (path.get('callee').isIdentifier({name: 'invariant'})) {
            // Turns this code:
            //
            // invariant(condition, argument, argument);
            //
            // into this:
            //
            // if (!condition) {
            //   if ("production" !== process.env.NODE_ENV) {
            //     invariant(false, argument, argument);
            //   } else {
            //     invariant(false);
            //   }
            // }
            //
            // Specifically this does 2 things:
            // 1. Checks the condition first, preventing an extra function call.
            // 2. Adds an environment check so that verbose error messages aren't
            //    shipped to production.
            // The generated code is longer than the original code but will dead
            // code removal in a minifier will strip that out.
            var condition = node.arguments[0];
            var consequent = t.callExpression(
              node.callee,
              [t.booleanLiteral(false)].concat(node.arguments.slice(1))
            );
            var alternate = t.callExpression(
              node.callee,
              [t.booleanLiteral(false)]
            );
            consequent.seen = alternate.seen = true;
            path.replaceWith(
              t.ifStatement(
                t.unaryExpression('!', condition),
                t.blockStatement([
                  t.ifStatement(
                    DEV_EXPRESSION,
                    t.blockStatement([
                      t.expressionStatement(
                        consequent
                      ),
                    ]),
                    t.blockStatement([
                      t.expressionStatement(
                        alternate
                      ),
                    ])
                  ),
                ])
              )
            );
          } else if (path.get('callee').isIdentifier({name: 'warning'})) {
            // Turns this code:
            //
            // warning(condition, argument, argument);
            //
            // into this:
            //
            // if ("production" !== process.env.NODE_ENV) {
            //   warning(condition, argument, argument);
            // }
            //
            // The goal is to strip out warning calls entirely in production. We
            // don't need the same optimizations for conditions that we use for
            // invariant because we don't care about an extra call in __DEV__

            node.seen = true;
            return path.replaceWith(
              t.ifStatement(
                DEV_EXPRESSION,
                t.blockStatement([
                  t.expressionStatement(
                    node
                  ),
                ])
              )
            );
          }
        }
      },
    },
  };
};
