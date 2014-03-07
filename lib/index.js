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
  paths: {},
  merge: function (options) {
    if(options) { return merge(config, options); }
    else        { return config; }
  }
};

var createPaths = function (build) {
  var keys   = Object.keys(build.config.paths);
  var paths = keys.map(function (k) { return build.config.paths[k] });

  return {
    create: function (callback) {
      paths.forEach(function (path) {
        fs.mkdirSync(path);
      });
      if(callback) callback();
      return paths;
    }
  };
};

module.exports = function (options) {
  config.env     = process.env.NODE_ENV || 'development'
  config         = config.merge(options);
  temptressBuild = {};
  temptressBuild.config = config;
  temptressBuild.paths  = createPaths(temptressBuild);
  
  return temptressBuild;
};
