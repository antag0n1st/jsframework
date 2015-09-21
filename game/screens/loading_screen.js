//(function(window,undefined){

function LoadingScreen() {
    this.initialize();
}

LoadingScreen.prototype = new HScreen();
LoadingScreen.prototype.screen_initialize = LoadingScreen.prototype.initialize;
LoadingScreen.prototype.initialize = function () {
    this.screen_initialize();
    

    this.logo = new Sprite('logo');    
    this.logo.set_anchor(0.5, 0.5);

    this.light1 = new Sprite('lights1');    
    this.light1.set_anchor(0.5, 0.5);

    this.light2 = new Sprite('lights2');    
    this.light2.set_anchor(0.5, 0.5);

    this.loading_bg = new Sprite('loading_bg');    
    this.loading_bg.set_anchor(0.5, 0.5);

    this.loading_fr = new Sprite('loading_fr');    
    this.loading_fr.set_anchor(0, 0.5);
    this.loading_fr.z_index = 2;

    this.loading_width = this.loading_fr.width;


    this.add_child(this.loading_bg);
    this.add_child(this.loading_fr);
    this.add_child(this.light1);
    this.add_child(this.light2);
    this.add_child(this.logo);

    this.rotate_light1 = new TweenRotate(this.light1, 1, null, 10000);
    this.rotate_light1.run();

    this.rotate_light2 = new TweenRotate(this.light2, -1, null, 50000);
    this.rotate_light2.run();

    this.set_positions();

};

LoadingScreen.prototype.set_positions = function () {
    
    var mid_x = Config.screen_width / 2;
    var height = Config.screen_height;
    
    this.logo.set_position(mid_x, height * 0.4);
    this.light1.set_position(mid_x, height * 0.4);
    this.light2.set_position(mid_x, height * 0.4);
    this.loading_bg.set_position(mid_x, height * 0.7);
    this.loading_fr.set_position(mid_x + 2 - this.loading_bg.width / 2, height * 0.7);
    
};

LoadingScreen.prototype.show = function () {
    HScreen.prototype.show.call(this);
};

LoadingScreen.prototype.hide = function () {
    HScreen.prototype.hide.call(this);
    this.rotate_light1.stop();
    this.rotate_light2.stop();
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

LoadingScreen.prototype.on_added_to_parent = function (parent) {
    HScreen.prototype.on_added_to_parent.call(this, parent);

};

LoadingScreen.prototype.on_remove_from_parent = function (parent) {
    HScreen.prototype.on_remove_from_parent.call(this, parent);

};

LoadingScreen.prototype.on_resize = function () {
    this.set_positions();
};


//    window.LoadingScreen = LoadingScreen;

//}(window));