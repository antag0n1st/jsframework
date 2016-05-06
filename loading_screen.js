(function (window, undefined) {

    function LoadingScreen() {
        this.initialize();
    }

    LoadingScreen.prototype = new HScreen();
    LoadingScreen.prototype.screen_initialize = LoadingScreen.prototype.initialize;
    LoadingScreen.prototype.initialize = function () {
        this.screen_initialize();

        this.background = new Sprite('white');
        this.background.set_anchor(0.5, 0.5);

        this.add_child(this.background);

        this.logo = new Sprite(''); //TODO put your logo here
        this.logo.set_anchor(0.5, 0.5);


        this.loading_bg = new Sprite('loading_bg');
        this.loading_bg.set_anchor(0.5, 0.5);

        this.loading_fr = new Sprite('loading_fr');
        this.loading_fr.set_anchor(0, 0.5);
        this.loading_fr.z_index = 2;

        this.loading_width = this.loading_fr.width;

        this.add_child(this.loading_bg);
        this.add_child(this.loading_fr);
        this.add_child(this.logo);

        this.set_positions();

    };

    LoadingScreen.prototype.set_positions = function () {

        var mid_x = Config.screen_width / 2;
        var height = Config.screen_height;

        this.logo.set_position(mid_x, height * 0.4);
        this.logo.on_mouse_up = function(){
            window.location = "http://m.softgames.com";
        };
        this.loading_bg.set_position(mid_x, height * 0.7);
        this.loading_fr.set_position(mid_x + 2 - this.loading_bg.width / 2, height * 0.7);

        this.background.set_position(mid_x, height / 2);
        this.background.width = Config.screen_width * 1.5;
        this.background.height = Config.screen_height * 1.5;

    };

    LoadingScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);
        game.input.add(this.logo);
    };

    LoadingScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);
        game.input.remove(this.logo);
    };

    LoadingScreen.prototype.update = function () {
        HScreen.prototype.update.call(this);

        var to_load = ContentManager.count_to_load;
        var loaded = ContentManager.count_loaded;

        var loading = loaded / to_load;
        loading = (loading <= 0) ? 0.01 : loading;
        loading = (to_load === 0) ? 1 : loading;

        this.loading_fr.width = loading * this.loading_width;

    };

    LoadingScreen.prototype.on_resize = function () {
        this.set_positions();
    };


    window.LoadingScreen = LoadingScreen;

}(window));