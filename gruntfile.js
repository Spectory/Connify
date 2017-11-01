module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      default : {
        src: ["src/**/*.ts", "!node_modules/**/*.ts", "!src/.baseDir.ts"],
        outDir: "./build",
        options: {
          rootDir: "./src"
        }
      }
    },
    copy: {
      main: {
        files: [{
          expand: true, 
          cwd: "src",
          src: ['public/**'], 
          dest: 'build'},
        ]
      }
    },
    nodemon: {
      dev: {
        script: "build/server.js",
        options: {
          args: ["dev"],
        },
        env: {
          PORT: 3000
        },
        cwd: __dirname,
        ignore: ["node_modules", "build", "typings"]
      }
    },
    clean: ["./build"],
    watch: {
      src: {
        files: ['src/**/*'],
        tasks: ['copy:main', 'ts'],
      },
      options: {
        reload: true
      }
    },
    concurrent: {
      dev: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['copy', 'watch', 'nodemon:dev']
      }
    },
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-nodemon");
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.registerTask("default", ["clean", "ts", 'concurrent:dev']);
  grunt.registerTask("heroku:build", ["clean", "ts", "copy"])
};