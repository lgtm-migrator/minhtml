'use strict';

module.exports = function(grunt) {
  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      src: {
        options: {
          preBundleCB: function() {
            var fs = require('fs');
            var file = fs.readFileSync('./node_modules/terser/dist/bundle.min.js');
            fs.writeFileSync('./dist/terser.js', file);
          },
          postBundleCB: function(err, src, next) {
            require('fs').unlinkSync('./dist/terser.js');
            next(err, src);
          },
          require: [
            './dist/terser.js:terser',
            './src/htmlminifier.js:minhtml'
          ]
        },
        src: 'src/htmlminifier.js',
        dest: 'dist/htmlminifier.js'
      }
    },

    replace: {
      './index.html': [
        /(<h1>.*?<span>).*?(<\/span><\/h1>)/,
        '$1(v<%= pkg.version %>)$2'
      ],
      './tests/index.html': [
        /("[^"]+\/qunit-)[0-9.]+?(\.(?:css|js)")/g,
        '$1<%= qunit_ver %>$2'
      ]
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  
  function report(type, details) {
    grunt.log.writeln(type + ' completed in ' + details.runtime + 'ms');
    details.failures.forEach(function(details) {
      grunt.log.error();
      grunt.log.error(details.name + (details.message ? ' [' + details.message + ']' : ''));
      grunt.log.error(details.source);
      grunt.log.error('Actual:');
      grunt.log.error(details.actual);
      grunt.log.error('Expected:');
      grunt.log.error(details.expected);
    });
    grunt.log[details.failed ? 'error' : 'ok'](details.passed + ' of ' + details.total + ' passed, ' + details.failed + ' failed');
    return details.failed;
  }


  grunt.registerMultiTask('replace', function() {
    var pattern = this.data[0];
    var path = this.target;
    var html = grunt.file.read(path);
    html = html.replace(pattern, this.data[1]);
    grunt.file.write(path, html);
  });

  grunt.registerTask('dist', [
    'replace',
    'browserify'
  ]);

  grunt.registerTask('test', function() {
      grunt.task.run([
        'dist',
      ]);
  });

  grunt.registerTask('default', 'test');
};
