/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var MODULES = [
  // Local Promise implementation.
  'Promise',
];

/**
 * Automatically imports a module if its identifier is in the AST.
 */
module.exports = function autoImporter(babel) {

  var t = babel.types;

  function isAppropriateModule(name, scope, state) {
    var autoImported = state.get('autoImported');
    return MODULES.indexOf(name) !== -1
        && !autoImported.hasOwnProperty(name)
        && !scope.hasBinding(name, /*skip globals*/true);
  }

  return new babel.Plugin('auto-importer', {
    pre: function(state) {
      // Cache per file to avoid calling `scope.hasBinding` several
      // times for the same module, which has already been auto-imported.
      state.set('autoImported', {});
    },

    visitor: {
      ReferencedIdentifier: function(node, parent, scope, state) {
        if (!isAppropriateModule(node.name, scope, state)) {
          return node;
        }

        scope.getProgramParent().push({
          id: t.identifier(node.name),
          init: t.callExpression(
            t.identifier('require'),
            [t.literal(node.name)]
          ),
        });

        var autoImported = state.get('autoImported');
        autoImported[node.name] = true;
        state.set('autoImported', autoImported);
      },
    },
  });
};
