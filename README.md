# FBJS

This is a patched version of Facebook/Meta's Fbjs repo. This includes a fix for [CVE-2022-25927](https://www.tenable.com/cve/CVE-2022-25927)

## How to add as an yarn / npm dependency

### yarn
```
yarn add 'https://gitpkg.now.sh/hiddensanctum/fbjs/packages/fbjs?main'
```

### npm
```
npm install 'https://gitpkg.now.sh/hiddensanctum/fbjs/packages/fbjs?main'
```

The above installed rely on [gitpkg](https://github.com/EqualMa/gitpkg) to use a sub directory in a github repo as yarn / npm dependency


Below is the original readme from Facebook/Meta:

---

## Purpose

To make it easier for Facebook to share and consume our own JavaScript. Primarily this will allow us to ship code without worrying too much about where it lives, keeping with the spirit of `@providesModule` but working in the broader JavaScript ecosystem.

For more information on how to build and use FBJS, click [here](https://github.com/facebook/fbjs/tree/main/packages/fbjs). This library includes a number of packages that can be accessed in the [packages](https://github.com/facebook/fbjs/tree/main/packages) folder. For more information on what each package does and how to run it, access the individual package from within the folder.

**Note:** If you are consuming the code here and you are not also a Facebook project, be prepared for a bad time. APIs may appear or disappear and we may not follow semver strictly, though we will do our best to. This library is being published with our use cases in mind and is not necessarily meant to be consumed by the broader public. In order for us to move fast and ship projects like React and Relay, we've made the decision to not support everybody. We probably won't take your feature requests unless they align with our needs. There will be overlap in functionality here and in other open source projects.

## License

FBJS and the other packages included here are MIT licensed, as found in the LICENSE file.
