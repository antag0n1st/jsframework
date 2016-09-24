module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                beautify: false,
                preserveComments: false,
                screwIE8: false
            },
            build: {
                src: [
                    "config.js",
                    "lib/external/sat.js",
                    "lib/external/kibo.js",
                    
                    "lib/utility/*.js",
                    
                    "lib/tweens/actions.js",
                    "lib/tweens/bezier.js",
                    "lib/tweens/*.js",
                    
                    "lib/resources/*.js",
                    
                    "lib/graphics/stage.js",
                    "lib/graphics/drawable.js",
                    "lib/graphics/sprite.js",
                    "lib/graphics/h_screen.js",
                    
                    "lib/events/*.js",
                    
                    "lib/ui/*.js",
                    
                    "game/game.js",
                    
                    "assets/assets.js",
                    
                    "game/**/*.js",
                    
                    "jquery-3.1.0.min.js",
                    "jstree.min.js"

                ],
                dest: '<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};