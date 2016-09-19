(function(window, undefined) {

    function Navigator() {
        this.initialize();
    }

    Navigator.prototype.initialize = function() {

        this.screens = [];
        this.current_screen = null;
        this.new_screen = null;

    };

    // display the current screen whitout a queue in the navigator
    Navigator.prototype.just_display_screen = function(screen) {

        if (this.current_screen) {
            this.current_screen.hide(); // hide the last one
        }

        this.current_screen = screen;
        this.current_screen.show();
    };

    Navigator.prototype.add_callback = function() {
        game.navigator.current_screen.hide();
        game.navigator.current_screen = game.navigator.new_screen;
        game.navigator.screens.push(game.navigator.current_screen);
        game.navigator.new_screen = null;
    };

    Navigator.prototype.go_back_callback = function() {
        game.navigator.current_screen.hide();
        game.navigator.current_screen = game.navigator.new_screen;
        game.navigator.screens.pop();
        game.navigator.new_screen = null;
    };

    // add it to the stack of screens and show it
    Navigator.prototype.add = function(screen, animation_type) {


        if (this.current_screen) {

            this.new_screen = screen;

            this.new_screen.show();

            var tween_old = null;
            var tween_new = null;

            this.current_screen.z_index = 0;
            this.new_screen.z_index = 1;

            if (animation_type == "FADEIN") {

                this.new_screen.set_alpha(0);
                tween_old = new TweenAlpha(this.current_screen, 0, null, 200);
                tween_new = new TweenAlpha(this.new_screen, 1, null, 200, game.navigator.add_callback);

            } else if (animation_type == "SLIDE") {

                this.new_screen.set_position(Config.screen_width, 0);
                tween_old = new TweenMoveTo(this.current_screen, new Vector(-Config.screen_width, 0), null, 200);
                tween_new = new TweenMoveTo(this.new_screen, new Vector(0, 0), null, 200, game.navigator.add_callback);

            } else if (animation_type == "SLIDEOVER") {

                this.new_screen.set_position(Config.screen_width, 0);
                tween_old = new TweenMoveTo(this.current_screen, new Vector(0, 0), null, 0);
                tween_new = new TweenMoveTo(this.new_screen, new Vector(0, 0), null, 200, game.navigator.add_callback);

            } else {
                this.new_screen.set_position(0, 0);
                game.navigator.add_callback();
                return;
            }

            tween_old.run();
            tween_new.run();

        } else {

            this.current_screen = screen;
            this.screens.push(screen);
            this.current_screen.show();
        }
    };

    Navigator.prototype.go_back = function(animation_type) {

        if (this.screens.length > 1) {

            this.new_screen = this.screens[this.screens.length - 2];
            this.new_screen.show();

            var tween_old = null;
            var tween_new = null;
            
            this.current_screen.z_index = 0;
            this.current_screen.set_alpha(1);
            
            this.new_screen.z_index = 1;
            this.new_screen.set_alpha(1);

            if (animation_type == "FADEIN") {
                this.new_screen.set_alpha(0);
                tween_old = new TweenAlpha(this.current_screen, 0, null, 200);
                tween_new = new TweenAlpha(this.new_screen, 1, null, 200, this.go_back_callback);

            } else if (animation_type == "SLIDE") {
                this.new_screen.set_position(-Config.screen_width, 0);
                tween_old = new TweenMoveTo(this.current_screen, new Vector(Config.screen_width, 0), null, 200);
                tween_new = new TweenMoveTo(this.new_screen, new Vector(), null, 200, this.go_back_callback);
            }else if (animation_type == "SLIDEOVER") {
                this.new_screen.set_position(-Config.screen_width, 0);
                tween_old = new TweenMoveTo(this.current_screen, new Vector(0, 0), null, 200);
                tween_new = new TweenMoveTo(this.new_screen, new Vector(), null, 200, this.go_back_callback);
            } else {

                this.go_back_callback();
                this.current_screen.set_position(0, 0);
                this.current_screen.set_alpha(1);
                return;
            }



            tween_old.run();
            tween_new.run();



        } else {
            console.log("can't go back , this is as far as it goes");
        }

    };

    Navigator.prototype.go_to_root = function() {

        if (this.screens.length) {
            this.current_screen.hide(); // hide the last one

            this.current_screen = this.screens[0];
            this.current_screen.show();
        }

    };

    Navigator.prototype.remove_all = function() {

        for (var i = 0; i < this.screens.length; i++) {
            this.screens[i].hide();
        }
        this.screens = [];
        this.current_screen = null;
    };

    Navigator.prototype.update = function() {

        this.current_screen.update(Ticker.step * Config.slow_motion_factor);
        this.current_screen.update_children(this.current_screen.get_children());

        if (this.new_screen !== null) {
            this.new_screen.update(Ticker.step * Config.slow_motion_factor);
            this.new_screen.update_children(this.new_screen.get_children());
        }

    };

    window.Navigator = Navigator;

}(window));