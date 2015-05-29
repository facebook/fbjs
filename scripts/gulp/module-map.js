var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var path = require('path');

var PM_REGEXP = /\n \* \@providesModule (\S+)\n/

module.exports = function(moduleMapFile) {
  // Assume file is a string for now
  var moduleMap = {};

  function transform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('module-map', 'Streaming not supported'));
      return;
    }

    // Get the @providesModule piece of out the file and save that.
    var matches = file.contents.toString().match(PM_REGEXP);
    if (matches) {
      moduleMap[matches[1]] = 'fbjs/lib/' + path.basename(file.path, '.js');
    }
    this.push(file);
    cb();
  }

  function flush(cb) {
    // Keep it ABC order for better diffing.
    var map = Object.keys(moduleMap).sort().reduce(function(prev, curr) {
      prev[curr] = moduleMap[curr];
      return prev;
    }, {})
    fs.writeFile(moduleMapFile, JSON.stringify(map, null, 2), 'utf-8', function() {
      // avoid calling cb with fs.write callback data
      cb();
    });
  }

  return through.obj(transform, flush);
}
