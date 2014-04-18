module.exports = function(grunt) {
    grunt.initConfig({
        shower: {
            index: {
                title: 'Understanding Git',
                src: 'src/index.md',
                styles: 'node_modules/shower-ribbon/styles/screen.css',
                scripts: [
                    'node_modules/shower-core/shower.min.js'
                ]
            }
        },
        watch: {
            shower: {
                files: 'src/*',
                tasks: 'shower'
            }
        }
    });

		grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shower-markdown');
    grunt.registerTask('default', ['watch']);
};