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
    
    /* It's worth noting what's happening here; mainly the pathTokens
     * aspect.
     *
     * In order to dynamically build and check each existing possible
     * path to the end path, we need to split the end path on the
     * path seperator. Using path.sep gives us an OS independent way
     * of handling the seperator to split on:
     *
     * See: http://nodejs.org/api/path.html#path_path_sep
     *
     * That gives us an array of path tokens with the first one being
     * an empty string (''). We filter that out.
     *
     * Later on, when we create the paths, we rebuild the end path by
     * adding the current token to the previously used tokens, check
     * for an existing path, and create it if it doesn't exist.
     */
    var location  = build.config.paths[key],
        pathTokens = location
          .split(path.sep)
          .filter(function (token) {
            if(token !== ''){ return token; }
          });
    return {location: location, tokens: pathTokens};
  });

  return {
    create: function (callback) {
      var locations = paths.forEach(function (directory) {
        fs.mkdirRecursiveSync(directory.location);
        return directory.location;
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
