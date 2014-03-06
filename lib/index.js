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
  // if (options['library'] == '')     {throw new Error("Library must not be blank")}
  // if (options['destination'] == '') {throw new Error("Destination must not be blank")}
  // if (options['preview'] == '')     {throw new Error("Preview must not be blank")}

  config.env = process.env.NODE_ENV || 'development'
  return {
    config: config.merge(options)
  };
};
