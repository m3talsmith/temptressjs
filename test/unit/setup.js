require('../test_helper');

var path        = require('path'),
    fs          = require('fs');

var TemptressJs = require('../../lib/index');

describe('setup', function () {
  it('returns a temptress object without params setup', function () {
    var temptress = new TemptressJs();
    assert(temptress.config);
  });

  it('returns a temptress object with params setup', function () {
    var temptress   = new TemptressJs({
      paths: {library: 'templates'}
    });
    assert(temptress.config);
  });


  it('has a config');
  describe('config.env', function () {
    it('defaults to development');
    it('sets to current environment');
  });
  describe('config.paths', function () {
    it('sets a destination path');
    it('sets a library path');
    it('sets a preview path');
  });
  describe('paths.create', function () {
    it('creates a destination path');
    it('creates a library path');
    it('creates a preview path');
  });
  describe('library.clone', function () {
    it('copies library templates to destination path');
  });
  describe('library.templates', function () {
    it('has templates with template objects');
    describe('template', function () {
      it('has a path');
      it('has a name');
      it('has a preview path');
      describe('template.preview', function () {
        it('returns a preview object');
        describe('preview', function () {
          it('creates a preview path');
          it('copies template into preview path');
        });
      });
    });
  });
});
