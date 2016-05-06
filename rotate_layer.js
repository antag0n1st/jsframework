(function (window, undefined) {

    function RotateLayer(name) {
        this.initialize(name);
    }

    RotateLayer.prototype = new Sprite();
    RotateLayer.prototype.sprite_initialize = RotateLayer.prototype.initialize;
    RotateLayer.TYPE = UID.numbering();
    RotateLayer.prototype.initialize = function (name) {
        this.sprite_initialize(name); // your image name
        this.TYPE = RotateLayer.TYPE;

        this.set_size(Config.screen_width, Config.screen_height);

        this.drawing_layer = new DrawingLayer();
        this.add_child(this.drawing_layer);
        
        var image_name = 'rotate_device_to_portrait';
        
        if (Config.rotation_mode === Config.ROTATION_MODE_HORIZONTAL) {
            image_name = 'rotate_device_to_landscape';
        } 

        this.rotate = new Sprite(image_name);//TODO fix this in future
        this.rotate.set_anchor(0.5, 0.5);
        this.rotate.set_position(Config.screen_width / 2, Config.screen_height / 2);
        this.add_child(this.rotate);

        this.rotate_label = new Label();
        this.rotate_label.set_anchor(0.5, 0.5);
        this.rotate_label.text_align = Label.TEXT_H_ALIGN_CENTER;
        this.rotate_label.txt = lang("Please rotate your device");
        this.rotate_label.font_color = "#ffffff";
        this.rotate_label.font_size = 18;
        this.rotate_label.set_position(Config.screen_width / 2, Config.screen_height / 2 + 60);
        this.add_child(this.rotate_label);

    };

    RotateLayer.prototype.on_resize = function () {
        this.rotate.set_position(Config.screen_width / 2, Config.screen_height / 2);
        this.rotate_label.set_position(Config.screen_width / 2, Config.screen_height / 2 + 60);
    };

    RotateLayer.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this, parent);
    };

    RotateLayer.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this, parent);
    };

    RotateLayer.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);

        this.drawing_layer.clear();
        this.drawing_layer.beginFill(0x000000);
        this.drawing_layer.drawRect(-50, -50, Config.screen_width + 100, Config.screen_height + 100);

    };

    RotateLayer.prototype.on_note = function (note, data, sender) {
        // if (note === Notes.NOTE_NAME) {}
    };


    window.RotateLayer = RotateLayer;

}(window));