module.exports=function(grunt){



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
			
	depend_check: 'if ("undefined" === typeof jQuery) {\n' +
			'	throw new Error("REasy-UI requires jQuery");\n' +
			'}\n\n',
	
	// Task configuration.
	// 清除文件或文件夹
	clean: {
		//dest: ['dist'],
		all: ['dist/**/*'],
	},
	
	
	//compass
	compass: {
		dist: {
			options: {
				banner: "<%= css_banner %>",
				sassDir: 'src/sass/',
				cssDir: 'dist/',
				specify: 'src/sass/reasy-ui.scss',
				outputStyle: 'expanded',
				noLineComments: true,
				sourcemap: false
			}			
		}
	},



	//===============================
	// 文件合并
	concat: {
		options: {
			banner: "<%= banner %><%= depend_check %>",
			
			// true 去掉所有块注释 /* */，false不对注释做处理
			stripBanners: true,
			separator: '\n\n',
			sourceMap: true
		},
		js: {
			src: [
				'src/js/reasy-ui-core.js',
				'src/js/reasy-ui-animate.js',
				'src/js/reasy-ui-alert.js',
				'src/js/reasy-ui-dialog.js',
				'src/js/reasy-ui-progressbar.js',
				'src/js/reasy-ui-textboxs.js',
				'src/js/reasy-ui-input.js',
				'src/js/reasy-ui-tip.js',
				'src/js/reasy-ui-message.js',
				'src/js/reasy-ui-select.js',
				//validate
				'src/js/reasy-ui-checker.js',
				'src/js/reasy-ui-validate.js',
				'src/js/reasy-ui-correct.js',
				'src/js/reasy-ui-valid-lib.js',
				'src/js/reasy-ui-combine-lib.js'
			], 
			dest: 'dist/<%= pkg.name %>.js',
			nonull: true
		}

	},

	copy: {
		'fortest': {
			files: [
				{src: 'dist/<%= pkg.name %>.js', dest: 'test/<%= pkg.name %>.js'},
				{src: 'dist/<%= pkg.name %>.css', dest: 'test/<%= pkg.name %>.css'}
			]
		}
	},


	//===============================
	// 文件压缩
	
	cssmin: {
		with_banner: {
			options: {
				banner: "<%= css_banner %>"
			},
			expand: true,
			cwd: 'dist',
			src: ['*.css', '!*.min.css'],
			dest: 'dist',
			ext: '.min.css'
		}
	},
	
	uglify: {
		js: {
			src: 'dist/<%= pkg.name %>.js',
			dest: 'dist/<%= pkg.name %>.min.js'
		}
	},
	
	
	//===============================
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
			src: ['dist/*.css']
		},
		lax: {
			options: {
				"import": false
			},
			src: ['dist/*.css']
		}
	},
	
	jshint: {
		options: {
			jshintrc: '.jshintrc',
			//reporterOutput: 'report/jshint-report.txt',
			reporter: require('jshint-stylish')
		},
		js: ['src/js/*.js']
	},



    qunit: {

      files: 'test/index.html'
    },
	//===============================
	// 监听文件改变，并执行特定任务
	watch: {
		js: {
			files:['src/js/*.js'],
			tasks:['concat:js', 'copy']
		},
		css: {
			files:['src/sass/**'],
			tasks:['compass', 'copy']
		}
	}
});	


require('load-grunt-tasks')(grunt, { scope: 'devDependencies'});
grunt.loadNpmTasks("grunt-contrib-jshint");

//清除
//clean

//生成目标文件
grunt.registerTask('dist-js', ['concat:js', 'uglify:js']);
grunt.registerTask('dist-css', ['compass', 'cssmin']);
grunt.registerTask('dist', ['dist-js', 'dist-css', 'copy']);



//test测试
grunt.registerTask('test-js', ['jshint','qunit']);
grunt.registerTask('test-css', ['csslint:lax']);
grunt.registerTask('test', ['test-js'/*, 'test-css'*/]);


grunt.registerTask('default', ['clean', 'dist', 'test']);
grunt.registerTask('dev-test', ['clean', 'watch']);


};