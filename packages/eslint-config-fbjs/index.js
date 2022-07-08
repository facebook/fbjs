/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This file resembles what we use for our internal configuration. Several changes
 * have been made to acoomodate the differences between our internal setup and
 * what we would expect to see in open source.
 *
 * Internally we also lint each file individually, allowing use to use the file
 * path to selectively enable/disable pieces of the lint configuration. For
 * example, we don't actually want jest globals to be enabled all the time so
 * we only enable that when we know we're linting a test file. That isn't possible
 * here so we just always enable that.
 *
 * We are also missing our growing library of custom rules. Many of those will
 * make their way out here soon, but it does mean we need to do some editing of
 * our configuration object.
 */

'use strict';

const shared = require('./shared');
const maxLenIgnorePattern = shared.maxLenIgnorePattern;

// see http://eslint.org/docs/user-guide/configuring.html#configuring-rules
const OFF = 0;
const WARNING = 1;
const ERROR = 2;
const INDENT_SIZE = 2;

function getBaseConfig() {
  return {
    parser: 'hermes-eslint',
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },

    plugins: [
      'babel',
      'ft-flow',
      'jsx-a11y',
      'react',
    ],

    // Tries to match the jshint configuration as closely as possible, with the
    // exeception of a few things that jshint doesn't check, but that we really
    // shouldn't be using anyways.
    //
    // Things that jshint checked for are errors, new rules are warnings.
    //
    // If you update eslint, be sure to check the changelog to figure out what
    // rules to add/remove to/from this list.
    rules: {
      // Possible Errors <http://eslint.org/docs/rules/#possible-errors>

      // Forked and moved to fb-www/comma-dangle
      'comma-dangle': OFF,
      // equivalent to jshint boss
      'no-cond-assign': OFF,
      // equivalent to jshint devel
      'no-console': [WARNING, {
        allow: ['warn', 'error', 'time', 'timeEnd', 'timeStamp'],
      }],
      // prohibits things like `while (true)`
      'no-constant-condition': OFF,
      // we need to be able to match these
      'no-control-regex': OFF,
      // equivalent to jshint debug
      'no-debugger': ERROR,
      // equivalent to jshint W004
      'no-dupe-args': ERROR,
      // syntax error in strict mode, almost certainly unintended in any case
      'no-dupe-keys': ERROR,
      // almost certainly a bug
      'no-duplicate-case': WARNING,
      // almost certainly a bug
      'no-empty-character-class': WARNING,
      // would warn on uncommented empty `catch (ex) {}` blocks
      'no-empty': OFF,
      // can cause subtle bugs in IE 8, and we shouldn't do this anyways
      'no-ex-assign': WARNING,
      // we shouldn't do this anyways
      'no-extra-boolean-cast': WARNING,
      // parens may be used to improve clarity, equivalent to jshint W068
      'no-extra-parens': [WARNING, 'functions'],
      // equivalent to jshint W032
      'no-extra-semi': WARNING,
      // a function delaration shouldn't be rewritable
      'no-func-assign': ERROR,
      // babel and es6 allow block-scoped functions
      'no-inner-declarations': OFF,
      // will cause a runtime error
      'no-invalid-regexp': WARNING,
      // disallow non-space or tab whitespace characters
      'no-irregular-whitespace': WARNING,
      // write `if (!(a in b))`, not `if (!a in b)`, equivalent to jshint W007
      'no-negated-in-lhs': ERROR,
      // will cause a runtime error
      'no-obj-calls': ERROR,
      // improves legibility
      'no-regex-spaces': WARNING,
      // equivalent to jshint elision
      'no-sparse-arrays': ERROR,
      // equivalent to jshint W027
      'no-unreachable': ERROR,
      // equivalent to jshint use-isnan
      'use-isnan': ERROR,
      // probably too noisy ATM
      'valid-jsdoc': OFF,
      // equivalent to jshint notypeof
      'valid-typeof': ERROR,
      // we already require semicolons
      'no-unexpected-multiline': OFF,

      // Best Practices <http://eslint.org/docs/rules/#best-practices>

      // probably a bug, we shouldn't actually even use this yet, because of IE8
      'accessor-pairs': [WARNING, {setWithoutGet: true}],
      // probably too noisy ATM
      'block-scoped-var': OFF,
      // cyclomatic complexity, we're too far gone
      'complexity': OFF,
      // require return statements to either always or never specify values
      'consistent-return': WARNING,
      // style guide: Always use brackets, even when optional.
      'curly': [WARNING, 'all'],
      // we don't do this/care about this
      'default-case': OFF,
      // disabled in favor of our temporary fork
      'dot-notation': OFF,
      // we don't do this/care about this, but probably should eventually
      'dot-location': OFF,
      // disabled as it's too noisy ATM
      'eqeqeq': [OFF, 'allow-null'],
      // we don't do this/care about this, equivalent to jshint forin
      'guard-for-in': OFF,
      // we have too many internal examples/tools using this
      'no-alert': OFF,
      // incompatible with 'use strict' equivalent to jshint noarg
      'no-caller': ERROR,
      // we don't care about this right now, but might later
      'no-case-declarations': OFF,
      // we don't do this/care about this
      'no-div-regex': OFF,
      // we don't do this/care about this
      'no-else-return': OFF,
      // avoid mistaken variables when destructuring
      'no-empty-pattern': WARNING,
      // see eqeqeq: we explicitly allow this, equivalent to jshint eqnull
      'no-eq-null': OFF,
      // equivalent to jshint evil
      'no-eval': ERROR,
      // should only be triggered on polyfills, which we can fix case-by-case
      'no-extend-native': WARNING,
      // might be a sign of a bug
      'no-extra-bind': WARNING,
      // equivalent to jshint W089
      'no-fallthrough': WARNING,
      // equivalent to jshint W008
      'no-floating-decimal': ERROR,
      // implicit coercion is often idiomatic
      'no-implicit-coercion': OFF,
      // equivalent to jshint evil/W066
      'no-implied-eval': ERROR,
      // will likely create more signal than noise
      'no-invalid-this': OFF,
      // babel should handle this fine
      'no-iterator': OFF,
      // Should be effectively equivalent to jshint W028 - allowing the use
      // of labels in very specific situations. ESLint no-empty-labels was
      // deprecated.
      'no-labels': [ERROR, {allowLoop: true, allowSwitch: true}],
      // lone blocks create no scope, will ignore blocks with let/const
      'no-lone-blocks': WARNING,
      // equivalent to jshint loopfunc
      'no-loop-func': OFF,
      // we surely have these, don't bother with it
      'no-magic-numbers': OFF,
      // we may use this for alignment in some places
      'no-multi-spaces': OFF,
      // equivalent to jshint multistr, consider using es6 template strings
      'no-multi-str': ERROR,
      // equivalent to jshint W02OFF, similar to no-extend-native
      'no-native-reassign': ERROR,
      // equivalent to jshint evil/W054
      'no-new-func': ERROR,
      // don't use constructors for side-effects, equivalent to jshint nonew
      'no-new': WARNING,
      // very limited uses, mostly in third_party
      'no-new-wrappers': WARNING,
      // deprecated in ES5, but we still use it in some places
      'no-octal-escape': WARNING,
      // deprecated in ES5, may cause unexpected behavior
      'no-octal': WARNING,
      // treats function parameters as constants, probably too noisy ATM
      'no-param-reassign': OFF,
      // only relevant to node code
      'no-process-env': OFF,
      // deprecated in ES3.WARNING, equivalent to jshint proto
      'no-proto': ERROR,
      // jshint doesn't catch this, but this is inexcusable
      'no-redeclare': WARNING,
      // equivalent to jshint boss
      'no-return-assign': OFF,
      // equivalent to jshint scripturl
      'no-script-url': ERROR,
      // not in jshint, but is in jslint, and is almost certainly a mistake
      'no-self-compare': WARNING,
      // there are very limited valid use-cases for this
      'no-sequences': WARNING,
      // we're already pretty good about this, and it hides stack traces
      'no-throw-literal': ERROR,
      // breaks on `foo && foo.bar()` expression statements, which are common
      'no-unused-expressions': OFF,
      // disallow unnecessary .call() and .apply()
      'no-useless-call': WARNING,
      // disallow concatenating string literals
      'no-useless-concat': WARNING,
      // this has valid use-cases, eg. to circumvent no-unused-expressions
      'no-void': OFF,
      // this journey is 1% finished (allow TODO comments)
      'no-warning-comments': OFF,
      // equivalent to jshint withstmt
      'no-with': OFF,
      // require radix argument in parseInt, we do this in most places already
      'radix': WARNING,
      // we don't do this/care about this
      'vars-on-top': OFF,
      // equivalent to jshint immed
      'wrap-iife': OFF,
      // probably too noisy ATM
      'yoda': OFF,

      // Strict Mode <http://eslint.org/docs/rules/#strict-mode>
      // jshint wasn't checking this, and the compiler should add this anyways
      'strict': OFF,

      // Variables <http://eslint.org/docs/rules/#variables>
      // we don't do this/care about this
      'init-declarations': OFF,
      // equivalent to jshint W002, catches an IE8 bug
      'no-catch-shadow': ERROR,
      // equivalent to jshint W051, is a strict mode violation
      'no-delete-var': ERROR,
      // we should avoid labels anyways
      'no-label-var': WARNING,
      // redefining undefined, NaN, Infinity, arguments, and eval is bad, mkay?
      'no-shadow-restricted-names': WARNING,
      // a definite code-smell, but probably too noisy
      'no-shadow': OFF,
      // it's nice to be explicit sometimes: `let foo = undefined;`
      'no-undef-init': OFF,
      // equivalent to jshint undef, turned into an error in getConfig
      'no-undef': WARNING,
      // using undefined is safe because we enforce no-shadow-restricted-names
      'no-undefined': OFF,
      // equivalent to jshint unused
      'no-unused-vars': [WARNING, {args: 'none', varsIgnorePattern: '^_'}],
      // too noisy
      'no-use-before-define': OFF,

      // Node.js <http://eslint.org/docs/rules/#nodejs>
      // TODO: turn some of these on in places where we lint node code
      'callback-return': OFF,
      'global-require': OFF,
      'handle-callback-err': OFF,
      'no-mixed-requires': OFF,
      'no-new-require': OFF,
      'no-path-concat': OFF,
      'no-process-exit': OFF,
      'no-restricted-modules': OFF,
      'no-sync': OFF,

      // Stylistic Issues <http://eslint.org/docs/rules/#stylistic-issues>
      // See also: https://our.intern.facebook.com/intern/dex/style-guide/
      'array-bracket-spacing': WARNING,
      // TODO: enable this with consensus on single line blocks
      'block-spacing': OFF,
      'brace-style': [WARNING, '1tbs', {allowSingleLine: true}],
      // too noisy at the moment, and jshint didn't check it
      'camelcase': [OFF, {properties: 'always'}],
      'comma-spacing': [WARNING, {before: false, after: true}],
      // jshint had laxcomma, but that was against our style guide
      'comma-style': [WARNING, 'last'],
      'computed-property-spacing': [WARNING, 'never'],
      // we may use more contextually relevant names for this than self
      'consistent-this': [OFF, 'self'],
      // should be handled by a generic TXT linter instead
      'eol-last': OFF,
      'func-names': OFF,
      // too noisy ATM
      'func-style': [OFF, 'declaration'],
      // no way we could enforce min/max lengths or patterns for vars
      'id-length': OFF,
      'id-match': OFF,
      // we weren't enforcing this with jshint, so erroring would be too noisy
      'indent': [WARNING, INDENT_SIZE, {SwitchCase: 1}],
      // we use single quotes for JS literals, double quotes for JSX literals
      'jsx-quotes': [WARNING, 'prefer-double'],
      // we may use extra spaces for alignment
      'key-spacing': [OFF, {beforeColon: false, afterColon: true}],
      'keyword-spacing': [WARNING],
      'lines-around-comment': OFF,
      // should be handled by a generic TXT linter instead
      'linebreak-style': [OFF, 'unix'],
      'max-depth': OFF,
      'max-len': [WARNING, 80, INDENT_SIZE,
        {'ignorePattern': maxLenIgnorePattern, 'ignoreUrls': true},
      ],
      'max-nested-callbacks': OFF,
      'max-params': OFF,
      'max-statements': OFF,
      // https://facebook.com/groups/995898333776940/1027358627297577
      'new-cap': OFF,
      // equivalent to jshint W058
      'new-parens': ERROR,
      'newline-after-var': OFF,
      'no-array-constructor': ERROR,
      'no-bitwise': WARNING,
      'no-continue': OFF,
      'no-inline-comments': OFF,
      // doesn't play well with `if (__DEV__) {}`
      'no-lonely-if': OFF,
      // stopgap, irrelevant if we can eventually turn `indent` on to error
      'no-mixed-spaces-and-tabs': ERROR,
      // don't care
      'no-multiple-empty-lines': OFF,
      'no-negated-condition': OFF,
      // we do this a bunch of places, and it's less bad with proper indentation
      'no-nested-ternary': OFF,
      // similar to FacebookWebJSLintLinter's checkPhpStyleArray
      'no-new-object': WARNING,
      'no-plusplus': OFF,
      'no-restricted-syntax': OFF,
      'no-spaced-func': WARNING,
      'no-ternary': OFF,
      // should be handled by a generic TXT linter instead
      'no-trailing-spaces': OFF,
      // we use this for private/protected identifiers
      'no-underscore-dangle': OFF,
      // disallow `let isYes = answer === 1 ? true : false;`
      'no-unneeded-ternary': WARNING,
      // too noisy ATM
      'object-curly-spacing': OFF,
      // makes indentation warnings clearer
      'one-var': [WARNING, {initialized: 'never'}],
      // prefer `x += 4` over `x = x + 4`
      'operator-assignment': [WARNING, 'always'],
      // equivalent to jshint laxbreak
      'operator-linebreak': OFF,
      'padded-blocks': OFF,
      // probably too noisy on pre-ES5 code
      'quote-props': [OFF, 'as-needed'],
      'quotes': [
        WARNING,
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      'require-jsdoc': OFF,
      'semi-spacing': [WARNING, {before: false, after: true}],
      // equivalent to jshint asi/W032
      'semi': [WARNING, 'always'],
      'sort-vars': OFF,
      // require `if () {` instead of `if (){`
      'space-before-blocks': [WARNING, 'always'],
      // require `function foo()` instead of `function foo ()`
      'space-before-function-paren': [
        WARNING,
        {anonymous: 'never', named: 'never'},
      ],
      // incompatible with our legacy inline type annotations
      'space-in-parens': [OFF, 'never'],
      'space-infix-ops': [WARNING, {int32Hint: true}],
      'space-unary-ops': [WARNING, {words: true, nonwords: false}],
      // TODO: Figure out a way to do this that doesn't break typechecks
      // or wait for https://github.com/eslint/eslint/issues/2897
      'spaced-comment':
        [OFF, 'always', {exceptions: ['jshint', 'jslint', 'eslint', 'global']}],
      'wrap-regex': OFF,

      // ECMAScript 6 <http://eslint.org/docs/rules/#ecmascript-6>
      'arrow-body-style': OFF,
      // Forked to fb-www/arrow-parens to fix issues with flow and add fixer
      'arrow-parens': OFF,
      // tbgs finds *very few* places where we don't put spaces around =>
      'arrow-spacing': [WARNING, {before: true, after: true}],
      // violation of the ES6 spec, won't transform
      'constructor-super': ERROR,
      // https://github.com/babel/babel-eslint#known-issues
      'generator-star-spacing': OFF,
      'no-class-assign': WARNING,
      'no-confusing-arrow': OFF,
      // this is a runtime error
      'no-const-assign': ERROR,
      'no-dupe-class-members': ERROR,
      // violation of the ES6 spec, won't transform, `this` is part of the TDZ
      'no-this-before-super': ERROR,
      'no-useless-computed-key': WARNING,
      // we have way too much ES3 & ES5 code
      'no-var': OFF,
      'object-shorthand': OFF,
      'prefer-const': OFF,
      'prefer-spread': OFF,
      // we don't support/polyfill this yet
      'prefer-reflect': OFF,
      'prefer-template': OFF,
      // there are legitimate use-cases for an empty generator
      'require-yield': OFF,

      // eslint-plugin-babel <https://github.com/babel/eslint-plugin-babel>
      'babel/generator-star-spacing': OFF,
      'babel/new-cap': OFF,
      'babel/array-bracket-spacing': OFF,
      'babel/object-curly-spacing': OFF,
      'babel/object-shorthand': OFF,
      'babel/arrow-parens': OFF,
      'babel/no-await-in-loop': OFF,
      'babel/flow-object-type': [WARNING, 'comma'],

      // eslint-plugin-react <https://github.com/yannickcr/eslint-plugin-react>
      // TODO: We're being extremely conservative here as we roll out eslint on
      // www. As we finish rollout, we can turn on more of these, and replace
      // some legacy regex rules in the process.
      'react/display-name': OFF,
      'react/forbid-prop-types': OFF,
      'react/jsx-boolean-value': OFF,
      'react/jsx-closing-bracket-location': OFF,
      'react/jsx-curly-spacing': OFF,
      'react/jsx-equals-spacing': WARNING,
      'react/jsx-filename-extension': OFF,
      'react/jsx-first-prop-new-line': OFF,
      'react/jsx-handler-names': OFF,
      'react/jsx-indent': OFF,
      'react/jsx-indent-props': OFF,
      'react/jsx-key': OFF,
      'react/jsx-max-props-per-line': OFF,
      'react/jsx-no-bind': OFF,
      'react/jsx-no-duplicate-props': ERROR,
      'react/jsx-no-literals': OFF,
      'react/jsx-no-target-blank': OFF,
      'react/jsx-no-undef': ERROR,
      'react/jsx-pascal-case': OFF,
      'react/jsx-sort-props': OFF,
      'react/jsx-space-before-closing': OFF,
      // forked to fb-www/jsx-uses-react
      'react/jsx-uses-react': OFF,
      'react/jsx-uses-vars': ERROR,
      'react/jsx-wrap-multilines': OFF,
      'react/no-comment-textnodes': OFF,
      'react/no-danger': OFF,
      'react/no-deprecated': OFF,
      'react/no-did-mount-set-state': OFF,
      'react/no-did-update-set-state': OFF,
      'react/no-direct-mutation-state': OFF,
      'react/no-is-mounted': WARNING,
      'react/no-multi-comp': OFF,
      'react/no-render-return-value': OFF,
      'react/no-set-state': OFF,
      'react/no-string-refs': OFF,
      'react/no-unknown-property': OFF,
      'react/prefer-es6-class': OFF,
      'react/prefer-stateless-function': OFF,
      'react/prop-types': OFF,
      // forked to fb-www/react-in-jsx-scope
      'react/react-in-jsx-scope': OFF,
      'react/require-extension': OFF,
      'react/require-optimization': OFF,
      'react/require-render-return': OFF,
      'react/self-closing-comp': OFF,
      'react/sort-comp': OFF,
      'react/sort-prop-types': OFF,

      // JSX Accessibility checks
      'jsx-a11y/accessible-emoji': OFF,
      'jsx-a11y/anchor-has-content': OFF,
      'jsx-a11y/aria-activedescendant-has-tabindex': OFF,
      'jsx-a11y/aria-props': WARNING,
      'jsx-a11y/aria-proptypes': OFF,
      'jsx-a11y/aria-role': WARNING,
      'jsx-a11y/aria-unsupported-elements': OFF,
      'jsx-a11y/click-events-have-key-events': OFF,
      'jsx-a11y/heading-has-content': OFF,
      'jsx-a11y/html-has-lang': OFF,
      'jsx-a11y/iframe-has-title': OFF,
      'jsx-a11y/img-has-alt': OFF,
      'jsx-a11y/img-redundant-alt': OFF,
      'jsx-a11y/interactive-supports-focus': [
        WARNING,
        {
          tabbable: [
            'button',
            'checkbox',
            'link',
            'searchbox',
            'spinbutton',
            'switch',
            'textbox',
          ],
        },
      ],
      'jsx-a11y/label-has-for': OFF,
      'jsx-a11y/lang': OFF,
      'jsx-a11y/mouse-events-have-key-events': OFF,
      'jsx-a11y/no-access-key': OFF,
      'jsx-a11y/no-autofocus': OFF,
      'jsx-a11y/no-distracting-elements': OFF,
      'jsx-a11y/no-interactive-element-to-noninteractive-role': [
        WARNING,
        {
          tr: ['none', 'presentation'],
        },
      ],
      'jsx-a11y/no-noninteractive-element-interactions': [
        WARNING,
        {
          handlers: ['onClick'],
        },
      ],
      'jsx-a11y/no-noninteractive-element-to-interactive-role': [
        WARNING,
        {
          ul: ['listbox', 'menu', 'menubar',
            'radiogroup', 'tablist', 'tree', 'treegrid'],
          ol: ['listbox', 'menu', 'menubar',
            'radiogroup', 'tablist', 'tree', 'treegrid'],
          li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
          table: ['grid'],
          td: ['gridcell'],
        },
      ],
      'jsx-a11y/no-noninteractive-tabindex': WARNING,
      'jsx-a11y/no-onchange': OFF,
      'jsx-a11y/no-redundant-roles': OFF,
      'jsx-a11y/no-static-element-interactions': [
        WARNING,
        {
          handlers: ['onClick'],
        },
      ],
      'jsx-a11y/role-has-required-aria-props': WARNING,
      'jsx-a11y/role-supports-aria-props': WARNING,
      'jsx-a11y/scope': OFF,
      'jsx-a11y/tabindex-no-positive': WARNING,

      // eslint-plugin-ft-flow
      // These don't actually result in warnings. Enabling them ensures they run
      // and mark variables as used, avoiding false positives with Flow
      // annotations.
      'ft-flow/define-flow-type': WARNING,
      'ft-flow/use-flow-type': WARNING,
    },

    // Defines a basic set of globals
    env: {
      browser: true,
      es6: true,
    },

    globals: shared.globals,

  };
}

// Override some rules for open source. Due to the way we apply our configuation
// internally, these are effectively part of the same configuration we apply.
var config = getBaseConfig();
var extendedConfig = {
  env: {
    // Enable these blindly because we can't make a per-file decision about this.
    node: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    // just turned into an error here since we almost always do that anyway.
    'no-undef': ERROR,

    // Re-enable some forked rules. Good enough for open source
    'comma-dangle': [WARNING, 'always-multiline'],

    'react/jsx-uses-react': ERROR,
    'react/react-in-jsx-scope': ERROR,

    // To keep base config in sync with internal codebase but still make
    // open source happy, disable a deprecated rule and enable different one.
    'babel/flow-object-type': OFF,
    'ft-flow/object-type-delimiter': [WARNING, 'comma'],
  },
};

Object.keys(extendedConfig).forEach((key) => {
  config[key] = Object.assign(config[key], extendedConfig[key]);
});

module.exports = config;
