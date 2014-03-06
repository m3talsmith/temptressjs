var path  = require('path'),
    fs    = require('fs'),
    merge = require('merge');

var config = {
  paths: {
    library: '',
    destination: '',
    preview: ''
  },
  merge: function (options) {
    if(options) { return merge(config, options); }
    else        { return config; }
  }
};

module.exports = function (options) {
  return {
    config: config.merge(options)
  };
};
