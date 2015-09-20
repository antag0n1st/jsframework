//(function(window, undefined) {

function Drawable() {
    this.initialize();
}

Drawable.prototype = Object.create(PIXI.Container.prototype);
Drawable.prototype.constructor = Drawable;

Drawable.prototype.initialize = function () {

    PIXI.Container.call(this);

    this.id = UID.gen();
    this.iterator = 0;
    //  this.bounds = new Box(new V(), this.width, this.height).toPolygon();
    this.is_mouse_down = false;
    this.event_idx = -1;
    this.is_selected = false;
    this.is_visible = true;

    this.tag = 0;
    this.z_index = 1;
    this.priority = 0;

    this.is_children_sortable = true;

};

Drawable.prototype.set_position = function (x, y) {

    this.position.x = x;
    this.position.y = y;

//    var ap = this.get_absolute_position();
//
//    //todo different for circle bounds
//    if (ap) {
//
//        this.set_bounds_position(ap);
//        this.iterate_children();
//    }
};

Drawable.prototype.set_anchor = function (x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
//    if (this.bounds instanceof Polygon) {
//        this.translate_bounds_to(x * this.width, y * this.height);
//    }
};

Drawable.prototype.translate_bounds_to = function (x, y) {

};

Drawable.prototype.rotate_to = function (angle) {

    this.rotation = angle;
};

Drawable.prototype.rotate = function (angle) {
    this.rotation = angle;
};

Drawable.prototype.set_alpha = function (alpha) {
    this.alpha = alpha;
};

Drawable.prototype.set_scale = function (scale) {
    this.scale_x = scale;
    this.scale_y = scale;
};

Drawable.prototype.set_scale_x = function (x) {
    this.scale_x = x;
};

Drawable.prototype.set_scale_y = function (y) {
    this.scale_y = y;
};

Drawable.prototype.add_child = function (child) {
    if (!child) {
        throw "Can't add empty child";
    }

    this.addChild(child);
    this.on_added_to_parent(this.parent);

};

Drawable.prototype.sort_objects = function (objects) {
    Math.insertionSort(objects, this.sort_strategy);
};

Drawable.prototype.sort_strategy = function (a, b) {
    return a.z_index < b.z_index;
};

Drawable.prototype.remove_child = function (child) {
    this.removeChild(child);
};


Drawable.prototype.get_children = function () {
    return this.children;
};

Drawable.prototype.get_parent = function () {
    return this.parent;
};

Drawable.prototype.remove_from_parent = function () {
    this.parent.remove_child(this);
    this.on_remove_from_parent(parent);
};

Drawable.prototype.on_added_to_parent = function (parent) {
};

Drawable.prototype.on_remove_from_parent = function (parent) {
};

Drawable.prototype.iterate_children = function () {

//    var children = this.get_children();
//    var count = children.length;
//
//    for (var i = 0; i < count; i++) {
//
//        var child = children[i];
//        var position = child.get_absolute_position();
//        child.set_bounds_position(position);
//        child.iterate_children();
//    }

};

Drawable.prototype.get_anchor = function () {
    return this.anchor;
};

Drawable.prototype.get_position = function () {
    return this.position;
};

Drawable.prototype.get_absolute_position = function () {



};

Drawable.prototype.to_relative_position = function (point) {

};

Drawable.prototype.iterate_parents = function (child) {


};

Drawable.prototype.on_mouse_down = function (event) {
};
Drawable.prototype.on_mouse_up = function (event) {
};
Drawable.prototype.on_mouse_move = function (event) {
};
Drawable.prototype.on_mouse_cancel = function () {
};

Drawable.prototype.on_right_mouse_down = function (event) {
};
Drawable.prototype.on_right_mouse_up = function (event) {
};
Drawable.prototype.on_right_mouse_move = function (event) {
};

Drawable.prototype.resign_event_to_parent = function (event, event_type) {

//    this.is_mouse_down = false;
//    var parent = this.get_parent();
//    if (parent) {
//        parent.is_mouse_down = true;
//
//        if (event_type === 'on_mouse_down') {
//            parent.on_mouse_down(event);
//        } else if (event_type === 'on_mouse_move') {
//            parent.on_mouse_move(event);
//        } else if (event_type === 'on_mouse_up') {
//            parent.on_mouse_up(event);
//        }
//
//    } else {
//        log("no parent found to resign the event");
//    }
};



Drawable.prototype.set_bounds = function (bounds) {

};

Drawable.prototype.set_bounds_position = function (position) {

};

Drawable.prototype.set_size = function (width, height) {

};

Drawable.prototype.recalculate_bounds = function () {



};

Drawable.prototype.check = function (point) {

};

Drawable.prototype.update = function (dt) {

};


//-------------------------------------------------
// state machine methods

Drawable.prototype.on_state = function (prev_state, current_state, data) {

};

//  window.Drawable = Drawable;

//}(window));