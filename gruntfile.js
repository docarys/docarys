module.exports = function (grunt) {
  grunt.initConfig ({
    sass: {
      dist: {
        files: {
          'src/default/css/materialize.css' : 'src/default/scss/materialize.scss'
        }
      }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          expand: true,
          cwd: 'src/default/css',
          src: ['*.css', '!*.min.css'],
          dest: 'src/default/css',
          ext: '.min.css'
        }]
      }
    }  
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['sass', 'cssmin']);
}