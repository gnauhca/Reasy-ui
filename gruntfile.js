module.exports=function(grunt){
var coreFiles,
	jsFiles,
	cssDir,
	sassDir,
	sassFiles;

function setValidateOnly(flag) {
	if (flag == 1) {
		coreFiles = [
			//validate
			"reasy-ui-core.js",
			"reasy-ui-animate.js",
			"reasy-ui-message.js",
			"reasy-ui-select.js",
			
			"reasy-ui-checker.js",
			"reasy-ui-validate.js",
			"reasy-ui-correct.js",
			"reasy-ui-valid-lib.js",
			"reasy-ui-combine-lib.js"
		];
		sassFiles = "src/sass/components/reasy-ui.scss";
		sassDir = 'src/sass/components/';
		cssDir = "dist/css/";
	} else {
		coreFiles = [
			"reasy-ui-core.js",
			"reasy-ui-animate.js",
			"reasy-ui-alert.js",
			"reasy-ui-dialog.js",
			"reasy-ui-progressbar.js",
			"reasy-ui-textboxs.js",
			"reasy-ui-input.js",
			"reasy-ui-tip.js",
			"reasy-ui-message.js",
			"reasy-ui-select.js",
			//validate
			"reasy-ui-checker.js",
			"reasy-ui-validate.js",
			"reasy-ui-correct.js",
			"reasy-ui-valid-lib.js",
			"reasy-ui-combine-lib.js"
		];
		sassFiles = "src/sass/reasy-ui.scss";
		sassDir = 'src/sass/';
		cssDir = "dist/css/";
	}

	jsFiles = coreFiles.map(function(file) {
		return "src/js/" + file;
	});

	console.log(sassFiles, sassDir)
}

setValidateOnly(grunt.file.readJSON('package.json').validateonly);

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),

	banner: '/*!\n' +
			' * <%= pkg.name %>.js v<%= pkg.version %> ' +
			'<%= grunt.template.today("isoDate") %>\n' +
			' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
			' *\n' +
			' * <%= pkg.description %>.\n' +
			' */\n\n',
	
	css_banner: '/*!\n' +
			' * <%= pkg.title %> CSS v<%= pkg.version %> ' +
			'<%= grunt.template.today("isoDate") %>\n' +
			' *\n' +
			' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
			' * <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
			' *\n' +
			' * The CSS for REasy UI.\n' +
			' */\n\n',
			
	depend_check: 'if ("undefined" === typeof jQuery && "undefined" === typeof REasy) {\n' +
			'	throw new Error("REasy-UI requires jQuery or REasy");\n' +
			'}\n\n',
	
	// Task configuration.
	// 清除文件或文件夹
	clean: {
		//dest: ['dist'],
		css: ['dist/**/*.css'],
		js: ['dist/**/*.js']
	},
	
	//===============================
	// 文件合并
	concat: {
		js: {
			options: {
				banner: "<%= banner %><%= depend_check %>",
				
				// true 去掉所有块注释 /* */，false不对注释做处理
				stripBanners: true,
				separator: '\n\n',
				sourceMap: true
			},
			src: jsFiles,
			dest: "dist/js/<%= pkg.name %>-<%= pkg.version %>.js",
			nonull: true
		}

	},
	//===============================
	// 文件压缩
	htmlmin: {
		dest: {
			options: {
				removeComments: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: true,
				removeRedundantAttributes: true,
				useShortDoctype: true
			},
			files: [{
				expand: true,
				cwd: 'src/',
				src: ['**/*.{htm,html,asp}'],
				dest: 'dist/'
			}]
		}
	},
	
	cssmin: {
		with_banner: {
			options: {
				banner: "<%= css_banner %>"
			},
			expand: true,
			cwd: 'dist/css',
			src: ['*.css', '!*.min.css'],
			dest: 'dist/css',
			ext: '.min.css'
		}
	},
	
	uglify: {
		options: {
			banner: "<%= banner %>",
			report: 'min',
			sourceMap: true

		},
		build: {
			files: [{
				expand: true,
				cwd: 'dist',
				src: '<%= pkg.name %>-<%= pkg.version %>.js',
				dest: 'dist/js'
			}]
		},
		
		js: {
			files: {
				'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js':
						['dist/js/<%= pkg.name %>-<%= pkg.version %>.js']
			}
		}
	},
	
	imagemin: {
		dynamic: {
			options: {
				cache: false,
				optionsoptimizationLevel: 3
			},
			files: [{
				expand: true,
				cwd: 'src/img',
				src: ['*.{png,jpg,gif}'],
				dest: 'dist/img'
			}]
		}
	},
	
	
	//===============================
	//代码验证
	htmlhint: {
		build: {
			options: {
				'tag-pair': true,
				'tagname-lowercase': true,
				'attr-lowercase': true,
				'attr-value-double-quotes': true,
				'doctype-first': true,
				'spec-char-escape': true,
				'id-unique': true,
				'head-script-disabled': true,
				'style-disabled': true
			},
			src: ['src/*.html','src/*.htm','src/*.asp']
		}
	},
	
	csslint: {
		options: {
			csslintrc: '.csslintrc',
			formatters: [{
				id: 'junit-xml',
				dest: 'report/csslint_junit.xml'
			}, {
				id: 'csslint-xml',
				dest: 'report/csslint.xml'
			}]
		},
		strict: {
			options: {
				"import": 2
			},
			src: ['src/css/*.css']
		},
		lax: {
			options: {
				"import": false
			},
			src: ['src/css/*.css']
		}
	},
	
	jshint: {
		options: {
			jshintrc: '.jshintrc',
			reporter: require('jshint-stylish'),
			reporterOutput: {
			
			}
		},
		//具体任务配置
		files: {
			src: ['src/js/*.js']
		}
	},
	
	
	compass: {
		dist: {
			options: {
				banner: "<%= css_banner %>",
				sassDir: sassDir,
				cssDir: cssDir,
				specify: sassFiles,
				noLineComments: true,
				sourcemap: true
			}
		}
	},

	//===============================
	// 监听文件改变，并执行特定任务
	watch: {
		js: {
			files:['src/js/*.js'],
			tasks:['concat']
		},
		css: {
			files:['src/sass/**'],
			tasks:['compass']
		},
		htm: {
			files:['src/*.htm','src/*.html','src/*.asp'],
			tasks:['htmlmin']
		}
	}
});	

//grunt plugins
grunt.loadNpmTasks("grunt-banner");
grunt.loadNpmTasks("grunt-contrib-clean");
grunt.loadNpmTasks("grunt-contrib-concat");
grunt.loadNpmTasks("grunt-contrib-htmlmin");
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks("grunt-contrib-uglify");
grunt.loadNpmTasks("grunt-contrib-jshint");
grunt.loadNpmTasks("grunt-contrib-imagemin");
grunt.loadNpmTasks("grunt-contrib-csslint");
grunt.loadNpmTasks("grunt-jslint");
grunt.loadNpmTasks("grunt-contrib-watch");
grunt.loadNpmTasks("grunt-contrib-compass");
//grunt.loadNpmTasks("grunt-contrib-htmlhint");

// Custom Task
grunt.registerTask("imgmin", ["imagemin"]);
grunt.registerTask("jsmin", ["concat:js", "uglify:js"]);
grunt.registerTask("csmin", ["concat:css", "cssmin"]);
grunt.registerTask("min", ["imgmin", "jsmin", "csmin"]);
grunt.registerTask("watchd", ["watch:js"]);
grunt.registerTask("default", ["clean", "compass","concat"]);

grunt.registerTask("w", ["compass","concat","watch"]);
};