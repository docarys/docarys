/*jslint node: true */
"use strict";

module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'src/mydocs/js/lunr.min.js': ['node_modules/lunr/lunr.js'],
          'src/mydocs/js/mustache.min.js': ['node_modules/mustache/mustache.js'],
          'src/mydocs/js/search.min.js': ['src/search/search.js'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
}