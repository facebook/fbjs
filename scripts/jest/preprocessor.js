// TODO: sync babel config with gulpfile. There are differences (eg, we don't
// want to use the DEV plugin).

var babel = require('babel');
var babelPluginRequires = require('../babel/rewrite-requires');
var assign = require('object-assign');

var babelOpts = {
  nonStandard: true,
  optional: [
    'es7.trailingFunctionCommas'
  ],
  plugins: [babelPluginRequires],
  _moduleMap: {
    'Promise': 'promise'
  }
};

module.exports = {
  process: function(src, path) {
    // TODO: Use preprocessorIgnorePatterns when it works.
    // See https://github.com/facebook/jest/issues/385.
    if (!path.match(/\/node_modules\//) && !path.match(/\/third_party\//)) {
      return babel.transform(src, assign({filename: path}, babelOpts)).code;
    }
    return src;
  }
};
