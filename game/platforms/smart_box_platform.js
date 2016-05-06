//(function(window,undefined){

function SmartBoxPlatform(conf) {
    this.initialize(conf);
}

SmartBoxPlatform.prototype = new Sprite();
SmartBoxPlatform.TYPE = UID.numbering();
SmartBoxPlatform.prototype.sprite_initialize = SmartBoxPlatform.prototype.initialize;
SmartBoxPlatform.prototype.initialize = function (conf) {

    this.config = conf;
    
    this.sprite_initialize(); // your image name
    this.TYPE = SmartBoxPlatform.TYPE;
    
    this.response = new Response();
    this.c_index = 1;
    this.slope_angles = [];
    this.bounds_size = {width: this.width, height: this.height};
    this.top_y = 0;
    
    this.force_collsion_factor = 10;
    this.is_dynamic = true;
    this.is_wreckable = false;
    
    this.max_x = 0;
    this.min_x = 0;
    
    this.gravity = new Vector(0, 0.0015);

    this.is_on_ground = false;
    this.is_edge_hold = false;
    this.is_wall_push = false;
    this.is_on_slope = false;
    this.slope_id = 0;
    this.float_id = 0;
    this.is_object_push = false;
    this.velocity = new V();

    this.is_left_wrecked = false;
    this.is_right_wrecked = false;
    this.imposible_to_construct = false;

    this.calculate_data();

    this.layout_textures();



};

SmartBoxPlatform.prototype.get_wrecked_parts = function (x_wreck, wreck_width) {
    var wrecked_parts = [];

    var p = this.get_position();

    var left_wrecked_part = new SmartBoxPlatform(this.config);
    left_wrecked_part.is_right_wrecked = true;
    left_wrecked_part.is_left_wrecked = this.is_left_wrecked; // the left is inherited
    left_wrecked_part.is_wreckable = true;
    left_wrecked_part.set_size(x_wreck - wreck_width / 2, this.__height); // this will force the sprite to recalucate its layout
    left_wrecked_part.set_position(p.x, p.y);

    if (!left_wrecked_part.imposible_to_construct) {
        wrecked_parts.push(left_wrecked_part);
    }

    var right_wrecked_part = new SmartBoxPlatform(this.config);
    right_wrecked_part.is_right_wrecked = this.is_right_wrecked; // the right is inherited
    right_wrecked_part.is_left_wrecked = true;
    right_wrecked_part.is_wreckable = true;
    right_wrecked_part.set_size(this.__width - (x_wreck - wreck_width / 2) - wreck_width, this.__height); // this will force the sprite to recalucate its layout
    right_wrecked_part.set_position(p.x + (x_wreck - wreck_width / 2) + wreck_width -1, p.y);

    if (!right_wrecked_part.imposible_to_construct) {
        wrecked_parts.push(right_wrecked_part);
    }

    return wrecked_parts;
};

SmartBoxPlatform.prototype.layout_textures = function () {


    for (var i = this.children.length - 1; i >= 0; i--) {
        var child = this.children[i];
        child.remove_from_parent();
    }
    this.children = [];

    var left_side = this.is_left_wrecked ? this.config.left_wreck : this.config.left;
    var right_side = this.is_right_wrecked ? this.config.right_wreck : this.config.right;

    var center_to_fulfill = this.__width - left_side - right_side
            + this.config.left_padding
            + this.config.right_padding;

    if (center_to_fulfill < 10) { // we give 10 pixels extra
        this.imposible_to_construct = true;
        return;
    }

    var c = center_to_fulfill / this.config.center;
    var center_part_count = Math.ceil(c);

    for (var i = 0; i < center_part_count; i++) {

        var s = new Sprite();

        
        var x = left_side + i * this.config.center - this.config.left_padding;
        var y = -this.config.top_padding;
        
        var texture = PIXI.Texture.fromFrame('center_' + this.config.name);
     
        var baseTexture = texture.baseTexture;
        
        var width = texture.width;
        var height = texture.height;

        if (center_part_count - 1 == i) {
            var decimal = c - Math.floor(c);
            if (decimal != 0) {
                width = texture.width * decimal;
                height = texture.height;
            }
        }
        
        var rec = new PIXI.Rectangle(texture.frame.x, texture.frame.y, width, height);
        s.texture = new PIXI.Texture(baseTexture, rec);
        s.set_size(width,height);
        s.set_position(x,y);
        this.add_child(s);
    }

    if (this.is_left_wrecked) {
        var s = new Sprite('left_wreck_' + this.config.name);
        s.set_position(-this.config.left_padding, -this.config.top_padding);
        this.add_child(s);
    } else {
        var s = new Sprite('left_' + this.config.name);
        s.set_position(-this.config.left_padding, -this.config.top_padding);
        this.add_child(s);
    }

    if (this.is_right_wrecked) {
        var s = new Sprite('right_wreck_' + this.config.name);
        s.set_position(this.__width - this.config.right_wreck + this.config.right_padding - 1, -this.config.top_padding);
        this.add_child(s);
    } else {
        var s = new Sprite('right_' + this.config.name);
        s.set_position(this.__width - this.config.right + this.config.right_padding - 1, -this.config.top_padding);
        this.add_child(s);
    }

    this.imposible_to_construct = false;
};

