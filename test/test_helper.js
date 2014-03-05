process.env.NODE_ENV = 'test';

chai   = require('chai');
assert = chai.assert;
should = chai.should;
expect = chai.expect;
chai.use(require('chai-fs'));
