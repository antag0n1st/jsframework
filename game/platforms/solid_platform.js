//(function(window,undefined){

function SolidPlatform(image_name) {
    this.initialize(image_name);
}

SolidPlatform.prototype = new Sprite();
SolidPlatform.TYPE = UID.numbering();
SolidPlatform.prototype.sprite_initialize = SolidPlatform.prototype.initialize;
SolidPlatform.prototype.initialize = function (image_name) {
    this.sprite_initialize(image_name); // your image name
    this.TYPE = SolidPlatform.TYPE;
    this.response = new Response();
    this.response_edge = new Response();
    this.c_index = 1;
    this.slope_angles = [];

    this.top_y = 0;
    this.max_x = 0;
    this.min_x = 0;
    this.calculate_data();
    this.force_collsion_factor = 10;
    this.is_dynamic = false;
    this.is_wreckable = false;
};

SolidPlatform.prototype.set_size = function(width,height){
    Sprite.prototype.set_size.call(this,width,height);
    this.calculate_data();
};

SolidPlatform.prototype.check = function (object) {

    var polygon = this.bounds;
    var pos = object.get_position();


    if (SAT.testPolygonPolygon(object.bounds, polygon, this.response)) {

        // this is the vector that holds the information
        // how to resolve the collision  
        var overlap = this.response.overlapV;

        // if it is not on a slope we continue to resolve against 
        // the vertical and horizontal sides on the platform

        // if the object was previosly resoving with this slope
        if (object.is_on_slope && object.slope_id === this.id) {

            // we remove the forced collision and perform a normal collision

            pos.y -= this.force_collsion_factor;
            object.set_position(pos.x, pos.y);

            if (SAT.testPolygonPolygon(object.bounds, polygon, this.response_edge)) {
                overlap = this.response_edge.overlapV;
            } else {
                // but if by any chance this does not work
                // we should go back to the forced collision technic
                pos.y += this.force_collsion_factor;
                object.set_position(pos.x, pos.y);
            }

        }

        if (overlap.y !== 0 && overlap.x !== 0) {
            // the object is resolving on the edges

            object.is_on_ground = false;
            object.is_on_slope = false;
            object.slope_id = 0;
        } else if (overlap.y > 0 && overlap.x === 0) {
            // if it resoves on the top of the obsticle
            if (object.velocity.y > -0.05) { // its a threshold not to start running on the edge

                if (object.velocity.y > 0.3
                        && object.is_dive_attacking) {
                    if (this.is_wreckable) {
                        object.slope_id = null;

                        Notes.send(Notes.WRECK_PLATFORM, this);
                    } else {
                        object.velocity.y = -0.2;
                        object.is_dive_attacking = false;
                        Notes.send(Notes.UNSUCCESSFUL_WRECK,this);
                    }

                } else {
                    object.velocity.y = 0;
                    object.is_dive_attacking = false;

                    object.is_on_ground = true;
                    object.slope_id = null;
                }

            } else {
                object.is_on_slope = false;
                object.slope_id = 0;
            }



        } else if (overlap.y < 0 && overlap.x === 0) {
            // if it is resolving below the obsticle , head hits the sealing
            object.velocity.y = 0;
            object.is_on_slope = false;
            object.slope_id = 0;

        } else if (overlap.x !== 0) {
            // its on the side of the wall



            //TODO it needs refactoring

            var padding = 0;

            var oy = object.bounds.pos.y - padding;
            var sy = (this.bounds.pos.y + this.top_y);

            var dy = Math.abs(oy - sy);
            
            // check the side at which the player is turned

            // prevent the player from grabing the edge when he is turned away with his back
//                if ((overlap.x < 0 && object.current_flipped) || (overlap.x > 0 && !object.current_flipped)) {
//                    if (dy < 16 && object.velocity.y > 0.05) {
//                        object.is_edge_hold = true;
//                        pos.y = sy + padding;
//                    }
//                }



            if (!object.is_on_ground ) {
                // check for the sides if he is turnd with the back

                if (((object.current_flipped && object.velocity.x < 0) ||
                        (!object.current_flipped && object.velocity.x > 0)) && this.__height > object.__height) {
                  
                    if(dy > 50){ // make sure the hand of the object are grabing the wall
                        
                        object.is_wall_drag = true;
                    }                    
                    
                } else {
                    object.velocity.x = 0;
                }

            } else if (object.is_on_ground) {
                // if the object is pushing against the sides
//                if (Config.is_auto_run) {
//                    Notes.send(Notes.NOTE_SIDE_FLIPPED, null, this);
//                } else {
                    object.is_wall_push = true;
                //}

            }

        }


        pos.sub(overlap);
        object.set_position(pos.x, pos.y);

        this.response_edge.clear();
        this.response.clear();


        // check if the element is the edge
        // object.bounds.pos.x this.bounds.pos.x
        this.check_is_near_edge(object);

        return true;
    }

    this.response.clear();

    return false;
};

SolidPlatform.prototype.check_is_near_edge = function (object) {

    var d_min_x = object.bounds.pos.x - (this.bounds.pos.x + this.min_x);
    var d_max_x = object.bounds.pos.x - (this.bounds.pos.x + this.max_x);

    if (Math.abs(d_min_x) < 30) {
        object.is_near_left_edge = true;
        object.is_near_right_edge = false;
    } else if (Math.abs(d_max_x) < 30) {
        object.is_near_right_edge = true;
        object.is_near_left_edge = false;
    } else {
        object.is_near_left_edge = false;
        object.is_near_right_edge = false;
    }

};

SolidPlatform.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

SolidPlatform.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

SolidPlatform.prototype.on_draw = function (context) {

};


SolidPlatform.prototype.calculate_data = function () {

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
    
    this.top_y = min_y;
    this.min_x = min_x;
    this.max_x = max_x;
};

SolidPlatform.prototype.set_bounds = function (bounds) {

    Sprite.prototype.set_bounds.call(this, bounds);

    this.calculate_data();

};



//    window.SolidPlatform = SolidPlatform;

//}(window));