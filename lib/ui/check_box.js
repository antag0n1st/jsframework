(function (window, undefined) {

    function CheckBox(config, delegate) {
        this.initialize(config, delegate);
    }

    CheckBox.prototype = new Sprite();
    CheckBox.prototype.sprite_initialize = CheckBox.prototype.initialize;
    CheckBox.TYPE = UID.numbering();
    CheckBox.prototype.initialize = function (config, delegate) {
        this.sprite_initialize(null); // your image name
        this.TYPE = CheckBox.TYPE;

        config = config ? config : {};

        this.delegate = delegate;
        // on_checkbox(is_selected,checkbox)

        this.image_normal = config.image_normal ? config.image_normal : null;
        this.image_selected = config.image_selected ? config.image_selected : null;

        this.is_selected = false;

        this.set_selected(false);

    };

    CheckBox.prototype.set_selected = function (is_selected) {

        if (is_selected) {
            this.set_texture(this.image_selected);
        } else {
            this.set_texture(this.image_normal);
        }
        this.set_size(this.width, this.height);
        this.is_selected = is_selected;

        if (this.delegate && this.delegate.on_checkbox) {
            this.delegate.on_checkbox(this.is_selected, this);
        }
    };

    CheckBox.prototype.on_mouse_up = function (event, sender) {
        this.set_selected(!this.is_selected);
    };

    CheckBox.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);


    };

    CheckBox.prototype.on_note = function (note, data, sender) {
        // if (note === Notes.NOTE_NAME) {}
    };


    window.CheckBox = CheckBox;

}(window));