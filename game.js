(function (window) {
    //main class
    function Game() {
        this.initialize();
    }

    Game.prototype.initialize = function () {
        

        this.stage = new Stage();

//        this.input = new Input();
//
//        this.input.add_listener('stage');

        this.navigator = new Navigator();

        this.is_rotation_screen_shown = false;

        ////////////////////////////////////////////////////////////////////////////
        ////////////////////  LOADING SCREEN ASSETS ////////////////////////////////

        // ContentManager.add_atlas('initial_atlas');
        ContentManager.add_image('logo', 'initial/logo.png');
        ContentManager.add_image('loading_fr', 'initial/loading_fr.png');
        ContentManager.add_image('loading_bg', 'initial/loading_bg.png');
        ContentManager.add_image('lights2', 'initial/lights2.png');
        ContentManager.add_image('lights1', 'initial/lights1.png');
        ContentManager.add_image('rotate_device', 'initial/rotate_device.png');

        // DON'T ADD ASSETS HERE !!!

        ////////////////////////////////////////////////////////////////////////////
      
        window.game = this;

        ContentManager.download_resources(this, function () {
            
            game.load_assets();

            game.navigator.add(new LoadingScreen());
            Ticker.add_listener(game);
            Ticker.set_fps(30); // min fps
            Ticker.start();
            
            ContentManager.download_resources(this.stage, function () {
               
                timeout(function () {

                    Style.initialize();
                    
                    
                    if(game.is_rotation_screen_shown){
                       game.navigator.screens.splice(game.navigator.screens.length-1,0,new GameScreen());
                    } else {                        
                        game.navigator.add(new GameScreen(), HScreen.ANIMATION_TYPE_FADEIN);
                    }
                    

                }, 300);
            });
            
            // Handle visibility
            game.handle_visibility();

            Visibility.change(function (event) {
                game.handle_visibility();
            });

            if (Config.screen_width < Config.screen_height) {
                game.show_rotate_device();
            }            

        });

        if (Config.debug_info) {

//            this.debug_label = new Label();
//            this.debug_label.text = '-';
//            this.debug_label.font_size = Config.is_low_resolution ? 10 : 20;
//            this.debug_label.font_color = "#222222";
//            this.debug_label.background_color = "#ffffff";
//            this.debug_label.background_alpha = 0.8;
//            this.debug_label.z_index = 10000;
//            this.stage.add(this.debug_label);
//
//            this.debug_label2 = new Label();
//            this.debug_label2.text = '-';
//            this.debug_label2.font_size = Config.is_low_resolution ? 10 : 20;
//            this.debug_label2.font_color = "#222222";
//            this.debug_label2.background_color = "#ffffff";
//            this.debug_label2.background_alpha = 0.8;
//            this.debug_label2.z_index = 10000;
//            this.stage.add(this.debug_label2);
//
//            this.debug_label.set_position(20, Config.screen_height - 80);
//            this.debug_label2.set_position(20, Config.screen_height - 40);

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
        
       
 
        if (Config.is_low_resolution) {
            this.stage.canvas.width = Config.screen_width / 2;
            this.stage.canvas.height = Config.screen_height / 2;
        } else {
            this.stage.canvas.width = Config.screen_width;
            this.stage.canvas.height = Config.screen_height;
        }

        this.stage.canvas.style.width = Config.canvas_width + "px";
        this.stage.canvas.style.height = Config.canvas_height + "px";

        if (Config.window_mode === Config.MODE_FLEXIBLE_HEIGHT_CENTERED) {
            if (Config.window_width > Config.game_width) {
                // it should be placed in the center       
                var style = ((Config.window_width / 2) - Config.canvas_width / 2) + "px";
                this.stage.canvas.style.left = style;
            } else {
                this.stage.canvas.style.left = "0px";
            }
        }


        for (var i = 0; i < this.navigator.screens.length; i++) {
            this.navigator.screens[i].on_resize();
        }

        if (Config.screen_width < Config.screen_height) {
            this.show_rotate_device();            
        } else {
            this.hide_rotate_device();             
        }

    };

    Game.prototype.show_rotate_device = function () {

        if (!this.is_rotation_screen_shown) {
            this.is_rotation_screen_shown = true;
            this.navigator.just_display_screen(new RotateScreen());
            if (Config.is_sound_on) {
                Howler.mute(true);
            }
        }
    };

    Game.prototype.hide_rotate_device = function () {
        if (this.is_rotation_screen_shown) {
            this.is_rotation_screen_shown = false;
         
            this.navigator.go_back();
            if (Config.is_sound_on) {
                Howler.mute(false);
            }
        }
    };

    /**
     * @description This is the main game loop
     */
    Game.prototype.tick = function () {

        this.navigator.update();
        Actions.run();
        this.stage.update();

        SAT.pool.reset();

    };

    window.Game = Game;

}(window));