SmartBoxPlatform.prototype.set_size = function (width, height) {
    Sprite.prototype.set_size.call(this, width, height);    
    this.layout_textures();
    this.calculate_data();
};

SmartBoxPlatform.prototype.check = function (object) {

    var polygon = this.bounds;
    var pos = object.get_position();



    if (SAT.testPolygonPolygon(object.bounds, polygon, this.response)) {

        // this is the vector that holds the information
        // how to resolve the collision  
        var overlap = this.response.overlapV;


        if (overlap.y !== 0 && overlap.x !== 0) {
            // the object is resolving on the edges
            object.is_on_ground = false;
            
        } else if (overlap.y > 0 && overlap.x === 0) {
            // if it resoves on the top of the obsticle
            if (object.velocity.y > -0.05) { // its a threshold not to start running on the edge

                if (object.velocity.y > 0.3
                        && object.is_dive_attacking) {
                    if (this.is_wreckable) {
                        object.slope_id = null;
                      
                        Notes.send(Notes.WRECK_PLATFORM, this);
                    } else {
                        object.velocity.y = -0.3;
                        object.is_dive_attacking = false;
                    }

                } else {
                    object.velocity.y = 0;
                    object.is_dive_attacking = false;

                    object.is_on_ground = true;
                    object.slope_id = null;
                }
            } 

        } else if (overlap.y < 0 && overlap.x === 0) {
            // if it is resolving below the obsticle , head hits the sealing
            object.velocity.y = 0;
            object.slope_id = 0;
            object.head_hits_the_sealing = true;

        } else {
            object.velocity.x = 0;
        }



        pos.sub(overlap);
        object.set_position(pos.x, pos.y);
        
        this.check_is_near_edge(object);

        this.response.clear();
        return true;

    } 

    this.response.clear();

    return false;
};

SmartBoxPlatform.prototype.check_is_near_edge = function(object){
    
   var d_min_x = object.bounds.pos.x - (this.bounds.pos.x + this.min_x);
   var d_max_x = object.bounds.pos.x - (this.bounds.pos.x + this.max_x);
   
   if(Math.abs(d_min_x) < 30){
       object.is_near_left_edge = true;
       object.is_near_right_edge = false;
   } else if(Math.abs(d_max_x) < 30){
       object.is_near_right_edge = true;
       object.is_near_left_edge = false;
   } else {
       object.is_near_left_edge = false;
       object.is_near_right_edge = false;
   }
    
};

SmartBoxPlatform.prototype.on_added_to_parent = function (parent) {
    Sprite.prototype.on_added_to_parent.call(this, parent);

};

SmartBoxPlatform.prototype.on_remove_from_parent = function (parent) {
    Sprite.prototype.on_remove_from_parent.call(this, parent);

};

SmartBoxPlatform.prototype.update_movement = function (dt) {

    this.is_on_ground = false;
    var g = this.gravity.clone().scale(dt);
    this.velocity.add(g);


    var v = this.velocity.clone();
    v.scale(dt);

    var p = this.get_position();
    p.add(v);

    this.set_position(p.x, p.y);
};

SmartBoxPlatform.prototype.calculate_data = function () {

    // It calculates the slopes
    var polygon = this.bounds;
    this.slope_angles = [];
    for (var i = 0; i < polygon.normals.length; i++) {
        var n = polygon.normals[i];
        var a = Math.radians_to_degrees(Math.round_decimal(n.getAngle(), 6));
        var aa = Math.abs(Math.round_decimal(a, 2));
        if (aa !== 0 && aa !== 90 && aa !== 180) {
            a = (a < 0) ? Math.round_decimal(180 + a, 2) : Math.round_decimal(a, 2);
            this.slope_angles.push(a);
        }
    }

    // Calculate the bounds width and height
    var min_x = 9999999;
    var max_x = -9999999;
    var min_y = 9999999;
    var max_y = -9999999;
    for (var i = 0; i < polygon.points.length; i++) {
        var point = polygon.points[i];

        if (point.x > max_x) {
            max_x = point.x;
        }
        if (point.x < min_x) {
            min_x = point.x;
        }

        if (point.y > max_y) {
            max_y = point.y;
        }
        if (point.y < min_y) {
            min_y = point.y;
        }
    }
    this.bounds_size = {};
    this.bounds_size.width = max_x - min_x;
    this.bounds_size.height = max_y - min_y;
    this.top_y = min_y;
    this.min_x = min_x;
    this.max_x = max_x;
};

SmartBoxPlatform.prototype.set_bounds = function (bounds) {

    Sprite.prototype.set_bounds.call(this, bounds);

    this.calculate_data();

};




//    window.SmartBoxPlatform = SmartBoxPlatform;

//}(window));