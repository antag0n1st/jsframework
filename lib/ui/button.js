(function (window, undefined) {

    function Button(config) {
        this.initialize(config);
    }

    Button.prototype = new Sprite();
    Button.prototype.parent_initialize = Sprite.prototype.initialize;


    Button.prototype.initialize = function (config) {

        config = config || {}; // to make sure it is initialized

        this.parent_initialize();

        this.label = new Label(config);
        this.label.txt = '';
        this.label.set_anchor(0.5, 0.5);
        this.add_child(this.label);

        this.image_normal = config.image_normal || null;
        this.image_selected = config.image_selected || null;

        if (this.image_normal) {
            this.set_texture(this.image_normal);
            this.set_size(this.width, this.height);
        }

        this.priority = 10; // top listener
        this.is_label_position_custom = false;

    };

    Object.defineProperty(Button.prototype, "txt", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.label.txt = value;
        }
    });

    Object.defineProperty(Button.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.label.txt = value;
        }
    });

    Object.defineProperty(Button.prototype, "image_normal", {
        get: function () {
            return this._image_normal;
        },
        set: function (value) {
            this._image_normal = value;
        }
    });

    Object.defineProperty(Button.prototype, "image_selected", {
        get: function () {
            return this._image_selected;
        },
        set: function (value) {
            this._image_selected = value;
        }
    });

    Button.prototype.update = function (dt) {

        if (this.is_mouse_down) {
            if (this.image_selected) {
                this.set_texture(this.image_selected);
                this.set_size(this.width, this.height);
            }
        } else {
            if (this.image_normal) {
                this.set_texture(this.image_normal);
                this.set_size(this.width, this.height);
            }

        }


        if (!this.is_label_position_custom) {
            this.label.set_position(this.__width / 2, this.__height / 2);
        }

        Sprite.prototype.update.call(this, dt);
    };

    Button.prototype.set_anchor = function (x, y) {
        Sprite.prototype.set_anchor.call(this, x, y);

        if (this.label && (x !== 0 || y !== 0)) {
            this.is_label_position_custom = true;
            this.label.set_position(0, 0);
            this.label.set_anchor(x, y);
        }

    };


    Button.prototype.on_mouse_move = function (event) {
        if (!this.check(event.point)) {            
            this.event_idx = -1;
            this.is_mouse_down = false;
            this.on_mouse_cancel(event, this);
        }

    };


    window.Button = Button;

}(window));
