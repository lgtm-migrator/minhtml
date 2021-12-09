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
      ]
    },
  });

  grunt.loadNpmTasks('grunt-browserify');

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

};
