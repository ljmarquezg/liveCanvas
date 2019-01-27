module.exports = function(grunt) {
    require('jit-grunt')(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    // "dist/css/main.css": "src/less/variables.less", // destination file and source file
                    "public/css/style.css": "less/style.less", // destination file and source file
                    //"css/admin-panel.css": "src/less/style.less"
                }
            }
        },
        watch: {
            styles: {
                files: ['less/**/*.less'], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['less','watch']);
};