var path  = require('path'),
    fs    = require('fs'),
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
        var finishedTokens = [path.sep];

        directory.tokens.forEach(function (token) {
          var currentPath = path.join.apply(
            null,
            finishedTokens.concat(token)
          );

          if(!fs.existsSync(currentPath)) fs.mkdirSync(currentPath);
          finishedTokens.push(token);
        });

        return path.join.apply(null, finishedTokens);
      });

      if(callback)  callback(locations);
      if(!callback) return locations;
    }
  };
};

var cloneLibrary = function (library, callback) {
  var templateNodes = fs.readdirSync(library.path);
  
  // TODO: replace flat copy with nested copy
  templateNodes.forEach(function (templateNode) {
    var libraryFile     = path.join(library.path, templateNode);
    var destinationFile = path.join(library.destination, templateNode);
    fs.writeFileSync(destinationFile, fs.readFileSync(libraryFile));
  });
  callback();
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
