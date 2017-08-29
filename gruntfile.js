/*jslint node: true */
"use strict";

module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'site/docarys/js/lunr.min.js': ['node_modules/lunr/lunr.js'],
          'site/docarys/js/mustache.min.js': ['node_modules/mustache/mustache.js'],
          'site/docarys/js/search.min.js': ['src/search/search.js'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
}