var path = require('path'),
    fs   = require('fs');

var config = {
  paths: {
    library: '',
    destination: '',
    preview: ''
  }
};

module.exports = function (options) {
  return {
    config: config
  };
};
