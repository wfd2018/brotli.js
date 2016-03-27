var fs = require('fs');
var assert = require('assert');
var brotli = require('../');
var decompress = require('../decompress');
var compress = require('../compress');

describe('brotli', function() {
  describe('compress', function() {
    it('should compress some binary data', function() {
      var data = fs.readFileSync('build/decode.js').slice(0, 1024 * 4);
      var res = brotli.compress(data);
      assert(res.length < data.length);
    });
    
    it('should compress some binary data using standalone version', function() {
      var data = fs.readFileSync('build/decode.js').slice(0, 1024 * 4);
      var res = compress(data);
      assert(res.length < data.length);
    });
    
    it('should compress some text data', function() {
      this.timeout(100000); // not sure why the first time text data is compressed it is slow...
      var data = fs.readFileSync('build/decode.js', 'utf8').slice(0, 1024 * 4);
      var res = brotli.compress(data, true);
      assert(res.length < data.length);
    });
    
    it('should compress some text data using standalone version', function() {
      var data = fs.readFileSync('build/decode.js', 'utf8').slice(0, 1024 * 4);
      var res = compress(data, true);
      assert(res.length < data.length);
    });
  });
  
  describe('decompress', function() {
    fs.readdirSync(__dirname + '/testdata').forEach(function(file) {
      if (!/\.compressed/.test(file)) return;
      
      it(file, function() {
        var compressed = fs.readFileSync(__dirname + '/testdata/' + file);
        var expected = fs.readFileSync(__dirname + '/testdata/' + file.replace(/\.compressed.*/, ''));
        var result = decompress(compressed);
        assert.deepEqual(new Buffer(result), expected);
      });
    });
  });
});
