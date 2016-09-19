//(function(window, undefined) {

function Drawable() {
    this.initialize();
}
Drawable.prototype.initialize = function() {

    this.position = new Vector();
    this.anchor = new Vector();
    this.translation = new Vector();
    this.reg = new Vector();
    
    this.iterator = 0;

    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this._angle = 0;
    this.alpha = 1.0;
    this._alpha = 1.0;
    this.scale_x = 1;
    this.scale_y = 1;

    this.bounds = new Box(new V(), this.width, this.height).toPolygon();
    this.is_mouse_down = false;
    this.event_idx = -1;
    this.is_selected = false;
    this.is_visible = true;

    this.tag = 0;
    this.z_index = 1;
    this.priority = 0;

    this.parent = null;
    this.children = [];
    this.is_children_sortable = true;

};

Drawable.draw_polygon = function(polygon, context) {

    var points = polygon.points;
    var pos = polygon.pos;

    context.beginPath();

    for (var i = 0; i < points.length; i++) {

        if (i === points.length - 1) {
            var p1 = points[0].clone();
            var p2 = points[i].clone();
        } else {
            var p1 = points[i].clone();
            var p2 = points[i + 1].clone();
        }

        p1.add(pos);
        p2.add(pos);
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
    }


    context.closePath();
    context.stroke();

};

Drawable.prototype.set_position = function(x, y) {
    this.position.x = x;
    this.position.y = y;

    var ap = this.get_absolute_position();

    //todo different for circle bounds
    if (ap) {

        this.set_bounds_position(ap);
        this.iterate_children();
    }
};

Drawable.prototype.set_anchor = function(x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
    this.translate_bounds_to(x * this.width, y * this.height);
};

Drawable.prototype.translate_bounds_to = function(x, y) {

    this.reg.x = x;
    this.reg.y = y;

    var v = new Vector();
    v.x = this.translation.x - this.reg.x;
    v.y = this.translation.y - this.reg.y;
    v.rotate(this.angle);

    this.bounds.translate(v.x, v.y);

    this.translation.x = this.reg.x;
    this.translation.y = this.reg.y;
};

Drawable.prototype.rotate_to = function(angle) {
    var a = angle - this.angle;
    this.angle = angle;
    this._angle = angle;
    if (this.bounds instanceof Polygon) {
        this.bounds.rotate(a);
    }

};

Drawable.prototype.rotate = function(angle) {
    this.angle += angle;
    if (this.bounds instanceof Polygon) {
        this.bounds.rotate(angle);
    }
    
};

Drawable.prototype.set_alpha = function(alpha) {
    this.alpha = alpha;
};

Drawable.prototype.set_scale = function(scale) {
    this.scale_x = scale;
    this.scale_y = scale;
};

Drawable.prototype.set_scale_x = function(x) {
    this.scale_x = x;
};

Drawable.prototype.set_scale_y = function(y) {
    this.scale_y = y;
};

Drawable.prototype.add_child = function(child) {
    if (!child) {
        throw "Can't add empty child";
    }
    child.parent = this;
    child.on_added_to_parent(this);
    this.children.push(child);

    var position = child.get_absolute_position();
    child.set_bounds_position(position);
    child.iterate_children();
    
//    if (this.is_children_sortable) {
//            this.sort_objects(this.children);
//    }
};

Drawable.prototype.sort_objects = function(objects) {
        Math.insertionSort(objects, this.sort_strategy);
};

Drawable.prototype.sort_strategy = function(a, b) {
        return a.z_index < b.z_index;
};

Drawable.prototype.remove_child = function(child) {
    var index = this.children.indexOf(child);
    if (index !== -1) {
        child.on_remove_from_parent(this);
        this.children.splice(index, 1);
        this.dispatch_on_remove_children(child);
    }
};

Drawable.prototype.dispatch_on_remove_children = function(parent) {

    var children = parent.get_children();
    var i = children.length;
    while (i--) {
        var child = children[i];
        child.on_remove_from_parent(parent);
        child.dispatch_on_remove_children(child);
    }

};

Drawable.prototype.get_children = function() {
    return this.children;
};

Drawable.prototype.get_parent = function() {
    return this.parent;
};

Drawable.prototype.remove_from_parent = function() {
    var parent = this.get_parent();
    if (parent) {
        this.get_parent().remove_child(this);
    }
};

Drawable.prototype.on_added_to_parent = function(parent) {
};

