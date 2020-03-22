'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    name: 'flexible',
    srcPath: 'src',
    assetsPath: 'assets',
    distPath: 'build',
    clean: ['<%= distPath %>/*'],
    copy: {
      types: {
        src: ['types/flexible.umd.d.ts'],
        dest: '<%= distPath %>/',
        filter: 'isFile',
        expand: true,
        flatten: true
      }
    },
    depconcat: {
      options: {
        separator: '\n'
      },
      main: {
        src: ['<%= srcPath %>/<%= name %>.js'],
        dest: '<%= distPath %>/<%= name %>.debug.js'
      },
      makegrid: {
        src: ['<%= srcPath %>/makegrid.js'],
        dest: '<%= distPath %>/makegrid.debug.js'
      },
      'flexible.umd': {
        src: ['<%= srcPath %>/flexible.umd.js'],
        dest: '<%= distPath %>/flexible.umd.debug.js'
      }
    },
    uglify: {
      main: {
        files: [{
          expand: true,
          cwd: '<%= distPath %>',
          src: ['*.debug.js'],
          dest: '<%= distPath %>',
          ext: '.js'
        }, {
          expand: true,
          cwd: '<%= distPath %>',
          src: ['*.umd.debug.js'],
          dest: '<%= distPath %>',
          ext: '.umd.js'
        }]
      }
    },
    less: {
      options: {
        paths: ['<%= assetsPath %>']
      },
      main: {
        files: [{
          expand: true,
          cwd: '<%= assetsPath %>',
          src: ['<%= name %>.less'],
          dest: '<%= distPath %>',
          ext: '.debug.css'
        }]
      }
    },
    cssmin: {
      options: {
        report: 'min'
      },
      main: {
        files: [{
          expand: true,
          cwd: '<%= distPath %>',
          src: ['*.debug.css'],
          dest: '<%= distPath %>',
          ext: '.css'
        }]
      }
    },
    css2js: {
      main: {
        files: {
          '<%= distPath %>/<%= name %>_css.debug.js': ['<%= distPath %>/<%= name %>.css']
        }
      }
    },
    watch: {
      combo: {
        files: ['package.json'],
        tasks: ['depcombo']
      },
      js: {
        files: ['<%= srcPath %>/*.js', '<%= srcPath %>/**/*.js'],
        tasks: ['depconcat', 'uglify', 'depcombo']
      },
      css: {
        files: ['<%= assetsPath %>/*.less', '<%= assetsPath %>/**/*.less'],
        tasks: ['less', 'cssmin']
      }
    },
    depcombo: {
      debug: {
        options: {
          useDebug: true,
          useDaily: true,
          output: 'url'
        },
        dest: '<%= distPath%>/combo.debug.js'
      },
      main: {
        options: {
          output: 'file'
        },
        dest: '<%= distPath%>/combo.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-depconcat');
  grunt.loadNpmTasks('grunt-depcombo');
  grunt.loadNpmTasks('grunt-css2js');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dist', ['clean', 'depconcat', 'less', 'cssmin', 'css2js', 'uglify', 'depcombo', 'copy:types']);
  grunt.registerTask('dev', ['watch']);

  grunt.registerTask('default', ['dist']);
}
