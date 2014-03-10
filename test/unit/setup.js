var path        = require('path'),
    fs          = require('fs');

require(path.join('..', 'test_helper'));

var TemptressJs = require(path.join('..', '..', 'lib', 'index'));

describe('setup', function () {
  it('returns a temptress object without params setup', function () {
    var temptress = new TemptressJs();
    assert(temptress.config);
  });

  it('returns a temptress object with params setup', function () {
    var temptress = new TemptressJs({
      paths: {templates: 'templates'}
    });
    assert(temptress.config);
  });

  it('has a valid config', function () {
    var temptress = new TemptressJs({
      paths: {templates: 'templates'}
    });
    assert(temptress.config);
    assert(temptress.config.paths);
    assert.equal(temptress.config.paths.templates, 'templates');
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

    beforeEach(function (done) {
      temptress = new TemptressJs();
      done();
    });

    afterEach(function (done) {
      temptress = {};
      done();
    });

    it('sets a destination path', function(){
      assert(!temptress.config.paths.destination);
      temptress.config.paths.destination = 'destination';
      assert(temptress.config.paths.destination);
      assert.equal('destination', temptress.config.paths.destination);
    });

    it('sets a templates path', function(){
      assert.equal(undefined, temptress.config.paths.libraryTemplates);
      temptress.config.paths.libraryTemplates = 'templates';
      assert(temptress.config.paths.libraryTemplates);
      assert.equal('templates', temptress.config.paths.libraryTemplates);
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
    var testPaths = path.join(__dirname, '..', '..', '.tmp', 'test');

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
        done();
      });
    });
  });

  describe('library.clone', function () {
    var temptress,
        testPath = path.join(__dirname, '..', '..', '.tmp', 'test');

    before(function () {
      temptress = new TemptressJs({
        paths: {
          library: path.join(testPath, 'library'),
          destination: path.join(testPath, 'templates')
        }
      });
    });

    after(function () {
      fs.rmdirSync(testPath);
    });

    it('has a library', function () {
      assert(temptress.library);
    });

    it('library has a path', function () {
      assert.equal(
        temptress.library.path,
        temptress.config.paths.library
      );
    });

    it('library has a destination', function () {
      assert.equal(
        temptress.library.destination,
        temptress.config.paths.destination
      );
    });

    it('library has a clone function', function () {
      assert(temptress.library.clone, 'library.clone undefined');
    });

    it('creates missing directory structure', function (done) {
      assert(!fs.existsSync(temptress.library.path), temptress.library.path + ' exists');
      assert(!fs.existsSync(temptress.library.destination), temptress.library.destination + ' exists');

      temptress.library.clone(function () {
        assert.equal(fs.existsSync(temptress.library.path), true);
        assert.equal(fs.existsSync(temptress.library.destination), true);
  
        fs.rmdirSync(temptress.library.path);
        fs.rmdirSync(temptress.library.destination);
        done();
      });
    });

    it('clones library templates to destination', function (done) {
      var testLibraryFile     = path.join(temptress.library.path, 'index.html'),
          testDestinationFile = path.join(temptress.library.destination, 'index.html');

      temptress.paths.create(function () {
        var file = fs.openSync(testLibraryFile, 'w+');
        fs.writeSync(file, '<html><head><title>Test Template</title></head><body><h1>Test Template</h1></body></html>');
        fs.closeSync(file);

        assert(fs.existsSync(testLibraryFile), testLibraryFile + ' does not exist');
        assert(!fs.existsSync(testDestinationFile), testDestinationFile + ' exists');

        temptress.library.clone(function () {
          assert(fs.existsSync(testDestinationFile), testDestinationFile + ' does not exist');

          /* fs.unlinkSync deletes the file
           * See: http://nodejs.org/api/fs.html#fs_fs_unlinksync_path
           */
          fs.unlinkSync(testLibraryFile);
          fs.unlinkSync(testDestinationFile);
          fs.rmdirSync(temptress.library.path);
          fs.rmdirSync(temptress.library.destination);
          done();
        });
      });
    });

    /* Because our templates are most likely going to have multiple
     * directories with files in them, we need to test for that.
     * The library structure we are testing is:
     *
     * - (File)      index.html
     * - (Directory) css
     *   - (File)      screen.css
     * - (Directory) js
     *   - (File)      application.js
     */
    it('clones deep library templates to destination', function (done) {
      temptress.paths.create(function () {
        var testCssPath      = path.join(temptress.library.path, 'css'),
            testJsPath       = path.join(temptress.library.path, 'js'),
            testHtmlFilePath = path.join(temptress.library.path, 'index.html'),
            testCssFilePath  = path.join(temptress.library.path, 'css', 'style.css'),
            testJsFilePath   = path.join(temptress.library.path, 'js', 'application.js');

        var destinationCssPath      = path.join(temptress.library.destination, 'css'),
            destinationJsPath       = path.join(temptress.library.destination, 'js'),
            destinationHtmlFilePath = path.join(temptress.library.destination, 'index.html'),
            destinationCssFilePath  = path.join(temptress.library.destination, 'css', 'style.css'),
            destinationJsFilePath   = path.join(temptress.library.destination, 'js', 'application.js');

        fs.mkdirSync(testCssPath);
        fs.mkdirSync(testJsPath);

        fs.writeFileSync(testHtmlFilePath, '<html><head><title>Test Template</title></head><body><h1>Test Template</h1></body></html>');
        fs.writeFileSync(testCssFilePath, 'h1 {text-decoration: underline;}');
        fs.writeFileSync(testJsFilePath, 'alert("blink");');


        temptress.library.clone(function () {
          assert(fs.existsSync(destinationCssPath), destinationCssPath + ' does not exist');
          assert(fs.existsSync(destinationJsPath), destinationJsPath + ' does not exist');
          assert(fs.existsSync(destinationHtmlFilePath), destinationHtmlFilePath + ' does not exist');
          assert(fs.existsSync(destinationCssFilePath), destinationCssFilePath + ' does not exist');
          assert(fs.existsSync(destinationJsFilePath), destinationJsFilePath + ' does not exist');

          assert.equal(fs.readFileSync(testHtmlFilePath), fs.readFileSync(destinationHtmlFilePath));
          assert.equal(fs.readFileSync(testCssFilePath), fs.readFileSync(destinationCssFilePath));
          assert.equal(fs.readFileSync(testJsFilePath), fs.readFileSync(destinationJsFilePath));

          fs.unlinkSync(testHtmlFilePath);
          fs.unlinkSync(testCssFilePath);
          fs.unlinkSync(testJsFilePath);

          fs.unlinkSync(destinationHtmlFilePath);
          fs.unlinkSync(destinationCssFilePath);
          fs.unlinkSync(destinationJsFilePath);

          fs.rmdirSync(testCssPath);
          fs.rmdirSync(testJsPath);

          fs.rmdirSync(destinationCssPath);
          fs.rmdirSync(destinationJsPath);

          fs.rmdirSync(temptress.library.path);
          fs.rmdirSync(temptress.library.destination);

          done();
        });
      });
    });
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
