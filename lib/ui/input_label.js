(function (window, undefined) {

    function InputLabel(style, keyboard) {
        this.initialize(style, keyboard);
    }

    InputLabel.prototype = new Sprite();
    InputLabel.prototype.sprite_initialize = InputLabel.prototype.initialize;
    InputLabel.TYPE = UID.numbering();
    InputLabel.prototype.initialize = function (style, keyboard) {

        this.sprite_initialize(); // your image name
        this.TYPE = InputLabel.TYPE;

        this.keyboard = keyboard;

        this.is_focused = false;

        var that = this;

        this.kibo = new Kibo();
        this.kibo_stream = '';
        this.placeholder = '';

        this.set_anchor(0.5, 0.5);
        this.set_size(500, 180);

        this.label = new Label(style);
        this.label.set_anchor(0.5, 0.5);
        this.add_child(this.label);

        this.cursor = new Sprite('white');
        this.cursor.set_anchor(0.5, 0.5);
        this.cursor.strech(2, 50);
        this.add_child(this.cursor);

        this.set_text('');

        this.blink = new TweenBlink(this.cursor, 0, null, 400);
        
        this.keyboard.on_change = InputLabel.prototype.on_keyboard.bind(this);
        this.kibo.down(['any letter', 'any number', 'space'], function (data) {
            if(that.limit <= that.kibo_stream.length){
                return;
            }
            that.kibo_stream += data.key;
            that.set_text(that.kibo_stream);
            return;
        });

        this.kibo.down('backspace', function (data) {
            that.kibo_stream = that.kibo_stream.slice(0, -1);
            that.set_text(that.kibo_stream);
            return false;
        });

        this.kibo.down(['any letter', 'any number', 'space'], function (data) {

        });
        

        this.blur();
        
    };

    InputLabel.prototype.on_keyboard = function (stream) {
        this.set_text(stream);
    };

    InputLabel.prototype.on_mouse_down = function (event, sender) {
        event.stop_propagation();
    };

    InputLabel.prototype.on_mouse_up = function (event, sender) {
        event.stop_propagation();
        this.focus();
    };       
    
    InputLabel.prototype.on_focus = function (input_label) {
        
    };
    
    InputLabel.prototype.on_blur = function (input_label) {
        
    };

    InputLabel.prototype.focus = function () {
        
        this.blink.run();
        this.is_focused = true;

        if (game.input.is_touch_device()) {
            this.keyboard.show();

            var to = new V(0, -400);

            var t = new TweenMoveTo(this.get_parent(), to, null, 200);
            t.run();
        } else {
            Kibo.registerEvent(this.kibo.element, 'keydown', this.kibo.downHandler);
            Kibo.registerEvent(this.kibo.element, 'keyup', this.kibo.upHandler);
        }
        
        if(this.label.txt === this.placeholder){
            this.set_text('');
        }

        this.on_focus(this);

    };

    InputLabel.prototype.blur = function () {

        this.blink.stop();
        this.cursor.set_alpha(0);

        if (game.input.is_touch_device()) {
            this.keyboard.hide();
            this.is_focused = false;
        } else {
            Kibo.unregisterEvent(this.kibo.element, 'keydown', this.kibo.downHandler);
            Kibo.unregisterEvent(this.kibo.element, 'keyup', this.kibo.upHandler);
        }
        
        if(this.label.txt.trim() === ''){
            this.set_text(this.placeholder);
        }

        this.on_blur(this);
        
    };
    
    InputLabel.prototype.set_limit = function (limit) {
        this.limit = limit;
        this.keyboard.limit = limit;
    };

    InputLabel.prototype.set_text = function (text) {
        this.label.txt = text;
        this.cursor.set_position(this.label.width / 2 + 10, 0);
    };
    
    InputLabel.prototype.set_placeholder = function (text) {
        this.placeholder = text;
        this.set_text(text);
    };

    InputLabel.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);


    };

    window.InputLabel = InputLabel;

}(window));