# eslint-config-fbjs

For the most part, this configuration matches the ESLint configuration we have internally at Facebook.

There are several exceptions:

- **No special cases for projects.** Some projects have stricter lint rules. Those configurations are not present here. If you open source a project with different configuration, just specify the overrides in your own repository's `.eslintrc`
- **No plugins.** We make use of a number of third-party plugins internally. We don't sync that part of the config (yet).
- **No fb-specific rules.** We have a number of custom rules internally that are not synced out. We may do that in the future. This means there are several things which we will not catch here but will be caught in Phabricator. Beware of that when relying on this configuration as your only linting process.

## Usage

### Install:

```js
npm install --save-dev eslint-config-fbjs
```

### Configure

Add `extends: 'fbjs'` to your local `.eslintrc`
