module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-stylus');


	grunt.registerTask('default', ['jshint', 'build'/*, 'karma:unit'*/]);
	grunt.registerTask('build', ['clean','html2js', 'stylus','concat', 'copy:assets']);
	grunt.registerTask('test-watch', ['karma:watch']);

	var karmaConfig = function(configFile, customOptions) {
	    var options = {
	    	configFile: configFile, 
	    	keepalive: true};
	    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
	    return grunt.util._.extend(options, customOptions, travisOptions);
	  };

	// Print a timestamp (useful for when watching)
	grunt.registerTask('timestamp', function() {
		grunt.log.subhead(Date());
	});


	// Project configuration.
	grunt.initConfig({
		distdir: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		src: {
			js: ['src/**/*.js'],
			jsTpl: ['<%= distdir %>/templates/**/*.js'],
			specs: ['test/**/*.spec.js'],
			scenarios: ['test/**/*.scenario.js'],
			tpl: {
				app: ['src/app/**/*.tpl.html'],
				common: ['src/common/**/*.tpl.html']
			},
			stylus: ['src/stylus/main.styl'],
			stylusWatch: ['src/stylus/**/*.styl']
		},

		jshint:{
			files:[/*'gruntFile.js', */'<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
			options:{
				curly:true,
				eqeqeq:true,
				immed:true,
				latedef:true,
				newcap:true,
				noarg:true,
				sub:true,
				boss:true,
				eqnull:true,
				globals:{}
			}
		},

		clean: ['<%= distdir %>/*'],

		html2js: {
	      app: {
	        options: {
	          base: 'src/app'
	        },
	        src: ['<%= src.tpl.app %>'],
	        dest: '<%= distdir %>/templates/app.js',
	        module: 'templates.app'
	      },
	      common: {
	        options: {
	          base: 'src/common'
	        },
	        src: ['<%= src.tpl.common %>'],
	        dest: '<%= distdir %>/templates/common.js',
	        module: 'templates.common'
	      }
	    },

	    copy: {
	      assets: {
	        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
	      }
	    },

	    stylus : {
            compile : {
                files : {
                    '<%= distdir %>/<%= pkg.name %>.css' : '<%= src.stylus %>'
                }
            }
        },

        karma: {
	      unit: { options: karmaConfig('test/config/unit.js') },
	      watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
	    },

	    concat:{
	      dist:{
	        src:['<%= src.js %>', '<%= src.jsTpl %>'],
	        dest:'<%= distdir %>/<%= pkg.name %>.js'
	      },
	      angular: {
	        src:['vendor/angular/angular.js', 'vendor/angular/angular-route.js'],
	        dest: '<%= distdir %>/angular.js'
	      },
	      jquery: {
	        src:['vendor/jquery/*.js'],
	        dest: '<%= distdir %>/jquery.js'
	      }
	    },

	    watch:{ 
	      all: { 
	        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.stylusWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>'],
	        tasks:['default','timestamp']
	      },
	      build: {
	        files:['<%= src.js %>', '<%= src.specs %>', '<%= src.stylusWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>'],
	        tasks:['build','timestamp']
	      }
	    }

	});
};
