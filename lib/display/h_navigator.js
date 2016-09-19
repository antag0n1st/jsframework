(function (window, undefined) {

    function HNavigator(stage) {
        this.initialize(stage);
    }

    HNavigator.ANIMATION_TYPE_SLIDE = 0;
    HNavigator.ANIMATION_TYPE_SLIDEOVER = 1;
    HNavigator.ANIMATION_TYPE_FADEIN = 2;
    HNavigator.ANIMATION_TYPE_FADE_TO_BLACK = 3;
    HNavigator.ANIMATION_TYPE_DELAYED_REMOVAL = 4;
    HNavigator.ANIMATION_TYPE_SCREEN = 5;
    HNavigator.ANIMATION_TYPE_FADEOUT = 6;

    HNavigator.ANIMATION_DIRECTION_LEFT = 0;
    HNavigator.ANIMATION_DIRECTION_RIGHT = 1;
    HNavigator.ANIMATION_DIRECTION_UP = 2;
    HNavigator.ANIMATION_DIRECTION_DOWN = 3;

    HNavigator.prototype.initialize = function (stage) {

        this.screens = [];
        this.current_screen = null;
        this.new_screen = null;
        this.transition_callback = null;
        this.is_transitioning = false;
        this.transition_screen = null;
        this.render_background_color = stage.renderer.backgroundColor;

    };

    /**
     * Adds a new screen
     * 
     * @param {type} screen
     * @param {type} animation_type
     * @param {type} duration
     * @param {type} transition_callback
     * @returns {undefined}
     */
    HNavigator.prototype.add = function (screen, animation_type, duration, transition_callback, transition_screen) {

        if(game.navigator.is_transitioning){
            return false;
        }
        
        this.is_transitioning = true;

        this.transition_callback = transition_callback;
        this.transition_screen = transition_screen ? transition_screen : null;
        var dur = (typeof (duration) === 'undefined') ? 200 : duration;
        this.new_screen = screen;


        if (this.current_screen) {

            this.current_screen.hide();
            this.new_screen.show();
            this.set_animation(animation_type, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.add_callback);

        } else {

            this.current_screen = this.new_screen;
            this.screens.push(this.current_screen);
            this.new_screen = null;
            this.current_screen.show();
            
            this.is_transitioning = false;

            if (this.transition_callback) {
                this.transition_callback();
            }
            
        }
    };

    HNavigator.prototype.set_animation = function (animation_type, duration, direction, callback) {

        if (animation_type === HNavigator.ANIMATION_TYPE_FADEIN) {

            this.animation_fade_in(duration, callback);

        } else if (animation_type === HNavigator.ANIMATION_TYPE_SLIDE) {
          
            this.animation_slide(duration, direction, callback);

        } else if (animation_type === HNavigator.ANIMATION_TYPE_SLIDEOVER) {

            this.animation_slide_over(duration, direction, callback);

        } else if (animation_type === HNavigator.ANIMATION_TYPE_DELAYED_REMOVAL) {

            this.animation_delayed_removal(duration, callback);

        } else if (animation_type === HNavigator.ANIMATION_TYPE_FADE_TO_BLACK) {

            this.animation_fade_to_black(duration, callback);

        } else if (animation_type === HNavigator.ANIMATION_TYPE_SCREEN) {

            this.animation_screen(duration, callback);

        } else if (animation_type === HNavigator.ANIMATION_TYPE_FADEOUT) {

            this.animation_fade_out(duration, callback);

        } else {

            this.new_screen.set_position(0, 0);
            this.new_screen.set_alpha(1);
            callback();
        }

    };

    HNavigator.prototype.animation_screen = function (duration, callback) {

        this.transition_screen.z_index = 2;
        this.current_screen.z_index = 1;
        this.new_screen.z_index = 0;

        this.current_screen.set_position(0, 0);
        this.new_screen.set_position(0, 0);
        this.transition_screen.set_position(0, 0);

        this.transition_screen.show(); // it will add it to the stage

        timeout(function (that) {
            that.new_screen.z_index = 1;
            that.current_screen.z_index = 0;
        }, duration / 2, this);

        timeout(function (that) {
            callback();
            that.transition_screen.hide();
            that.transition_screen.remove_from_parent();
            that.transition_screen = null;
        }, duration, this);
    };

    HNavigator.prototype.animation_fade_to_black = function (duration, callback) {

        game.stage.renderer.backgroundColor = 0x000000;

        var gap = duration / 3;

        this.new_screen.set_alpha(0);
        this.current_screen.set_alpha(1);
        this.new_screen.set_position(0, 0);

        var tween_old = new TweenAlpha(this.current_screen, 0, null, duration / 2 - gap / 2);
        var tween_new = new TweenAlpha(this.new_screen, 1, null, duration / 2 - gap / 2, function () {
            game.stage.renderer.backgroundColor = game.navigator.render_background_color;
            callback();
        });

        tween_old.run();
        timeout(function () {
            tween_new.run();
        }, duration / 2 + gap / 2);

    };

    HNavigator.prototype.animation_fade_in = function (duration, callback) {

        this.current_screen.z_index = 0;
        this.new_screen.z_index = 1;

        this.new_screen.set_alpha(0);
        var tween_old = new TweenAlpha(this.current_screen, 0, null, duration);
        var tween_new = new TweenAlpha(this.new_screen, 1, null, duration, function () {
            callback();
        });

        tween_old.run();
        tween_new.run();
    };
    
    HNavigator.prototype.animation_fade_out = function (duration, callback) {

        this.current_screen.z_index = 1;
        this.new_screen.z_index = 0;
        this.new_screen.set_alpha(1);
        
        var t = new TweenAlpha(this.current_screen, 0, new Bezier(.72,.08,.91,.68), duration,function(){
             callback();
        });

        t.run();
    };

    HNavigator.prototype.animation_slide = function (duration,direction, callback) {

        this.current_screen.z_index = 0;
        this.new_screen.z_index = 1;
        this.new_screen.set_alpha(1);
        
        this.new_screen.set_position(Config.screen_width, 0);
        var tween_old = new TweenMoveTo(this.current_screen, new Vector(-Config.screen_width, 0), null, duration);
        var tween_new = new TweenMoveTo(this.new_screen, new Vector(0, 0), null, duration, function () {
            callback();
        });

        tween_old.run();
        tween_new.run();
    };


    HNavigator.prototype.animation_slide_over = function (duration , direction, callback) {

        this.current_screen.z_index = 0;
        this.new_screen.z_index = 1;
        this.new_screen.set_alpha(1);

        this.new_screen.set_position(Config.screen_width, 0);
        var tween_old = new TweenMoveTo(this.current_screen, new Vector(0, 0), null, 0);
        var tween_new = new TweenMoveTo(this.new_screen, new Vector(0, 0), null, duration, function () {
            callback();
        });

        tween_old.run();
        tween_new.run();
    };

    HNavigator.prototype.animation_delayed_removal = function (duration, callback) {

        this.current_screen.z_index = 0;
        this.new_screen.z_index = 1;

        this.new_screen.set_position(0, 0);
        timeout(function (that) {
            callback();
        }, duration, this);

    };

    HNavigator.prototype.add_callback = function () {

        game.navigator.current_screen.remove_from_parent();

        game.navigator.current_screen = game.navigator.new_screen;
        game.navigator.screens.push(game.navigator.current_screen);
        game.navigator.new_screen = null;
        
        game.navigator.is_transitioning = false;
        game.stage.renderer.backgroundColor = game.navigator.render_background_color;

        if (game.navigator.transition_callback) {
            game.navigator.transition_callback();
            game.navigator.transition_callback = null;
        }

    };

    HNavigator.prototype.go_back = function (animation_type, duration, transition_callback) {
        
        if(game.navigator.is_transitioning){
            return false;
        }
        
        game.navigator.is_transitioning = true;

        this.transition_callback = transition_callback;
        var dur = (typeof (duration) === 'undefined') ? 200 : duration;


        if (this.screens.length > 1) {
            this.new_screen = this.screens[this.screens.length - 2];
        } else {
            // cant go any more 
            return;
        }

        if (this.current_screen) {

            this.current_screen.hide();
            this.new_screen.show();
            this.set_animation(animation_type, dur, HNavigator.ANIMATION_DIRECTION_RIGHT, this.go_back_callback);

        }

    };

    HNavigator.prototype.go_back_callback = function () {
        game.navigator.current_screen.remove_from_parent();
        game.navigator.current_screen.destroy();
        game.navigator.current_screen = game.navigator.new_screen;
        game.navigator.screens.pop();
        game.navigator.new_screen = null;
        
        game.navigator.is_transitioning = false;
        
        if (game.navigator.transition_callback) {
            game.navigator.transition_callback();
            game.navigator.transition_callback = null;
        }
        
        
    };

    HNavigator.prototype.go_to_root_callback = function () {
        game.navigator.current_screen.remove_from_parent();
        game.navigator.current_screen.destroy();
        game.navigator.current_screen = game.navigator.new_screen;
        
        // remove all except the first
        for (var i = game.navigator.screens.length - 1; i > 0; i--) {
            game.navigator.screens.splice(i, 1);
        }

        game.navigator.new_screen = null;
        game.navigator.is_transitioning = false;
        
        if (game.navigator.transition_callback) {
            game.navigator.transition_callback();
            game.navigator.transition_callback = null;
        }
        
        

        
    };
    
    HNavigator.prototype.go_to_index_callback = function(){
        game.navigator.current_screen.remove_from_parent();
        game.navigator.current_screen.destroy();
        game.navigator.current_screen = game.navigator.new_screen;
        
        // remove all to the new screen
        for (var i = game.navigator.screens.length - 1; i >= 0; i--) {
            var screen = game.navigator.screens[i];
            if(screen.id === game.navigator.new_screen.id){
                break;
            }            
            game.navigator.screens.splice(i, 1);
        }

        game.navigator.new_screen = null;
        game.navigator.is_transitioning = false;
        
        if (game.navigator.transition_callback) {
            game.navigator.transition_callback();
            game.navigator.transition_callback = null;
        }
        
        
    };

    HNavigator.prototype.set_current_as_root = function () {

        var ind = this.screens.indexOf(this.current_screen);

        for (var i = 0; i < this.screens.length; i++) {
            if (i !== ind) { // do not call destroy to the current screen
                this.screens[i].destroy();
            }
        }

        this.screens = [];
        this.new_screen = null;
        this.screens.push(this.current_screen);
    };

    // display the current screen whitout a queue in the navigator
    HNavigator.prototype.just_display_screen = function (screen) {
        
        if(game.navigator.is_transitioning){
            return false;
        }
        
        game.navigator.is_transitioning = true;
        
        this.new_screen = screen;
        screen.show();
        this.add_callback();
    };

    HNavigator.prototype.go_to_root = function (animation_type, duration, transition_callback) {
        
        if(game.navigator.is_transitioning){
            return false;
        }
        
        game.navigator.is_transitioning = true;

        if (this.screens.length) {

            this.transition_callback = transition_callback;
            var dur = (typeof (duration) === 'undefined') ? 200 : duration;

            this.new_screen = this.screens[0];
            this.current_screen.hide();
            this.new_screen.show();
            this.set_animation(animation_type, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.go_to_root_callback);

        }

    };
    
    HNavigator.prototype.go_to_index = function (index,animation_type, duration, transition_callback) {
        
        if(game.navigator.is_transitioning){
            return false;
        }
        
        game.navigator.is_transitioning = true;

        if (this.screens.length) {

            this.transition_callback = transition_callback;
            var dur = (typeof (duration) === 'undefined') ? 200 : duration;

            this.new_screen = this.screens[index];
            this.current_screen.hide();
            this.new_screen.show();
                        
            this.set_animation(animation_type, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.go_to_index_callback);

        }

    };

    HNavigator.prototype.update = function () {

        game.stage.sort_objects(game.stage.children);

        if (this.transition_screen !== null && !this.transition_screen.is_paused) {
            this.transition_screen.update(Ticker.step * Config.slow_motion_factor);
            this.transition_screen.update_children(this.transition_screen.get_children());
        }

        if (this.current_screen !== null && !this.current_screen.is_paused) {
            this.current_screen.update(Ticker.step * Config.slow_motion_factor);
            this.current_screen.update_children(this.current_screen.get_children());
        }

        if (this.new_screen !== null) {
            if (!this.new_screen.is_paused) {
                this.new_screen.update(Ticker.step * Config.slow_motion_factor);
                this.new_screen.update_children(this.new_screen.get_children());
            }
        }

    };

    window.HNavigator = HNavigator;

}(window));