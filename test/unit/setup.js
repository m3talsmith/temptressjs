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
    var temptress = new TemptressJs({
      paths: {library: 'templates'}
    });
    assert(temptress.config);
  });

  it('has a valid config', function () {
    var temptress = new TemptressJs({
      paths: {library: 'templates'}
    });
    assert(temptress.config);
    assert(temptress.config.paths);
    assert.equal(temptress.config.paths.library, 'templates');
  });

  describe('config.env', function () {
    it('defaults to development', function () {
      delete process.env['NODE_ENV'];

      var temptress = new TemptressJs();
      process.env.NODE_ENV = 'test';

      assert.equal('development', temptress.config.env);
    });

    it('sets to current environment', function(){
      process.env.NODE_ENV = 'test';
      var temptress = new TemptressJs();

      assert(temptress.config.env);
      assert(temptress.config.env == 'test');
    });
  });

  describe('config.paths', function () {
    var temptress;

    before(function () {
      temptress = new TemptressJs();
    });

    // Defining relevant variables to be initialized by TemplRun. 
    // Boiler plate, but here to demonstrate primary functionality
    it('sets a destination path', function(){
      assert(!temptress.config.paths.destination);
      temptress.config.paths.destination = 'destination';
      assert(temptress.config.paths.destination);
      assert.equal('destination', temptress.config.paths.destination);
    });

    it('sets a library path', function(){
      // assert(!temptress.config.paths.library);
      temptress.config.paths.library = 'library';
      assert(temptress.config.paths.library);
      assert.equal('library', temptress.config.paths.library);
    });

    it('sets a preview path', function(){
      assert(!temptress.config.paths.preview);
      temptress.config.paths.preview = 'preview';
      assert(temptress.config.paths.preview);
      assert.equal('preview', temptress.config.paths.preview);
    });

    it('sets an approved path', function(){
      assert(!temptress.config.paths.approved);
      temptress.config.paths.approved = 'approved';
      assert(temptress.config.paths.approved);
      assert.equal('approved', temptress.config.paths.approved);
    });
  });

  describe('paths.create', function () {
    var testPaths = path.join(__dirname, '../..', '.tmp', 'test');

    before(function(){
      fs.mkdirSync(testPaths);
    });

    after(function() {
      fs.rmdirSync(testPaths);
    });

    it('creates a destination path', function (done) {
      var temptress = new TemptressJs({
        paths: {
          destination: path.join(testPaths, 'destination')
        }
      });
      assert(!fs.existsSync(temptress.config.paths.destination));
      temptress.paths.create(function () {
        assert(fs.existsSync(temptress.config.paths.destination));
        fs.rmdirSync(temptress.config.paths.destination);
        done();
      });
    });

    it('creates a library path', function(done){
      var temptress = new TemptressJs({
        paths: {
          library: path.join(testPaths, 'library')
        }
      });
      assert(!fs.existsSync(temptress.config.paths.library));
      temptress.paths.create(function () {
        assert(fs.existsSync(temptress.config.paths.library));
        fs.rmdirSync(temptress.config.paths.library);
        done();
      });
    });

    it('creates a preview path', function(done){
      var temptress = new TemptressJs({
        paths: {
          preview: path.join(testPaths, 'preview')
        }
      });
      assert(!fs.existsSync(temptress.config.paths.preview));
      temptress.paths.create(function () {
        assert(fs.existsSync(temptress.config.paths.preview));
        fs.rmdirSync(temptress.config.paths.preview);
        console.log('preview tested');
        done();
      });
    });
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
