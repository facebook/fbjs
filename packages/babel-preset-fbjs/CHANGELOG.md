## [Unreleased]


## [2.1.0] - 2016-10-07

### Added
- Modules using `__DEV__` will have the declaration inlined for `.js.flow` file generation.

### Fixed
- `typeof` imports are properly rewritten.


## [2.0.0] - 2016-05-25

### Added
- More syntaxes are parsed for `.js.flow` file generation: `babel-plugin-syntax-class-properties` & `babel-plugin-syntax-jsx`
- More transforms are applied for ES2015 and React support: `babel-plugin-transform-es2015-function-name`, `babel-plugin-transform-react-display-name`, `babel-plugin-transform-react-jsx`
- New custom transform to convert `Object.assign` to `require('object-assign')`, ensuring the use of a ponyfill that checks for a spec-compliant `Object.assign`.

### Fixed
- Type imports are properly rewritten with the rewrite-modules transform.


## [1.0.0] - 2016-04-28

### Added
- Initial release as a separate module.
