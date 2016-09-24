(function(window) {

    function Game() {
        this.initialize();
    }

    Game.prototype.initialize = function() {

        this.stage = new Stage();
        
        this.input = new Input();

        this.input.add_listener('stage');

        this.navigator = new Navigator();

        ////////////////////////////////////////////////////////////////////////////
        ////////////////////  LOADING SCREEN ASSETS ////////////////////////////////

        ContentManager.add_image('lights1', 'assets/images/lights1.png');
        ContentManager.add_image('lights2', 'assets/images/lights2.png');
        ContentManager.add_image('logo', 'assets/images/logo.png');
        ContentManager.add_image('loading_fr', 'assets/images/loading_fr.png');
        ContentManager.add_image('loading_bg', 'assets/images/loading_bg.png');

        // DON'T ADD ASSETS HERE !!!

        ////////////////////////////////////////////////////////////////////////////
        
        game = this;

        ContentManager.download_resources(this.stage, function() {

            game.load_assets();

            game.navigator.add(new LoadingScreen());
            Ticker.add_listener(game);
            Ticker.set_fps(30); // min fps
            Ticker.start();

            ContentManager.download_resources(this.stage, function() {
                window.setTimeout(function() {
                    game.navigator.add(new GameScreen(), "FADEIN");
                }, 300);
                window.scrollTo(scrollToX,scrollToY);
            });

        });
        
        if(Config.debug_info){
            
            this.debug_label = new Label();
            this.debug_label.z_index = -1;
            
            this.debug_label.set({
                text: "Window : "+Config.window_width+"x"+Config.window_height+
                      " | Screen : "+Config.device_width+"x"+Config.device_height+
                      " | FPS: -"+
                      " | Quality: "+(Config.is_low_resolution ? "low" : "high"),
                text_size : (Config.is_low_resolution ? 10: 20) ,
                text_color: "#aaaaaa"
            });
            this.debug_label.z_index = 10000;
          //  this.stage.add(this.debug_label);
            this.debug_label.set_position(20,20);
            

        }
        
        window.scrollTo(scrollToX,scrollToY);

    };

    Game.prototype.resize = function() {

        if (Config.is_low_resolution) {
            this.stage.context.canvas.width = Config.screen_width / 2;
            this.stage.context.canvas.height = Config.screen_height / 2;
        } else {
            this.stage.context.canvas.width = Config.screen_width;
            this.stage.context.canvas.height = Config.screen_height;
        }

        this.stage.context.canvas.style.width = Config.window_width + "px";
        this.stage.context.canvas.style.height = Config.window_height + "px";

        for (var i = 0; i < this.navigator.screens.length; i++) {
            this.navigator.screens[i].on_resize();
        }
    };

    /**
     * @description This is the main game loop
     */
    Game.prototype.tick = function() {

        this.stage.clear_canvas();
        
        this.navigator.update();        
        Actions.run();
        this.stage.update();

        if (Config.debug) {
            this.stage.debug_grid();
        }

        SAT.pool.reset();

    };

    window.Game = Game;

}(window));