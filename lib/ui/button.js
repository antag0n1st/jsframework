//(function(window, undefined) {

function Button(config) {
    this.initialize(config);
}

Button.prototype = new Sprite();
Button.prototype.parent_initialize = Sprite.prototype.initialize;


Button.prototype.initialize = function (config) {

    config = config || {}; // to make sure it is initialized

    this.parent_initialize();

    this.label = new Label();
    this.label.text = 'Default Button';
    this.label.set_anchor(0.5,0.5);
    this.add_child(this.label);

    this.image_normal = config.image_normal || null;
    this.image_selected = config.image_selected || null;

    if (this.image_normal) {
        this.texture = this.image_normal.texture;
        this.set_size(this.width, this.height);
    }

    this.priority = 10; // top listener

};

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
        this.texture = this.image_selected.texture;
    } else {
        this.texture = this.image_normal.texture;
    }
    this.set_size(this.width, this.height);
    this.label.set_position(this.width/2,this.height/2);
    Sprite.prototype.update.call(this, dt);
};


Button.prototype.on_mouse_move = function (event) {
    if (!this.check(event.point)) {
        event.stop_propagation();
        this.event_idx = -1;
        this.is_mouse_down = false;
        this.on_mouse_up(event, this);
    }

};


//    window.Button = Button;
//
//}(window));
