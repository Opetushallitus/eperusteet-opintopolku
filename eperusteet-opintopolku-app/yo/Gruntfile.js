const LIVERELOAD_PORT = 35739;

const
  timer = require("grunt-timer"),
  livereloadSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
  proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest,
  autoprefixSnippet = require('autoprefixer')({ browsers: ['last 1 version'] }),
  mountFolder = (connect, dir) => connect.static(require('path').resolve(dir));

const pathConfig = {
  app: 'app',
  dist: 'dist',
  test: 'test'
};

module.exports = grunt => {
  require('load-grunt-tasks')(grunt); // Load all "grunt-*" modules
  timer.init(grunt);

  grunt.initConfig({
    config: pathConfig,
    typings: {
      install: {}
    },
    ts: {
      default: {
        tsconfig: true,
        options: {
          failOnTypeErrors: false // Todo: Delete this line after fixed all errors
        }
      }
    },
    watch: {
      css: {
        files: ['<%= config.app %>/styles/{,*/}*.scss', '<%= config.app %>/eperusteet-esitys/styles/{,*/}*.scss'],
        tasks: ['sass', 'copy:fonts', 'postcss']
      },
      test: {
        files: ['<%= config.app %>/**/*.{js,html}', 'test/**/*.js','!<%= config.app %>/bower_components/**'],
        tasks: ['ts', 'karma:unit', 'regex-check']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT,
          open: false
        },
        tasks: [
          'ts',
          'copy:imgutils',
          'useminPrepare',
          'concurrent:dist',
          'ngtemplates',
          'concat',
          'copy:dist',
          'uglify',
          'usemin'
        ],
        files: [
          '<%= config.app %>/**/*.{html,ts}',
          '!<%= config.app %>/bower_components/**',
          '<%= config.app %>/localisation/*.json',
          '.tmp/styles/**/*.css',
          '<%= config.app %>/eperusteet-esitys/**/*.js',
          '{.tmp,<%= config.app %>}/scripts/**/*.ts',
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    postcss: {
      options: {
        processors: [
          autoprefixSnippet
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: 9020,
        hostname: '0.0.0.0'
      },
      proxies: [{
        context: '/eperusteet-service',
        host: 'virkailija.opintopolku.fi',
        port: 443,
        https: true,
        changeOrigin: true
      }, {
        context: '/eperusteet-ylops-service',
        host: 'virkailija.opintopolku.fi',
        port: 443,
        https: true,
        changeOrigin: true
      }, {
        context: '/eperusteet-amosaa-service',
        host: 'localhost',
        port: 8080,
        https: false,
        changeOrigin: true
      }],
      livereload: {
        options: {
          middleware: connect => {
            return [
              proxySnippet,
              livereloadSnippet,
              mountFolder(connect, process.env.HOME +'/oph-configuration/eperusteet-opintopolku'),
              mountFolder(connect, '.tmp'),
              mountFolder(connect, pathConfig.dist)
            ];
          }
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= config.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= config.app %>/index.html',
      options: {
        dest: '<%= config.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglify'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= config.dist %>/*.html', '<%= config.dist %>/views/**/*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css'],
      js: [
        '<%= config.dist %>/scripts/*.scripts.js',
        '<%= config.dist %>/scripts/*.esitys.js',
        '<%= config.dist %>/scripts/*.templates.js'
      ],
      options: {
        assetsDirs: ['<%= config.dist %>', '<%=config.dist %>/styles'],
        patterns: {
          js: [
          [/\\?"(images\/.*?\.(png|gif|jpg|jpeg|svg))\\?"/g,'JS rev png images']
          ]
        }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '**/*.{png,jpg,jpeg}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['*.html'],
          dest: '<%= config.dist %>'
        }]
      }
    },
    puglint: {

    },
    pug: {
      compile: {
        options: {
          data: {
            debug: true
          }
        },
        files: [{
          '<%= config.app %>/index.jade': '<%= config.app %>/index.jade'
        }, {
          src: '<%= config.app %>/eperusteet-esitys/**/*.jade',
          expand: true,
          ext: '.html'
        }, {
          src: '<%= config.app %>/views/**/*.jade',
          expand: true,
          ext: '.html'
        }]
      }
    },
    copy: {
      imgutils: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/bower_components/eperusteet-frontend-utils/png',
          dest: '<%= config.app %>/images',
          src: '**'
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.{gif,webp}',
            'styles/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '<%= config.app %>/localisation',
          dest: '<%= config.dist %>/localisation',
          src: [
            '*.json'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= config.dist %>/images',
          src: [
            'generated/*'
          ]
        }, {
          expand: true,
          cwd: '<%= config.app %>/bower_components/bootstrap-sass-official/assets/fonts/bootstrap',
          dest: '<%= config.dist %>/styles/fonts',
          src: '*.{eot,svg,ttf,woff,woff2}'
        }]
      },
      fonts: {
        expand: true,
        cwd: '<%= config.app %>/bower_components/bootstrap-sass-official/assets/fonts/bootstrap',
        dest: '.tmp/styles/fonts/',
        src: '*.{eot,svg,ttf,woff,woff2}'
      }
    },
    concurrent: {
      test: [
        'sass'
      ],
      dist: [
        'sass',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true,
        singleRun: true
      }
    },
    cdnify: {
      dist: {
        html: ['<%= config.dist %>/*.html']
      }
    },
    uglify: {
      options: { mangle: false }
    },
    sass: {
      dist: {
        files: {
          '.tmp/styles/eperusteet-opintopolku.css': '<%= config.app %>/styles/eperusteet-opintopolku.scss'
        }
      }
    },
    ngtemplates: {
      dist: {
        cwd: '<%= config.app %>',
        src: 'views/**/*.html',
        dest: '<%= config.dist %>/scripts/scripts.js',
        options:    {
          module: 'app',
          usemin: 'scripts/scripts.js',
          htmlmin: { collapseWhitespace: true, removeComments: true }
        }
      },
      esitys: {
        cwd: '<%= config.app %>/eperusteet-esitys',
        src: '**/*.html',
        dest: '<%= config.dist %>/scripts/esitys.js',
        options:    {
          module: 'eperusteet.esitys',
          prefix: 'eperusteet-esitys/',
          usemin: 'scripts/esitys.js',
          htmlmin: { collapseWhitespace: true, removeComments: true }
        }
      }
    },
    'regex-check': {
      templateurls: {
        files: [{ src: ['<%= config.app %>/scripts/**/*.js'] }],
        options: {
          /* Check that templateUrls don't start with slash */
          pattern : /templateUrl:\s*['"]\//m
        }
      },
      showhide: {
        files: [{ src: ['<%= config.app %>/{scripts,views}/**/*.{js,html}'] }],
        options: {
          /* Check that ng-show/ng-hide are not used in same element */
          pattern : /(ng-show=|ng-hide=)[^>]+(ng-hide=|ng-show=)/m
        }
      },
      controllerNaming: {
        files: [{ src: ['<%= config.app %>/scripts/**/*.js'] }],
        options: {
          /* Enforce CamelCaseController naming */
          pattern : /\.controller\s*\(\s*'([a-z][^']+|([^'](?!Controller))+)'/g
        }
      }
    },
    maxlines: {
      options: {
        limit: 500
      },
      typescript: {
        options: {
          limit: 300
        },
        files: [{ src: ['<%= config.app %>/scripts/**/*.ts'] }]
      },
      scss: {
        options: {
          limit: 500
        },
        files: [{ src: ['<%= config.app %>/styles/**/*.scss'] }]
      }
    }
  });

  grunt.registerTask('dev', [
    'typings',
    'ts',
    'pug',
    'copy:imgutils',
    'useminPrepare',
    'concurrent:dist',
    'ngtemplates',
    'concat',
    'copy:dist',
    'uglify',
    'usemin',
    'configureProxies',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'typings',
    'ts',
    'pug',
    'copy:fonts',
    'concurrent:test',
    'postcss',
    'regex-check',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'typings',
    'ts',
    'pug',
    'copy:imgutils',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'copy:dist',
    'uglify',
    'cssmin',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
