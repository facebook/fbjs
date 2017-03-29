# eslint-config-fbjs-opensource

This configuration is a new ideal setup based on Facebook's internal configurations combined with the configurations that our open source projects are trending towards in a more modern code base. In particular, this is strongly based on Nuclide's ESLint rules. It has far more rules enabled than our other configuration and enforces a stricter style.

## Usage

### Install:

#### `npm`
```sh
npm install --save-dev eslint eslint-config-fbjs-opensource
```

#### `yarn`
```sh
yarn add --dev eslint eslint-config-fbjs-opensource
```

### Configure

Add `extends: 'fbjs-opensource'` to your local `.eslintrc`

#### Warning Configuration

This package also comes with a *warning* version of the config. This can be used to make all rules that would normally be reported as errors to be reported as warnings.

Use `extends: 'fbjs-opensource/warning'` in your `.eslintrc`
