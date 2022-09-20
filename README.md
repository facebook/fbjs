# FBJS

## Purpose

To make it easier for Facebook to share and consume our own JavaScript. Primarily this will allow us to ship code without worrying too much about where it lives, keeping with the spirit of `@providesModule` but working in the broader JavaScript ecosystem.

For more information on how to build and use FBJS, click [here](https://github.com/facebook/fbjs/tree/main/packages/fbjs). This library includes a number of packages that can be accessed in the [packages](https://github.com/facebook/fbjs/tree/main/packages) folder. For more information on what each package does and how to run it, access the individual package from within the folder. 

**Note:** If you are consuming the code here and you are not also a Facebook project, be prepared for a bad time. APIs may appear or disappear and we may not follow semver strictly, though we will do our best to. This library is being published with our use cases in mind and is not necessarily meant to be consumed by the broader public. In order for us to move fast and ship projects like React and Relay, we've made the decision to not support everybody. We probably won't take your feature requests unless they align with our needs. There will be overlap in functionality here and in other open source projects.

## License

FBJS and the other packages included here are MIT licensed, as found in the LICENSE file.
