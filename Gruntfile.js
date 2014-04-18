module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		shower: {
			index: {
				title: 'Understanding Git',
				src: 'src/index.md',
				styles: 'styles/screen.css',
				scripts: [
					'node_modules/shower-core/shower.min.js'
				]
			}
		},
		watch: {
			shower: {
				files: 'src/*',
				tasks: 'shower'
			},
			styles: {
				files: 'styles/*.scss',
				tasks: ['sass', 'autoprefixer', 'csso']
			}
		},
		sass: {
			compile: {
				files: {
					'styles/screen.css': 'styles/screen.scss'
				}
			}
		},
		autoprefixer: {
			prefix: {
				src: 'styles/screen.css'
			}
		},
		csso: {
			minify: {
				files: {
					'styles/screen.css' : 'styles/screen.css'
				},
				options: {
					banner: '/**\n * Bright theme for Shower HTML presentation engine: github.com/shower/bright\n * Copyright © 2010–<%= grunt.template.today("yyyy") %> Vadim Makeev, pepelsbey.net\n * Licensed under MIT license: github.com/shower/shower/wiki/MIT-License\n */\n'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shower-markdown');
	grunt.registerTask('default', ['sass', 'autoprefixer', 'shower', 'watch']);
	//grunt.registerTask('default', ['sass', 'autoprefixer', 'csso', 'shower', 'watch']);
};