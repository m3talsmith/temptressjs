var path  = require('path'),
    fs    = require('fs.extra'),
    merge = require('merge');

/* Config
 * ======
 *
 * Returns a configuration that holds:
 * 
 * - The current environment
 * - Paths for storing and using templates:
 *   - library
 *   - preview
 *   - approved
 *   - destination
 * - merge: A function to merge config options with the current options
 */

var config = {
  paths: {}
};

var createPaths = function (build) {
  var keys  = Object.keys(build.config.paths);
  var paths = keys.map(function (key) {
    var location  = build.config.paths[key];
    return location;
  });

  return {
    create: function (callback) {
      var locations = paths.forEach(function (location) {
        fs.mkdirRecursiveSync(location);
        return location;
      });

      if(callback)  callback(locations);
      if(!callback) return locations;
    }
  };
};

var cloneLibrary = function (library, callback) {
  fs.copyRecursive(library.path, library.destination, function (error) {
    if(error) throw error;
    callback();
  });
};

var createLibrary = function (build) {
  return {
    path: build.config.paths.library,
    destination: build.config.paths.destination,
    clone: function (callback) {
      build.paths.create(function () {
        cloneLibrary(build.library, callback);
      });
    }
  };
};

module.exports = function (options) {
  var newConfig  = config;
  newConfig.env  = process.env.NODE_ENV || 'development'

  if(options) merge(newConfig, options);

  temptressBuild = {};
  temptressBuild.config  = newConfig;
  temptressBuild.paths   = createPaths(temptressBuild);
  temptressBuild.library = createLibrary(temptressBuild);
  
  return temptressBuild;
};
