/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

/**
 * This transform inlines top-level require(...) aliases with to enable lazy
 * loading of dependencies. It is able to inline both single references and
 * child property references.
 *
 * For instance:
 *     var Foo = require('foo');
 *     f(Foo);
 *
 * Will be transformed into:
 *     f(require('foo'));
 *
 * When the assigment expression has a property access, it will be inlined too,
 * keeping the property. For instance:
 *     var Bar = require('foo').bar;
 *     g(Bar);
 *
 * Will be transformed into:
 *     g(require('foo').bar);
 *
 * Destructuring also works the same way. For instance:
 *     const {Baz} = require('foo');
 *     h(Baz);
 *
 * Is also successfully inlined into:
 *     g(require('foo').Baz);
 */
module.exports = babel => ({
  name: 'inline-requires',
  visitor: {
    Program: {
      exit(path, state) {
        const ignoredRequires = new Set();
        const inlineableCalls = new Set(['require']);

        if (state.opts != null) {
          if (state.opts.ignoredRequires != null) {
            for (const name of state.opts.ignoredRequires) {
              ignoredRequires.add(name);
            }
          }
          if (state.opts.inlineableCalls != null) {
            for (const name of state.opts.inlineableCalls) {
              inlineableCalls.add(name);
            }
          }
        }

        path.scope.crawl();
        path.traverse(
          {
            CallExpression(path, state) {
              const declaratorPath =
                inlineableAlias(path, state) ||
                inlineableMemberAlias(path, state);

              const declarator = declaratorPath ? declaratorPath.node : null;
              if (declarator == null) {
                return;
              }

              const init = declarator.init;
              const name = declarator.id ? declarator.id.name : null;

              const binding = declaratorPath.scope.getBinding(name);
              if (binding.constantViolations.length > 0) {
                return;
              }

              deleteLocation(init);
              babel.traverse(init, {
                noScope: true,
                enter: path => deleteLocation(path.node),
              });

              let thrown = false;
              for (const referencePath of binding.referencePaths) {
                try {
                  referencePath.replaceWith(init);
                } catch (error) {
                  thrown = true;
                }
              }

              // If a replacement failed (e.g. replacing a type annotation),
              // avoid removing the initial require just to be safe.
              if (!thrown) {
                declaratorPath.remove();
              }
            },
          },
          {
            ignoredRequires,
            inlineableCalls,
          },
        );
      },
    },
  },
});

function deleteLocation(node) {
  delete node.start;
  delete node.end;
  delete node.loc;
}

function inlineableAlias(path, state) {
  const isValid =
    isInlineableCall(path.node, state) &&
    path.parent.type === 'VariableDeclarator' &&
    path.parent.id.type === 'Identifier' &&
    path.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parentPath.parent.type === 'Program';

  return isValid ? path.parentPath : null;
}

function inlineableMemberAlias(path, state) {
  const isValid =
    isInlineableCall(path.node, state) &&
    path.parent.type === 'MemberExpression' &&
    path.parentPath.parent.type === 'VariableDeclarator' &&
    path.parentPath.parent.id.type === 'Identifier' &&
    path.parentPath.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parentPath.parentPath.parent.type === 'Program';

  return isValid ? path.parentPath.parentPath : null;
}

function isInlineableCall(node, state) {
  const isInlineable =
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    state.inlineableCalls.has(node.callee.name) &&
    node['arguments'].length >= 1;

  // require('foo');
  const isStandardCall =
    isInlineable &&
    node['arguments'][0].type === 'StringLiteral' &&
    !state.ignoredRequires.has(node['arguments'][0].value);

  // require(require.resolve('foo'));
  const isRequireResolveCall =
    isInlineable &&
    node['arguments'][0].type === 'CallExpression' &&
    node['arguments'][0].callee.type === 'MemberExpression' &&
    node['arguments'][0].callee.object.type === 'Identifier' &&
    state.inlineableCalls.has(node['arguments'][0].callee.object.name) &&
    node['arguments'][0].callee.property.type === 'Identifier' &&
    node['arguments'][0].callee.property.name === 'resolve' &&
    node['arguments'][0]['arguments'].length >= 1 &&
    node['arguments'][0]['arguments'][0].type === 'StringLiteral' &&
    !state.ignoredRequires.has(node['arguments'][0]['arguments'][0].value);

  return isStandardCall || isRequireResolveCall;
}
