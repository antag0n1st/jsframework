(function (window) {
    //main class
    function Game() {
        this.initialize();
    }

    Game.prototype.initialize = function () {


        this.stage = new Stage();

        this.input = new Input();

        this.input.add_listener('stage');

        this.playlist = null;

        this.rotate_layer = null;

        /**
         * 
         */
        this.navigator = new HNavigator(this.stage);

        this.is_rotation_screen_shown = false;

        this.set_background();
        this.set_background_scale();
        
        Howler.mute(!Config.is_sound_on);
     
        ////////////////////////////////////////////////////////////////////////////
        ////////////////////  LOADING SCREEN ASSETS ////////////////////////////////

        
        // ContentManager.add_image('logo');        
        ContentManager.add_image('loading_bg','initial/loading_bg.png');
        ContentManager.add_image('loading_fr','initial/loading_fr.png');
        ContentManager.add_image('white','initial/white.png');
        ContentManager.add_image('rotate_device_to_landscape','initial/rotate_device_to_landscape.png');
        ContentManager.add_image('rotate_device_to_portrait','initial/rotate_device_to_portrait.png');

        // DON'T ADD ASSETS HERE !!!

        ////////////////////////////////////////////////////////////////////////////

        window.game = this;

        Ticker.add_listener(game);
        Ticker.set_fps(30); // min fps 
        Ticker.start();

        ContentManager.download_resources(this, function () {

            game.rotate_layer = new RotateLayer();
            game.load_assets();
            game.navigator.add(new LoadingScreen());

            ContentManager.download_resources(this.stage, function () {

                timeout(function () {

                    Style.initialize();
                    Localization.instance().load();

                    game.playlist = new Playlist();
                    //game.playlist.add(Sounds.background_music, 0.7);
                    
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

        if (Config.debug_info) {

            this.debug_label = new Label();
            this.debug_label.text = '-';
            this.debug_label.font_size = Config.is_low_resolution ? 10 : 20;
            this.debug_label.font_color = "#000000";
            this.debug_label.background_color = "#ffffff";
            this.debug_label.background_alpha = 0.8;
            this.debug_label.z_index = 10000;
            this.stage.add(this.debug_label);

            this.debug_label2 = new Label();
            this.debug_label2.text = '-';
            this.debug_label2.font_size = Config.is_low_resolution ? 10 : 20;
            this.debug_label2.font_color = "#000000";
            this.debug_label2.background_color = "#ffffff";
            this.debug_label2.background_alpha = 0.8;
            this.debug_label2.z_index = 10000;
            this.stage.add(this.debug_label2);

            this.debug_label.set_position(20, Config.screen_height - 80);
            this.debug_label2.set_position(20, Config.screen_height - 40);

        }

    };

    Game.prototype.handle_visibility = function () {
        if (Visibility.state() === 'visible' && Config.is_sound_on) {
            Howler.mute(false);
        } else if (Visibility.state() === 'hidden') {
            Howler.mute(true);
        }
    };

    Game.prototype.resize = function () {

        this.stage.renderer.view.style.width = Math.ceil(Config.canvas_width) + "px";
        this.stage.renderer.view.style.height = Math.ceil(Config.canvas_height) + "px";

        this.stage.renderer.resize(Config.screen_width, Config.screen_height);

        if (Config.window_mode === Config.MODE_FLEXIBLE_HEIGHT_CENTERED) {
            if (Config.window_width > Config.game_width) {
                // it should be placed in the center       
                var style = Math.round(((Config.window_width / 2) - Config.canvas_width / 2)) + "px";
                this.stage.canvas.style.left = style;
            } else {
                this.stage.canvas.style.left = "0px";
            }
        }

        for (var i = 0; i < this.navigator.screens.length; i++) {
            this.navigator.screens[i].on_resize();
        }


        if (this.rotate_layer) {
            this.check_rotation();
            this.rotate_layer.on_resize();
        }

        this.set_background_scale();

    };

    Game.prototype.set_background = function () {
        return;
//        if (!Config.is_mobile()) {
//
//            this.left_background = document.createElement("img");
//            this.left_background.src = ContentManager.base_url + 'assets/images/left_background.jpg';
//
//            this.left_background.setAttribute("alt", "left_background");
//            this.left_background.style.position = 'absolute';
//
//
//            this.right_background = document.createElement("img");
//            this.right_background.src = ContentManager.base_url + 'assets/images/right_background.jpg';
//
//            this.right_background.setAttribute("alt", "right_background");
//            this.right_background.style.position = 'absolute';
//
//            document.body.insertBefore(this.left_background, this.stage.canvas);
//            document.body.appendChild(this.right_background);
//        }
    };

    Game.prototype.set_background_scale = function () {

        var left = Math.round_decimal(this.stage.canvas.style.left.replace('px', ''), 4);

        var aspect = 400 / 700; //TODO set the actual size of the side images

        var width = aspect * Config.canvas_height;

//        if (!Config.is_mobile()) {
//            this.left_background.style.width = width + 'px';
//            this.left_background.style.height = Config.canvas_height + 'px';
//            this.left_background.style.left = (left - width) + 'px';
//
//            this.right_background.style.width = width + 'px';
//            this.right_background.style.height = Config.canvas_height + 'px';
//            this.right_background.style.left = (left + Config.canvas_width) + 'px';
//        }
    };

    Game.prototype.check_rotation = function () {

        if (Config.rotation_mode === Config.ROTATION_MODE_ALLOW) {

        } else if (Config.rotation_mode === Config.ROTATION_MODE_HORIZONTAL) {
            if (Config.screen_width < Config.screen_height) {
                this.show_rotate_device();
            } else {
                this.hide_rotate_device();
            }
        } else if (Config.rotation_mode === Config.ROTATION_MODE_VERTICAL) {
            if (Config.screen_width > Config.screen_height) {
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

    /**
     * @description This is the main game loop
     */
    Game.prototype.tick = function () {

        Actions.run();

        this.navigator.update();

        this.stage.update();

        SAT.pool.reset();

    };

    window.Game = Game;

}(window));
