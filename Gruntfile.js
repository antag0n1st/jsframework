module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: [
                    "config.js",
                    
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
                    "lib/tweens/timer.js",
                    "lib/tweens/tween_alpha.js",
                    "lib/tweens/tween_blink.js",
                    "lib/tweens/tween_float.js",
                    "lib/tweens/tween_move_to.js",
                    "lib/tweens/tween_pulsate.js",
                    "lib/tweens/tween_rotate.js",
                    "lib/tweens/tween_rotate_by.js",
                    "lib/tweens/tween_rotate_to.js",
                    "lib/tweens/tween_scale.js",
                    "lib/tweens/tween_shake.js",
                    "lib/tweens/tween_squash_stretch.js",
                    "lib/tweens/tween_time.js",
                    
                    "lib/events/*.js", 
                    
                    "lib/resources/*.js",
                    
                    "lib/display/stage.js",
                    "lib/display/h_navigator.js",
                    "lib/display/drawable.js",
                    "lib/display/sprite.js",
                    "lib/display/h_screen.js",                    
                    "lib/display/sprite_animation.js",
                    "lib/display/animation.js",
                    "lib/display/atlas_animation.js",
                    "lib/display/emitter.js",
                    "lib/display/spine_animation.js",                    
                    "lib/display/layer.js",
                    "lib/display/drawing_layer.js",
                    
                    
                    "lib/ui/label.js",
                    "lib/ui/button.js",
                    "lib/ui/tableview.js",
                    "lib/ui/tablecell.js",
					
                    "style.js",
                    "keyboard.js",
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