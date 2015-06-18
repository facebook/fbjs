/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

module.exports = function(babel) {
  var t = babel.types;

  return new babel.Transformer('fbjs.rewrite-requires', {
    CallExpression: {
      exit: function(node, parent) {
        if (this.get('callee').isIdentifier({name: 'require'})) {
          // Turns this code:
          //
          // var Foo = require('Foo');
          //
          // into this:
          //
          // var Foo = require('./Foo');
          //
          // This also will look in the options passed to babel for _moduleMap
          // which would contain a map of replacements. This allows other
          // packages to be published to npm and used directly, without being
          // a part of the same build.

          var moduleMap = this.state.opts._moduleMap || {};
          var curModule = node.arguments[0].value;
          var newModule;

          // If we're testing, we want to leave providesModule intact for the
          // ones we would normally make relative. We will still transform the
          // others in the moduleMap.

          if (process.env.NODE_ENV !== 'test') {
            newModule = './' + curModule;
          }
          if (moduleMap.hasOwnProperty(curModule)) {
            newModule = moduleMap[curModule];
          }
          if (newModule) {
            return t.callExpression(
              t.identifier('require'),
              [t.literal(newModule)]
            );
          }
        }
      },
    },
  });
};
