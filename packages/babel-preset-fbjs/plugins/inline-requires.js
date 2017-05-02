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
 * Map of variable names that have not yet been inlined.
 * We track them in case we later remove their require()s,
 * In which case we have to come back and update them.
 */
var identifierToPathsMap;

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

  function inlineRequire(path) {
    var node = path.node;

    path.replaceWith(
      path.isReferenced() ? buildRequireCall(node.name) : node
    );
  }

  return {
    visitor: {
      Program: function() {
        resetCollection();
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
          var maybePaths = identifierToPathsMap[varName];
          if (Array.isArray(maybePaths)) {
            maybePaths.forEach(inlineRequire);
            identifierToPathsMap[varName] = null;
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
      Identifier: function (path) {
        var node = path.node;
        var parent = path.parent;
        var scope = path.scope;

        var isInRequireMap = inlineRequiredDependencyMap.hasOwnProperty(node.name);
        var scopeHasBinding = scope.hasBinding(node.name, true /* noGlobals */);

        if (!shouldInlineRequire(node, scope)) {
          // Monitor this name in case we later remove its require().
          // This won't happen often but if it does we need to come back and update here.
          if (Array.isArray(identifierToPathsMap[node.name])) {
            identifierToPathsMap[node.name].push(path);
          } else {
            identifierToPathsMap[node.name] = [path];
          }

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

        inlineRequire(path);
      },
    },
  };
};

function resetCollection() {
  identifierToPathsMap = {};
  inlineRequiredDependencyMap = {};
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

function shouldInlineRequire(node, scope) {
  return (
    inlineRequiredDependencyMap.hasOwnProperty(node.name) &&
    !scope.hasBinding(node.name, true /* noGlobals */)
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
