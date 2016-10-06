(function (window, undefined) {

    function LoadingScreen(callback) {
        this.initialize(callback);
    }

    LoadingScreen.prototype = new HScreen();
    LoadingScreen.prototype.screen_initialize = LoadingScreen.prototype.initialize;
    LoadingScreen.prototype.initialize = function (callback) {
        this.screen_initialize();

        this.callback = callback;

        this.background = new Sprite('white');
        this.background.strech(Config.screen_width,Config.screen_height);
        this.add_child(this.background);

        this.logo = new Sprite(null);//Put logo image here
        this.logo.set_position(Config.screen_width / 2 - 150, 200);
        this.add_child(this.logo);

        this.is_animating = true;

        this.loading_bar = new LoadingBar('loading_fr_pice', 'loading_bg');
        this.add_child(this.loading_bar);

        this.last_loaded_count = 0;

        this.set_positions();

    };

    LoadingScreen.prototype.set_positions = function () {

        var mid_x = Config.screen_width / 2;
        var height = Config.screen_height;

        this.loading_bar.set_position(mid_x, height * 0.6);

        this.background.set_position(-10,-10);
        this.background.width = Config.screen_width * 1.2;
        this.background.height = Config.screen_height * 1.2;
        
    };

    LoadingScreen.prototype.update = function (dt) {

        HScreen.prototype.update.call(this, dt);

        var to_load = ContentManager.count_to_load;
        var loaded = ContentManager.count_loaded;

        var loading = loaded / to_load;
        loading = (loading <= 0) ? 0.01 : loading;
        loading = (to_load === 0) ? 1 : loading;

        if (this.last_loaded_count != loaded) {
            this.last_loaded_count = loaded;
            this.loading_bar.set_percent(loading, true);
        }

    };

    LoadingScreen.prototype.on_resize = function () {
        this.set_positions();
    };

    window.LoadingScreen = LoadingScreen;

}(window));