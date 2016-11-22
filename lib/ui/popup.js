(function (window, undefined) {

    function Popup(delegate) {
        this.initialize(delegate);
    }

    Popup.prototype = new Sprite();
    Popup.prototype.sprite_initialize = Popup.prototype.initialize;
    Popup.TYPE = UID.numbering();

    Popup.prototype.initialize = function (delegate) {

        this.sprite_initialize(null); // your image name
        this.TYPE = Popup.TYPE;

        this.set_size(Config.screen_width,Config.screen_height);
        this.set_anchor(0.5, 0.5);
        this.set_position(Config.screen_width / 2, Config.screen_height /2);

        this.delegate = delegate;
        this.is_visible = false;

        this.priority = 1000;


        this.background = new Sprite(null);
        this.background.set_anchor(0.5, 0.5);
        this.background.z_index = -1;
        this.add_child(this.background);


    };
    
    Popup.prototype.on_mouse_down = function (event,sender) {
        event.stop_propagation();
    };

    Popup.prototype.show = function (instant) {

        this.delegate.add_child(this);

        this.is_visible = true;

        if (instant) {
            this.set_alpha(1);
            this.set_scale(1);
        } else {
            
            this.background.set_alpha(0);
            this.background.set_scale(0.2);
            
            new TweenAlpha(this.background, 1, null, 200).run();
            new TweenScale(this.background, 1, new Bezier(.18,.66,.64,1.23), 200).run();
            
        }

        game.input.add(this);

    };

    Popup.prototype.hide = function (animated) {
        if (animated) {
            
            var b = new Bezier(.44, -0.51, .76, .36);

            var t = new TweenAlpha(this, 0, null, 300);
            t.run();

            var t2 = new TweenScale(this, 0.5, b, 300, function (object) {
                object.remove_from_parent();
            });
            t2.run();
        } else {
            this.remove_from_parent();
        }
        
        game.input.remove(this);
    };

    Popup.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);
    };

    window.Popup = Popup;

}(window));