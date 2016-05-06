//(function(window,undefined){

function Slope(image_name) {
    this.initialize(image_name);
}

Slope.prototype = new Sprite();
Slope.TYPE = UID.numbering();
Slope.prototype.sprite_initialize = Slope.prototype.initialize;
Slope.prototype.initialize = function (image_name) {
    this.sprite_initialize(image_name); // your image name
    this.TYPE = Slope.TYPE;
    this.response = new Response();
    this.response_edge = new Response();
    this.c_index = 1;
    this.slope_angles = [];
    this.bounds_size = {width: this.width, height: this.height};
    this.top_y = 0;
    this.calculate_data();
    this.force_collsion_factor = 10;
    this.is_dynamic = false;
    this.is_wreckable = false;
};

Slope.prototype.check = function (object) {

    var polygon = this.bounds;
    var pos = object.get_position();

    // when an object is resolving on a slope and moving downwards 
    // we add +10px to force a collision.Because the gravity is not strong enough 
    // to keep the object on the slope and keep it from bouncing
    if (object.is_on_slope && object.slope_id === this.id) {
        pos.y += this.force_collsion_factor;
        object.set_position(pos.x, pos.y);
    }

    if (SAT.testPolygonPolygon(object.bounds, polygon, this.response)) {

        // this is the vector that holds the information
        // how to resolve the collision  
        var overlap = this.response.overlapV;

        ////////// Performing a check if the object is collsided with a slope
        var is_on_slope = false;
        var a = Math.radians_to_degrees(Math.round_decimal(overlap.getAngle(), 6));
        a = Math.round_decimal(a, 2);// this is the angle at which the object is resolving       

        for (var i = 0; i < this.slope_angles.length; i++) {
            // if that resolving angle is equal with an angle of a slope
            // then we are on a slope
            if (a === this.slope_angles[i]) {
                is_on_slope = true;
                break;
            }
        }
        ////////////////////////

        if (is_on_slope) {

            if (object.velocity.y > 0.3
                    && object.is_dive_attacking) {
                if (this.is_wreckable) {
                    object.slope_id = null;

                    Notes.send(Notes.WRECK_PLATFORM, this);
                } else {
                    object.velocity.y = -0.3;
                    object.is_dive_attacking = false;
                    Notes.send(Notes.UNSUCCESSFUL_WRECK,this);
                }
            } else {
                // if the object is on a slope , we asign that info to the object
                // so we can force the collision the next time to keep the object from bouncing off.            
                object.velocity.y = 0;
                object.is_on_ground = true;
                object.is_on_slope = true;
                object.slope_id = this.id;
                overlap.x = 0;
            }



        } else {

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
                            object.velocity.y = -0.3;
                            object.is_dive_attacking = false;
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

                if (object.velocity.y > 0.05) { // grab the edge only if falling

                    //TODO it needs refactoring

                    var oy = object.get_position().y - 100;
                    var sy = (this.get_position().y + this.top_y);

                    var dy = Math.abs(oy - sy);

                    // check the side at which the player is turned

                    // prevent the player from grabing the edge when he is turned away with his back
                    if ((overlap.x < 0 && object.current_flipped) || (overlap.x > 0 && !object.current_flipped)) {
                        if (dy < 16 && object.velocity.y > 0.05) {
                            object.is_edge_hold = true;
                            pos.y = sy + 100;
                        }
                    }
                }

                if (object.is_on_ground) {
                    // if the object is pushing against the sides
                    object.is_wall_push = true;
                }

            }

        }


        pos.sub(overlap);
        object.set_position(pos.x, pos.y);

        this.response_edge.clear();

    } else {
        // there is no more collsion
        if (object.slope_id === this.id) {

            object.slope_id = 0;
            object.is_on_slope = false;

            // remove the forced collsion
            pos.y -= this.force_collsion_factor;
            object.set_position(pos.x, pos.y);
        }
    }

    this.response.clear();
};

Slope.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

Slope.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

Slope.prototype.on_draw = function (context) {

};

Slope.prototype.update = function (dt) {

};

Slope.prototype.calculate_data = function () {

    // It calculates the slopes
    var polygon = this.bounds;
    this.slope_angles = [];
    for (var i = 0; i < polygon.normals.length; i++) {
        var n = polygon.normals[i];
        var a = Math.radians_to_degrees(Math.round_decimal(n.getAngle(), 6));
        var aa = Math.abs(Math.round_decimal(a, 2));
        if (aa !== 0 && aa !== 90) {
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
    this.bounds_size.width = max_x - min_x;
    this.bounds_size.height = max_y - min_y;
    this.top_y = min_y;
};

Slope.prototype.set_bounds = function (bounds) {

    Sprite.prototype.set_bounds.call(this, bounds);

    this.calculate_data();

};



//    window.Slope = Slope;

//}(window));