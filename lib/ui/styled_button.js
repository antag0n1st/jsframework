(function (window, undefined) {

    function StyledButton(config) {
        this.initialize(config);
    }

    StyledButton.prototype = new Sprite();
    StyledButton.prototype.parent_initialize = Sprite.prototype.initialize;


    StyledButton.prototype.initialize = function (config) {

        config = config || {}; // to make sure it is initialized

        this.parent_initialize();

        this.label = new StyledLabel(config.label_style);
        this.label.txt = '';
        this.label.set_anchor(0.5, 0.5);
        this.add_child(this.label);

        this.image_normal = config.image_normal || null;
        this.image_selected = config.image_selected || null;

        this.offset_x = 0;
        this.offset_y = 0;

        if (this.image_normal) {
            this.set_texture(this.image_normal);
            this.set_size(this.width, this.height);
        }

        this.priority = 10; // top listener
        this.is_label_position_custom = false;

    };

    Object.defineProperty(StyledButton.prototype, "txt", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.label.txt = value;
        }
    });

    Object.defineProperty(StyledButton.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.label.txt = value;
        }
    });

    Object.defineProperty(StyledButton.prototype, "image_normal", {
        get: function () {
            return this._image_normal;
        },
        set: function (value) {
            this._image_normal = value;
        }
    });

    Object.defineProperty(StyledButton.prototype, "image_selected", {
        get: function () {
            return this._image_selected;
        },
        set: function (value) {
            this._image_selected = value;
        }
    });

    StyledButton.prototype.update = function (dt) {

        if (this.is_mouse_down) {
            if (this.image_selected) {
                if (this.image_normal === this.image_selected) {
                    this.tint = 0xdddddd;
                } else {
                    this.set_texture(this.image_selected);
                    this.set_size(this.width, this.height);
                }

            }
        } else {
            if (this.image_normal) {
                this.tint = 0xffffff;
                this.set_texture(this.image_normal);
                this.set_size(this.width, this.height);
            }

        }


        if (!this.is_label_position_custom) {
            this.label.set_position(this.__width / 2 + this.offset_x, this.__height / 2 + this.offset_y);
        }

        Sprite.prototype.update.call(this, dt);
    };

    StyledButton.prototype.set_anchor = function (x, y) {
        Sprite.prototype.set_anchor.call(this, x, y);

        if (this.label && (x !== 0 || y !== 0)) {
            this.is_label_position_custom = true;
            this.label.set_position(this.offset_x, this.offset_y);
            this.label.set_anchor(x, y);
        }

    };


    StyledButton.prototype.on_mouse_move = function (event) {
        if (!this.check(event.point)) {
            this.event_idx = -1;
            this.is_mouse_down = false;
            this.on_mouse_cancel(event, this);
        }

    };


    window.StyledButton = StyledButton;

}(window));
