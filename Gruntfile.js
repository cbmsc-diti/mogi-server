/* jslint node: true */
"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        //grep: '*-test',
        ui: 'bdd',
        reporter: 'tap'
      },
      all: { src: ['tests/**/*.js'] }
    },
    env : {
      development : {
        NODE_ENV : 'development'
      },
      test : {
        NODE_ENV : 'test'
      }
    },
    nodemon : {
      dev : {
        options : {
          file :  'server.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('test', ['env:test','simplemocha']);  
  grunt.registerTask('default', ['env:development', 'nodemon']);
};