module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                beautify: false,
                preserveComments: false,
                screwIE8:false
            },
            build: {
                src: [
                    "config.js",
                    "boot.js",
                    
                    "lib/external/pixi.js",
                    "lib/external/pixi-spine.js",
                    "lib/external/howler.js",
                    "lib/external/font.js",
                    "lib/external/sat.js",
                    "lib/external/kibo.js",
                    "lib/external/visibility.core.js",
                    
                    "lib/utility/*.js",
                    
                    "lib/tweens/actions.js",
                    "lib/tweens/bezier.js",
                    "lib/tweens/tween.js",
                    "lib/tweens/*.js",
                    
                    "lib/events/*.js", 
                    
                    "lib/resources/*.js",
                    
                    "lib/display/stage.js",
                    "lib/display/h_navigator.js",
                    "lib/display/drawable.js",
                    "lib/display/sprite.js",
                    "lib/display/h_screen.js",                    
                    "lib/display/*.js",                    
                    
                    "lib/ui/label.js",
                    "lib/ui/popup.js",
                    "lib/ui/scrollview_content.js",
                    "lib/ui/*.js",
					
                    "style.js",
                    "loading_screen.js",
                    "notes.js",
                    "rotate_layer.js",
                    
                    "game.js",
                    "assets/assets.js",
                    
                    "game/**/*.js"
                    
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