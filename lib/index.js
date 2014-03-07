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

var paths = {
  create: function (options, callback) {
    if (options) { return config.merge(config, options); }
    else { return(callback); }
  }
};

module.exports = function (options) {
  config.env = process.env.NODE_ENV || 'development'
  return {
    config: config.merge(options),
    paths:  paths.create(options)
  };
};
