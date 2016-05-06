//(function(window,undefined){

function FloatBouncePlatform(image_name) {
    this.initialize(image_name);
}

FloatBouncePlatform.prototype = new Sprite();
FloatBouncePlatform.TYPE = UID.numbering();
FloatBouncePlatform.prototype.sprite_initialize = FloatBouncePlatform.prototype.initialize;
FloatBouncePlatform.prototype.initialize = function (image_name) {
    this.sprite_initialize(image_name); // your image name
    this.TYPE = FloatBouncePlatform.TYPE;
    this.response = new Response();
    this.velocity = new V(0, 0);
    this.is_dynamic = false;
    this.collided_objects = [];
    this.c_index = 2;

    this.initial_position = new V();
    this.dumping = -1;
    this.mass = 0.1;
    this.spring_length = 0;
    this.k = -8;
  
};



FloatBouncePlatform.prototype.check = function (object) {

    var polygon = this.bounds;

    if (SAT.testPolygonPolygon(object.bounds, polygon, this.response)) {


        if (object.velocity.y < 0) { // while jumping 
            return;
        }

        if (object.velocity.y === 0 && this.velocity.y > 0) {
            return;
        }

        var overlap = this.response.overlapV;

        if (overlap.x !== 0) {
            return; // if it is on the side of the platform
        }

        // this factor is to dinamicly prevent from passing the platform
        // if the speed is grater , then we need grater value
        // so , if the player is landing of the platform with a grater speed
        // the platform will behave like it has grater height and it will prevent
        // it from falling

        var factor = 20;

        var pos = object.get_position();

        var p = this.bounds.pos.clone();

        p.add(this.bounds.offset);

        if (object.is_on_ground) { // while on the plaform , add extra thickness
            factor += 10;
        }

        var y = p.y + factor + (factor * object.velocity.y);

        if (y < object.bounds.pos.y) {
            return;
        }

        if (!object.is_on_ground) {
            this.velocity.y = object.velocity.y * 0.9;
            this.velocity.scale(1000);
            this.mass = object.mass;
        }

        if (object.velocity.y > -0.05) { // its a threshold not to start running on the edge
            object.velocity.y = 0;
            object.is_on_ground = true;
        }



        pos.sub(overlap);
        object.set_position(pos.x, pos.y);


        //  this.did_collide = true;
        object.float_id = this.id;
        this.collided_objects.push(object);

    }
    this.response.clear();
};

FloatBouncePlatform.prototype.on_added_to_parent = function (parent) {
    Drawable.prototype.on_added_to_parent.call(this, parent);

};

FloatBouncePlatform.prototype.on_remove_from_parent = function (parent) {
    Drawable.prototype.on_remove_from_parent.call(this, parent);

};

FloatBouncePlatform.prototype.on_draw = function (context) {

};


FloatBouncePlatform.prototype.update = function (dt) {

    var pos = this.get_position();

    


    if (this.collided_objects.length > 0) {

        for (var i = 0; i < this.collided_objects.length; i++) {

            var object = this.collided_objects[i];

            if (object.float_id === this.id) {                
                var pp = object.get_position();
                pp.add(this.velocity.clone().scale(0.0009).scale(dt));
                object.set_position(pp.x, pp.y);
            }

            object.float_id = 0;
        }
        this.collided_objects = [];
    }


    //////////////////////////////////// Spring Physics

    var F_spring = this.k * ((pos.y - this.initial_position.y) - this.spring_length);
    var F_damper = this.dumping * (this.velocity.y);
    var a = (F_spring + F_damper) / this.mass;
    this.velocity.y += a * dt / 1000;
    var y = this.velocity.y * dt / 1000;

    pos.add(new V(0, y));

    ////////////////////////////////////


    this.set_position(pos.x, pos.y);

};


//    window.FloatBouncePlatform = FloatBouncePlatform;

//}(window));