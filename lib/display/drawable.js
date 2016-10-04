(function (window, undefined) {

    function Drawable() {
        this.initialize();
    }

    Drawable.prototype = Object.create(PIXI.Container.prototype);
    Drawable.TYPE = UID.numbering();
    Drawable.prototype.constructor = Drawable;

    Drawable.prototype.initialize = function () {

        PIXI.Container.call(this);

        this.TYPE = Drawable.TYPE;

        this.id = UID.numbering();
        this.iterator = 0;
        this.bounds = new Box(new V(), 0, 0).toPolygon();

        this.translation = new V();
        this.is_mouse_down = false;
        this.event_idx = -1;
        this.is_selected = false;
        this.is_visible = true;
        this.is_touchable = true;

        this.__width = 0; //used to prevent from setting same value , multiple times
        this.__height = 0;

        this.tag = 0;
        this.z_index = 1;
        this.priority = 0;

        this._is_centered_x = false;
        this._is_centered_y = false;

        this.is_children_sortable = true;



    };

    Object.defineProperty(PIXI.Container.prototype, "is_visible", {
        get: function () {
            return this._is_visible;
        },
        set: function (value) {
            this._is_visible = value;
            this.visible = value;
        }
    });

    Drawable.prototype.set_position = function (x, y) {
        this.position.x = x;
        this.position.y = y;

        var ap = this.get_absolute_position();

        //todo different for circle bounds
        if (ap) {
            this.set_bounds_position(ap);
            this.iterate_children();
        }

    };

    Drawable.prototype.set_centered = function (is_x_centered, is_y_centered) {
        this._is_centered_x = is_x_centered;
        this._is_centered_y = is_y_centered;

        if (this.parent) {
            this._set_center(is_x_centered, is_y_centered);
        }
    };

    Drawable.prototype._set_center = function (is_x_centered, is_y_centered) {
        var p = this.get_position();
        var parent = this.get_parent();

        if (is_x_centered && is_y_centered) {
            this.set_position(parent.__width / 2 - this.__width / 2, parent.__height / 2 - this.__height / 2);
        } else if (is_x_centered) {
            this.set_position(parent.__width / 2 - this.__width / 2, p.y);
        } else if (is_y_centered) {
            this.set_position(p.x, parent.__height / 2 - this.__height / 2);
        }
    };

    Drawable.prototype.set_size = function (width, height) {

        this.__width = Math.round(width);
        this.__height = Math.round(height);
        this.translation.x = 0;
        this.translation.y = 0;

        this.recalculate_bounds();

    };

    Drawable.prototype.set_anchor = function (x, y) {

        this.anchor.x = x;
        this.anchor.y = y;
        this.translate_bounds_to(x * this.__width, y * this.__height);

    };

    Drawable.prototype.translate_bounds_to = function (x, y) {

        var v = SAT.pool.get();
        v.x = this.translation.x - x;
        v.y = this.translation.y - y;
        v.rotate(this.rotation);

        this.bounds.translate(v.x, v.y);

        this.translation.x = x;
        this.translation.y = y;
    };

    Drawable.prototype.rotate_to = function (angle) {

        var a = angle - this.rotation;
        this.rotation = angle;
        this.bounds.rotate(a);
    };

    Drawable.prototype.rotate = function (angle) {
        this.rotation = angle;
        this.bounds.rotate(angle);
    };

    Drawable.prototype.set_alpha = function (alpha) {
        this.alpha = alpha;
    };

    Drawable.prototype.set_scale = function (scale) {
        this.scale.x = scale;
        this.scale.y = scale;
    };

    Drawable.prototype.set_scale_x = function (x) {
        this.scale.x = x;
    };

    Drawable.prototype.set_scale_y = function (y) {
        this.scale.y = y;
    };

    Drawable.prototype.add_child = function (child) {
        if (!child) {
            throw "Can't add empty child";
        }

        this.addChild(child);
        //  child.on_added_to_parent(this.parent);


        child.on_added_to_parent(this);

        var position = child.get_absolute_position();
        child.set_bounds_position(position);
        child.iterate_children();

    };

    Drawable.prototype.sort_objects = function (objects) {
        Math.insertionSort(objects, this.sort_strategy);
    };

    Drawable.prototype.sort_strategy = function (a, b) {
        return a.z_index < b.z_index;
    };

    Drawable.prototype.remove_child = function (child) {

        var index = this.children.indexOf(child);
        if (index !== -1) {
            this.removeChild(child);
            child.on_remove_from_parent(this);
            this.dispatch_on_remove_children(child);
        }

    };

    Drawable.prototype.dispatch_on_remove_children = function (parent) {

        var children = parent.children;
        var i = children.length;
        while (i--) {
            var child = children[i];
            if (child.TYPE >= 0) {
                child.on_remove_from_parent(parent);
                child.dispatch_on_remove_children(child);
            }
        }

    };

    Drawable.prototype.find_child_by_tag = function (tag, recursive) {

        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.tag === tag) {
                return child;
            }
        }

        if (recursive) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                var node = child.find_child_by_tag(tag,recursive);
                if (node) {
                    return node;
                }
            }
        }
        
        return null;

    };

    Drawable.prototype.get_children = function () {
        return this.children;
    };

    Drawable.prototype.get_parent = function () {
        return this.parent;
    };

    Drawable.prototype.remove_from_parent = function () {
        if (this.parent) {
            this.parent.remove_child(this);
            this.on_remove_from_parent(parent);
        }
    };

    Drawable.prototype.on_added_to_parent = function (parent) {
        this._set_center(this._is_centered_x, this._is_centered_y);
    };

    Drawable.prototype.on_remove_from_parent = function (parent) {
    };

    Drawable.prototype.iterate_children = function () {

        var children = this.children;
        var count = children.length;

        for (var i = 0; i < count; i++) {

            var child = children[i];
            if (child.get_absolute_position) {

                var position = child.get_absolute_position();
                child.set_bounds_position(position);
                child.iterate_children();
            }

        }

    };

    Drawable.prototype.get_anchor = function () {
        return this.anchor;
    };

    Drawable.prototype.get_position = function () {
        return SAT.pool.get().copy(this.position);
    };

    Drawable.prototype.get_absolute_position = function () {

        if (this.parent) {
            return this.iterate_parents(this.parent);
        } else {
            return this.get_position();
        }

    };

    Drawable.prototype.to_relative_position = function (point) {
        return point.clone().sub(this.bounds.pos);
    };

    Drawable.prototype.iterate_parents = function (child) {
        var parent = child.parent;

        if (parent) {

            var p1 = child.get_position();
            var p2 = this.iterate_parents(parent);

            return p1.clone().add(p2);

        } else {
            return this.position;
        }

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
        //TODO it needs to be implemented
    };

    Drawable.prototype.set_bounds = function (bounds) {
        this.bounds = bounds;
    };

    Drawable.prototype.set_bounds_position = function (position) {
        this.bounds.pos.x = position.x;
        this.bounds.pos.y = position.y;
    };

    Drawable.prototype.recalculate_bounds = function () {

        var a = this.rotation;

        this.bounds = new Box(new V(), this.__width, this.__height).toPolygon();
        this.rotation = 0;

        this.set_anchor(this.anchor.x, this.anchor.y);
        this.set_position(this.position.x, this.position.y);

        this.rotate_to(a);

    };

    Drawable.prototype.check = function (point) {
        return SAT.pointInPolygon(point, this.bounds);
    };

    Drawable.prototype.update = function (dt) {
        if (Config.debug && game.stage.debug_layer) {
            this.draw_bounds(this.bounds);
        }
    };
    
    Drawable.prototype.post_update = function (dt) {
        
    };

    Drawable.prototype.draw_bounds = function (bounds) {
        var b = bounds;
        var p = bounds.pos;


        var path = [];
        for (var i = 0; i < b.points.length; i++) {
            path.push(new PIXI.Point(p.x + b.points[i].x, p.y + b.points[i].y));
        }

        game.stage.debug_layer.beginFill(0x000000, 0);
        game.stage.debug_layer.lineStyle(1, 0x000000, 1);
        game.stage.debug_layer.drawPolygon(path);

        game.stage.debug_layer.beginFill(0xFFFF00, 1);
        game.stage.debug_layer.lineStyle(1, 0xFFFF00, 0);
        game.stage.debug_layer.drawCircle(p.x, p.y, 3);
    };


//-------------------------------------------------
// state machine methods

    Drawable.prototype.destroy = function () {

    };

    Drawable.prototype.on_state = function (prev_state, current_state, data) {

    };

    window.Drawable = Drawable;

}(window));