Drawable.prototype.on_remove_from_parent = function(parent) {
};

Drawable.prototype.iterate_children = function() {

    var children = this.get_children();
    var count = children.length;

    for (var i = 0; i < count; i++) {

        var child = children[i];
        var position = child.get_absolute_position();
        child.set_bounds_position(position);
        child.iterate_children();
    }

};

Drawable.prototype.get_anchor = function() {
    return this.anchor;
};

Drawable.prototype.get_position = function() {
    return this.position.clone();
};

Drawable.prototype.get_absolute_position = function() {

    if (this.parent) {
        return this.iterate_parents(this.parent);
    } else {
        return this.get_position();
    }

};

Drawable.prototype.to_relative_position = function(point) {
    return point.clone().sub(this.bounds.pos);
};

Drawable.prototype.iterate_parents = function(child) {
    var parent = child.parent;

    if (parent) {

        var p1 = child.get_position();
        var p2 = this.iterate_parents(parent);

        return p1.clone().add(p2);

    } else {
        return this.position;
    }

};

Drawable.prototype.on_mouse_down = function(event) {
};
Drawable.prototype.on_mouse_up = function(event) {
};
Drawable.prototype.on_mouse_move = function(event) {
};
Drawable.prototype.on_mouse_cancel = function() {
};

Drawable.prototype.on_right_mouse_down = function(event) {
};
Drawable.prototype.on_right_mouse_up = function(event) {
};
Drawable.prototype.on_right_mouse_move = function(event) {
};

Drawable.prototype.resign_event_to_parent = function(event, event_type) {

    this.is_mouse_down = false;
    var parent = this.get_parent();
    if (parent) {
        parent.is_mouse_down = true;

        if (event_type === 'on_mouse_down') {
            parent.on_mouse_down(event);
        } else if (event_type === 'on_mouse_move') {
            parent.on_mouse_move(event);
        } else if (event_type === 'on_mouse_up') {
            parent.on_mouse_up(event);
        }

    } else {
        log("no parent found to resign the event");
    }
};



Drawable.prototype.set_bounds = function(bounds){
    this.bounds = bounds;
};

Drawable.prototype.set_bounds_position = function(position) {
    this.bounds.pos.x = position.x;
    this.bounds.pos.y = position.y;
};

Drawable.prototype.set_size = function(width, height) {
    this.width = Math.round(width);
    this.height = Math.round(height);
    this.translation.x = 0;
    this.translation.y = 0;
      
    this.recalculate_bounds();
};

Drawable.prototype.recalculate_bounds = function() {
    
    var a = this.angle; 
    
    this.bounds = new Box(new V(), this.width, this.height).toPolygon();
    this.angle = 0;
    
    this.set_anchor(this.anchor.x, this.anchor.y);
           
    var p = this.get_position();
    this.set_position(p.x,p.y);
    
    this.rotate_to(a);
    
};

Drawable.prototype.check = function(point) {
    return SAT.pointInPolygon(point, this.bounds);
};

Drawable.prototype.draw = function(ctx) {
    throw "you must implment draw method for drawable";
};

Drawable.prototype.update = function(dt) {

};

Drawable.prototype.debug_bounds = function(context) {

    var points = this.bounds.points;

    var fillStyle = context.fillStyle;
    var pos = this.bounds.pos;

    context.fillStyle = 'yellow';
    context.beginPath();
    context.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    context.fillStyle = fillStyle;

    context.beginPath();

    if (this.bounds instanceof Polygon) {
        var first = true;
        for (var ind in points) {

            var c = points[ind].clone();
            c.add(pos);
            if (first) {
                first = false;
                context.moveTo(c.x, c.y);
            } else {
                context.lineTo(c.x, c.y);
            }
        }

        var c = points[0].clone();
        c.add(pos);
        context.lineTo(c.x, c.y);

        context.stroke();
        context.closePath();

    } else if (this.bounds instanceof Circle) {
        context.beginPath();
        context.arc(pos.x, pos.y, this.bounds.r, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
    }


};

Drawable.prototype.on_draw_finished = function(ctx) {
};

Drawable.prototype.clear = function(ctx) {
    throw "you must implment clear from canvas method for drawable";
};

//-------------------------------------------------
// state machine methods

Drawable.prototype.on_state = function(prev_state, current_state, data) {

};

//  window.Drawable = Drawable;

//}(window));