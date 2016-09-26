(function (window) {
    //main class
    function Game() {
        this.initialize();
    }

    Game.prototype.initialize = function () {

        this.device = new Device(); // read the device

        this.stage = new Stage();

        this.input = new Input(this.device);

        this.input.add_listener('stage');

        this.playlist = new Playlist();

        this.rotate_layer = null;

        this.navigator = new HNavigator(this.stage);

        this.is_rotation_screen_shown = false;

        Howler.mute(!Config.is_sound_on);
        Howler.volume(0.4);
        Howler.autoSuspend = false;

        ////////////////////////////////////////////////////////////////////////////
        ////////////////////  LOADING INITIAL ASSETS ////////////////////////////////

        // ContentManager.add_image('logo');        
        ContentManager.add_image('loading_bg', 'initial/loading_bg.png');
        ContentManager.add_image('loading_fr_pice', 'initial/loading_fr_pice.png');
        ContentManager.add_image('white', 'initial/white.png');
        ContentManager.add_image('rotate_device_to_landscape', 'initial/rotate_device_to_landscape.png');
        ContentManager.add_image('rotate_device_to_portrait', 'initial/rotate_device_to_portrait.png');

        // DON'T ADD ASSETS HERE !!!

        ////////////////////////////////////////////////////////////////////////////

        window.game = this;

        Ticker.add_listener(game);
        Ticker.set_fps(30); // min fps 
        Ticker.start(); // start the life cycle of animation

        ContentManager.download_resources(this, function () {

            game.rotate_layer = new RotateLayer();

            game.load_assets();
            game.navigator.add(new LoadingScreen());

            ContentManager.download_resources(this.stage, function () {

                timeout(function () {

                    Style.initialize();
                    Localization.instance().load();

                    ////////////////////////////////////////////////////////
                    var screen = new MainScreen(); // initial screen
                    ////////////////////////////////////////////////////////

                    game.navigator.add(screen, null, 200, function () {
                        game.navigator.screens.shift();
                        if (game.is_rotation_screen_shown) {
                            game.rotate_layer.remove_from_parent();
                            game.is_rotation_screen_shown = false;
                            game.show_rotate_device();
                        }
                    });

                }, 300);
            });

            // Handle visibility
            game.handle_visibility();

            Visibility.change(function (event) {
                game.handle_visibility();
            });

            game.check_rotation();

        });


        this.debug_label = new Label();
        this.debug_label.text = '';
        this.debug_label.font_size = 25;
        this.debug_label.font_color = "#555555";
        this.debug_label.z_index = 10000;
        this.stage.add(this.debug_label);

        this.debug_label2 = new Label();
        this.debug_label2.text = '';
        this.debug_label2.font_size = 25;
        this.debug_label2.font_color = "#555555";
        this.debug_label2.z_index = 10000;
        this.stage.add(this.debug_label2);

        this.debug_label.set_position(20, Config.screen_height - 70);
        this.debug_label2.set_position(20, Config.screen_height - 40);

    };

    Game.prototype.handle_visibility = function () {

        if (Visibility.state() === 'visible') {

            if (Config.is_sound_on) {
                Howler.mute(false);
            }

            if (game.navigator.current_screen) {
                game.navigator.current_screen.on_visibility_change(true);
            }

        } else if (Visibility.state() === 'hidden') {
            Howler.mute(true);
            if (game.navigator.current_screen) {
                game.navigator.current_screen.on_visibility_change(false);
            }
        }

    };

    Game.prototype.resize = function () {

        this.device.calculate_sizes();

        this.stage.renderer.view.style.width = Math.ceil(Config.canvas_width) + "px";
        this.stage.renderer.view.style.height = Math.ceil(Config.canvas_height) + "px";
        this.stage.renderer.resize(Config.screen_width, Config.screen_height);

        if (Config.window_mode === Config.MODE_CENTERED) {
            this.stage.adjust_canvas_position(this.stage.renderer.view);
        }

        for (var i = 0; i < this.navigator.screens.length; i++) {
            var screen = this.navigator.screens[i];
            screen.set_size(Config.screen_width, Config.screen_height);
            screen.on_resize(Config.screen_width, Config.screen_height);
        }

        if (this.rotate_layer) {
            this.check_rotation();
            this.rotate_layer.on_resize();
        }

    };


    Game.prototype.check_rotation = function () {

        if (Config.rotation_mode === Config.ROTATION_MODE_HORIZONTAL) {

            if (Config.window_width < Config.window_height) {
                this.show_rotate_device();
            } else {
                this.hide_rotate_device();
            }

        } else if (Config.rotation_mode === Config.ROTATION_MODE_VERTICAL) {

            if (Config.window_width > Config.window_height) {
                this.show_rotate_device();
            } else {
                this.hide_rotate_device();
            }

        }

    };

    Game.prototype.show_rotate_device = function () {

        if (!this.is_rotation_screen_shown) {
            
            this.is_rotation_screen_shown = true;
            this.rotate_layer.z_index = 9999999999;
            this.navigator.current_screen.add_child(this.rotate_layer);
            
            if (Config.is_sound_on) {
                Howler.mute(true);
            }
        }
        
    };

    Game.prototype.hide_rotate_device = function () {
        
        if (this.is_rotation_screen_shown) {
            
            this.is_rotation_screen_shown = false;
            this.rotate_layer.remove_from_parent();
            
            if (Config.is_sound_on) {
                Howler.mute(false);
            }
        }
        
    };

    Game.prototype.tick = function () {

        /////////////////////// MAIN LOOP /////////////////////////

        Actions.run(); // update tweens

        this.navigator.update(); // update the sceen and its objects

        this.stage.update(); // render the stage

        SAT.pool.reset();

    };

    window.Game = Game;

}(window));
