(function (window, undefined) {

    function HScreen() {
        this.initialize();
    }

    HScreen.prototype = new Sprite();
    HScreen.TYPE = UID.numbering();
    HScreen.prototype.sprite_initialize = HScreen.prototype.initialize;

    HScreen.prototype.initialize = function () {

        this.sprite_initialize();
        this.TYPE = HScreen.TYPE;
        this.set_size(Config.screen_width, Config.screen_height);

        this.is_paused = false;
    };


    HScreen.prototype.show = function () {
        game.stage.add(this);
    };

    HScreen.prototype.hide = function () {

    };

    HScreen.prototype.on_animation_end = function () {

    };

    HScreen.prototype.update = function (dt) {
        
    };
    
    HScreen.prototype.update_children = function (children) {

        game.stage.sort_objects(children);

        var i = children.length;
        var step = Ticker.step * Config.slow_motion_factor;
        while (i--) {
            var child = children[i];
            if (child.TYPE >= 0) {
                child.update(step);
                if (child && child.TYPE) {
                    this.update_children(child.get_children());
                }
                child.post_update(step);
            }
        }

    };

    HScreen.prototype.on_visibility_change = function (is_visible) {

    };

    HScreen.prototype.on_resize = function (width,height) {
        
    };

    window.HScreen = HScreen;

}(window));