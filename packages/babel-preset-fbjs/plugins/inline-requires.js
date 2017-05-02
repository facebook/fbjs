/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Map of require(...) aliases to module names.
 *
 * `Foo` is an alias for `require('ModuleFoo')` in the following example:
 *   var Foo = require('ModuleFoo');
 */
var inlineRequiredDependencyMap;

/**
 * Map of variable names that were not inlined.
 */
var unmappedIdentifiersMap;

/**
 * Do a second transform pass on the current Program to catch skipped variables.
 * This covers an edge-case where we remove a require() after passing references to it.
 */
var orphanedIdentifiersFound;

/**
 * This transform inlines top-level require(...) aliases with to enable lazy
 * loading of dependencies.
 *
 * Continuing with the example above, this replaces all references to `Foo` in
 * the module to `require('ModuleFoo')`.
 */
module.exports = function fbjsInlineRequiresTransform(babel) {
  var t = babel.types;

  function buildRequireCall(name) {
    var call = t.callExpression(
      t.identifier('require'),
      [t.stringLiteral(inlineRequiredDependencyMap[name])]
    );
    call.new = true;
    return call;
  }

  function Identifier(path) {
    var node = path.node;
    var parent = path.parent;
    var scope = path.scope;

    if (!shouldInlineRequire(node, scope)) {
      // Monitor this variable name in case we later remove its require().
      // This won't happen often but if it does we need to do a second pass.
      unmappedIdentifiersMap[node.name] = true;

      return;
    }

    if (
      parent.type === 'AssignmentExpression' &&
      path.isBindingIdentifier() &&
      !scope.bindingIdentifierEquals(node.name, node)
    ) {
      throw new Error(
        'Cannot assign to a require(...) alias, ' + node.name +
        '. Line: ' + node.loc.start.line + '.'
      );
    }

    path.replaceWith(
      path.isReferenced() ? buildRequireCall(node.name) : node
    );
  }

  return {
    visitor: {
      Program: {
        enter: function() {
          resetCollection();
        },
        exit: function(path, state) {
          // If we removed require() statements for variables we've already seen,
          // We need to do a second pass on this program to replace them with require().
          if (orphanedIdentifiersFound) {
            path.traverse({ Identifier: Identifier }, state);
          }
        }
      },

      /**
       * Collect top-level require(...) aliases.
       */
      CallExpression: function(path) {
        var node = path.node;

        if (isTopLevelRequireAlias(path)) {
          var varName = path.parent.id.name;
          var moduleName = node.arguments[0].value;

          inlineRequiredDependencyMap[varName] = moduleName;

          // If we removed require() statements for variables we've already seen,
          // We need to do a second pass on this program to replace them with require().
          if (unmappedIdentifiersMap.hasOwnProperty(varName)) {
            orphanedIdentifiersFound = true;
          }

          // Remove the declaration.
          path.parentPath.parentPath.remove();
          // And the associated binding in the scope.
          path.scope.removeBinding(varName);
        }
      },

      /**
       * Inline require(...) aliases.
       */
      Identifier: Identifier,
    },
  };
};

function resetCollection() {
  inlineRequiredDependencyMap = {};
  unmappedIdentifiersMap = {};
  orphanedIdentifiersFound = false;
}

function isTopLevelRequireAlias(path) {
  return (
    isRequireCall(path.node) &&
    path.parent.type === 'VariableDeclarator' &&
    path.parent.id.type === 'Identifier' &&
    path.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parent.declarations.length === 1 &&
    path.parentPath.parentPath.parent.type === 'Program'
  );
}

function isRequireCall(node) {
  return (
    !node.new &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node['arguments'].length === 1 &&
    node['arguments'][0].type === 'StringLiteral'
  );
}

function shouldInlineRequire(node, scope) {
  return (
    inlineRequiredDependencyMap.hasOwnProperty(node.name) &&
    !scope.hasBinding(node.name, true /* noGlobals */)
  );
}
