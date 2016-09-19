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

        this.black_background = new Sprite(null);        
        this.black_background.z_index = -2;
        this.add_child(this.black_background);

        this.background = new Sprite(null);
        this.background.set_anchor(0.5, 0.5);
        this.background.z_index = -1;
        this.add_child(this.background);


    };
    
    Popup.prototype.on_mouse_down = function (event,sender) {
        event.stop_propagation();
    };

    Popup.prototype.show = function (instant) {

        var p = this.get_position();
        this.black_background.set_texture('black');
        this.black_background.set_alpha(0.4);
        this.black_background.strech(Config.screen_width * 2 , Config.screen_height * 2);
        this.black_background.set_position(-p.x, -p.y);
        
        this.background.set_texture('white');
        this.background.strech(800,400);

        this.delegate.add_child(this);

        this.is_visible = true;

        if (instant) {
            this.black_background.set_alpha(0.4);
            this.set_alpha(1);
            this.set_scale(1);
        } else {
            
            this.black_background.set_alpha(0);
            
            this.background.set_alpha(0);
            //this.background.set_scale(0.5);


            var b = new Bezier(.22, 1.19, .69, 1.4);

            var tb = new TweenAlpha(this.black_background, 0.4, null, 300);
            tb.run();

            var t = new TweenAlpha(this.background, 1, null, 400);
            //var t2 = new TweenScale(this.background, 1, b, 400);
            
            timeout(function(){
                t.run();
                //t2.run();
            },300);

            
            
        }

        game.input.add(this);


    };

    Popup.prototype.hide = function (animated) {
        if (animated) {
            this.black_background.set_alpha(0);
            var b = new Bezier(.44, -0.51, .76, .36);

            var t = new TweenAlpha(this, 0, null, 260);
            t.run();

            var t2 = new TweenScale(this, 0.5, b, 260, function (object) {
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