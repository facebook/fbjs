# eslint-config-fbjs

For the most part, this configuration matches the ESLint configuration we have internally at Facebook.

There are several exceptions:

- **No special cases for projects.** Some projects have stricter lint rules. Those configurations are not present here. If you open source a project with different configuration, just specify the overrides in your own repository's `.eslintrc`
- **No fb-specific rules.** We have a number of custom rules internally that are not synced out. We may do that in the future. This means there are several things which we will not catch here but will be caught in Phabricator. Beware of that when relying on this configuration as your only linting process.

## Usage

### Install:

#### `npm`
```sh
npm install --save-dev eslint-config-fbjs eslint-plugin-babel eslint-plugin-flowtype eslint-plugin-jasmine eslint-plugin-prefer-object-spread eslint-plugin-react eslint babel-eslint
```

#### `yarn`
```sh
yarn add --dev eslint-config-fbjs eslint-plugin-babel eslint-plugin-flowtype eslint-plugin-jasmine eslint-plugin-prefer-object-spread eslint-plugin-react eslint babel-eslint
```

### Configure

Add `extends: 'fbjs'` to your local `.eslintrc`

#### Strict Configuration

This package also comes with a *strict* version of the config. This can be used to make all warnings be reported as errors. While this can be overly strict, it can be helpful to avoid the case where some CI configurations don't fail for warnings.

Use `extends: fbjs/strict` in your `.eslintrc`

#### Open Source configuration

This configuration is a new ideal setup based on Facebook's internal configurations combined with the configurations that our open source projects are trending towards in a more modern code base. In particular, this is strongly based on Nuclide's ESLint rules. It has far more rules enabled and enforces a stricter style.

Use `extends: fbjs/opensource` in your `.eslintrc` for a mix of warnings and errors *or* use `fbjs/opensource/warning` if you prefer to only use the warning level.
