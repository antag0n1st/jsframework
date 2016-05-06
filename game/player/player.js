(function (window, undefined) {

    function Player() {
        this.initialize();
    }

    Player.prototype = new Sprite();
    Player.prototype.sprite_initialize = Player.prototype.initialize;
    Player.TYPE = UID.numbering();
    Player.prototype.initialize = function () {
        this.sprite_initialize(); // your image name
        this.TYPE = Player.TYPE;

        this.character = new Sprite('player');
        this.character.set_anchor(0.5,1);
        this.add_child(this.character);
        
        this.set_anchor(0.5, 1);
        this.set_size(50,60);

        this.is_on_ground = false;
        this.is_edge_hold = false;
        this.is_wall_push = false;
        this.is_wall_drag = false;
        this.is_on_slope = false;
        this.is_gliding = false;
        this.is_under_attack = false;
        this.is_dive_attacking = false;
        this.is_attracted = false;
        this.is_ready = false;

        this.is_near_left_edge = false;
        this.is_near_right_edge = false;
        this.can_double_jump = true;

        this.is_dead = false;
        this.is_indestructable = false;

        this.current_flipped = false;

        this.velocity = new Vector();
        this.max_velocity = 1.1;
        this.max_gliding_velocity = 0.13;
        this.acceleration = 0.0007; // 0.013;
        this.mass = 0.1;
        this.decceleration = 0.005;
        this.dive_attack_time = 0;
        this.dive_treshold = 0.7;

        this.attack_count = 0; // helps determine the attack animation
        this.attack_time = 0;

        this.blink_time = 0;

        this.slope_id = 0;
        this.float_id = 0;

        this.run_speed = 400 / 1000;//px/s
        this._run_speed = this.run_speed;

        this.jump_speed = 620 / 1000; // //px/s
        this._jump_speed = this.jump_speed;

        this.jump_boost = 0.5 / 1000;
        this.push_speed = 200 / 1000;


        this.damage = 10;
        this.full_health = 20;
        this.health = this.full_health;

        this.gravity = new Vector(0, 0.0015);
        this.normal_gravity = new Vector(0, 0.0015);
        this.wall_drag_gravity = new Vector(0, 0.0002);

        this.platforms = [];
        this.objects = [];
        this.sensors = [];
        this.enemies = [];
        this.attractors = [];

        this.controller = new PlayerController(true);

        this.arrow_point = new V(); // the point where the arrow will apear        
        this.attraction_timeout = 0;
        this.launch_angle = 0; // used to launch the character in air
        this.launch_speed = 0;

        this.states = new PlayerStates(this);
        this.blink_tween = new TweenBlink(this, 0.2, null, 200);


        this.arrow = new Sprite('arrow');
        this.arrow.is_visible = false;
        this.arrow.set_anchor(1, 0.5);
        this.arrow.set_position(0, -30);
        this.add_child(this.arrow);

    };

    Player.prototype.set_velocity = function (angle, magnitude) {

        this.velocity.setLength(magnitude * this.jump_speed);

        this.velocity.setAngle(angle);

    };

    Player.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this, parent);

    };

    Player.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this, parent);

    };

    Player.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);



//    if (this.controller.is_left && !this.is_dead && !this.controller.is_ritual) {
//
//        if (this.current_flipped !== true) {
//            Notes.send(Notes.NOTE_SIDE_FLIPPED, null, this);
//        }
//
//        if (this.is_on_ground) {
//            this.velocity.x = -this.run_speed;
//            this.is_wall_drag = false;
//        } else {
//            this.velocity.x -= this.acceleration * dt;
//        }
//
//    } else if (this.controller.is_right && !this.is_dead && !this.controller.is_ritual) {
//
//        if (this.current_flipped !== false) {
//            Notes.send(Notes.NOTE_SIDE_FLIPPED, null, this);
//        }
//
//        if (this.is_on_ground) {
//            this.velocity.x = this.run_speed;
//            this.is_wall_drag = false;
//        } else {
//            this.velocity.x += this.acceleration * dt;
//        }
//
//    } else {
//
//        if (this.is_on_ground && !this.controller.is_up_pressed) {
//            this.is_wall_drag = false;
//            if (this.is_under_attack) {
//                // delecerate
//
//                if (this.velocity.x > 0) {
//                    this.velocity.x -= this.acceleration * 0.7 * dt;
//                    this.velocity.x = (this.velocity.x < 0) ? 0 : this.velocity.x;
//                } else {
//                    this.velocity.x += this.acceleration * 0.7 * dt;
//                    this.velocity.x = (this.velocity.x > 0) ? 0 : this.velocity.x;
//                }
//
//            } else {
//                this.velocity.x = 0;
//            }
//
//        } else {
//            // decelerate
//            if (this.velocity.x > 0) {
//                this.velocity.x -= this.acceleration * 0.3 * dt;
//                this.velocity.x = (this.velocity.x < 0) ? 0 : this.velocity.x;
//            } else {
//                this.velocity.x += this.acceleration * 0.3 * dt;
//                this.velocity.x = (this.velocity.x > 0) ? 0 : this.velocity.x;
//            }
//        }
//
//
//
//    }



        this.velocity.x = (this.velocity.x < -this.run_speed) ? -this.run_speed : this.velocity.x;
        this.velocity.x = (this.velocity.x > this.run_speed) ? this.run_speed : this.velocity.x;


        if (this.is_on_ground) {

            if (this.velocity.x > 0) {
                this.velocity.x -= this.acceleration * 0.7 * dt;
                this.velocity.x = (this.velocity.x < 0) ? 0 : this.velocity.x;
            } else {
                this.velocity.x += this.acceleration * 0.7 * dt;
                this.velocity.x = (this.velocity.x > 0) ? 0 : this.velocity.x;
            }

        }


        if (this.controller.is_up && !this.is_dive_attacking && !this.is_dead) {
            if (this.velocity.y === 0 && this.is_on_ground) {// jump only if on ground
                this.velocity.y = -this.jump_speed;
                this.is_on_ground = false;
                this.is_edge_hold = false;
                this.is_on_slope = false;
                //  this.slope_id = null;
            }
        }


        if (this.controller.is_up_pressed && this.is_wall_drag) {
            this.velocity.y = -this.jump_speed;
            this.is_on_ground = false;
            this.is_edge_hold = false;
            this.is_on_slope = false;
            this.is_wall_drag = false;
            this.is_ring_hold = false;

            if (this.current_flipped) {
                this.velocity.setAngle(Math.degrees_to_radians(-45));
            } else {
                this.velocity.setAngle(Math.degrees_to_radians(-135));
            }
            this.velocity.y = -this.jump_speed * 0.8;

        }


        this.is_gliding = false;

        if (this.controller.is_up_holding
                && this.velocity.y < 0
                && !this.is_dead
                && !this.is_wall_drag) { // add boost only whle jumping
            this.velocity.y -= this.jump_boost * dt;
        }

        if (this.controller.is_down && !this.is_dead) {

            if (this.is_wall_drag) {
                this.is_wall_drag = false;
                // just to prevent it from entering in that state of dive attack
                this.dive_attack_time = Ticker.time;
            }
        }


        if (this.is_wall_drag) {
            this.gravity = this.wall_drag_gravity;
        } else {
            this.gravity = this.normal_gravity;
        }
        var v = this.gravity.clone().scale(dt);
        this.velocity.add(v);

        if (this.is_wall_drag) {
            this.velocity.x = this.current_flipped ? -0.01 : 0.01;
        }

        if (this.is_dive_attacking) {
            var v = this.gravity.clone().scale(dt);
            this.velocity.add(v);
            var v = this.gravity.clone().scale(dt);
            this.velocity.add(v);
        }

        if (this.is_edge_hold) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        if (this.is_wall_push || this.is_object_push || this.is_wall_drag || this.is_under_attack) {
            this.controller.is_attacking = false;
        }


        if (this.is_dive_attacking) {
            this.velocity.x = 0;
        }

        if (this.velocity.len() > this.max_velocity) {
            this.velocity.setLength(this.max_velocity);
        }


        ////////////////////////////////update movement

        var v = this.velocity.clone();
        v.scale(dt);
        var p = this.get_position();
        p.add(v);
        this.set_position(p.x, p.y);
        //////////////////////////////resolve collisions
        this.is_wall_push = false;
        this.is_object_push = false;

        this.is_ring_hold = false;
        // Perform collision test with objects first
        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].check(this);
        }

        this.is_wall_drag = false;

        for (var i = 0; i < this.platforms.length; i++)
        {
            var platform = this.platforms[i];
            platform.check(this);
        }

        if (this.is_wall_drag) {
            this.controller.is_up = false;
            this.controller.is_up_pressed = false;
        }

        if (this.states.fsm.currentState.name === 'dive_attack') {
            for (var i = 0; i < this.enemies.length; i++)
            {
                var enemy = this.enemies[i];

                var polygon = this.get_bounding_box_by_name('attack_bounds', 'attack4', 'root');

                var response = enemy.check_attack(polygon);
                if (response) {
                    enemy.take_damage(this, this.damage, response);

                    if (enemy.is_dead) {
                        this.enemies.remove_element(enemy);
                        enemy.remove_from_parent();
                    }
                }
            }
        }

        if (this.is_under_attack) {
            this.health_bar_visibility_time = 1000 * 3;
            this.health_bar_visibility_alpha = 1;
            this.is_wall_drag = false;
        }

        this.health_bar_visibility_time -= dt;

        if (this.health_bar_visibility_time <= 0) {
            this.health_bar_visibility_alpha -= 0.001 * dt;
        }




        // this.shadow.is_visible = this.is_on_ground;


        this.states.update();
        //   log(this.velocity);

    };

    Player.prototype.calculate_arrow = function (point) {

        this.arrow_point.copy(point);

        var p = this.get_position();
        p.y -= 30;

        var d = Math.get_distance(p, this.arrow_point);

        var min = 0.8;
        var max = 1.2;

        d = d / 150;

        d = (d < min) ? min : d;
        d = (d > max) ? max : d;

        var angle = Math.get_angle(p, this.arrow_point);

        if (this.is_wall_drag) { // do not allow aiming up

            if (this.current_flipped) {
                var min_angle = 0;
                var max_angle = (Math.PI/4)*3;
                if (angle > min_angle && angle < max_angle) { // snap to neearest
                    angle = max_angle;
                }
            } else {
                var min_angle = Math.PI/4;
                var max_angle = Math.PI;
                if (angle > min_angle && angle < max_angle) { // snap to neearest
                    angle = min_angle;
                }
            }

        }

        // this.arrow.set_position(p.x, p.y);
        this.arrow.rotate_to(angle);
        this.arrow.set_scale_x(d);

        this.launch_angle = Math.PI + angle;
        this.launch_speed = d;
    };

    Player.prototype.on_mouse_down = function (event, object) {

        // check if is near attractor or is on ground

        for (var i = 0; i < this.attractors.length; i++) {
            var attractor = this.attractors[i];
            if (SAT.testPolygonCircle(this.bounds, attractor.sensor)) {
                this.is_attracted = true;
            }
        }


        if (this.is_on_ground || this.is_attracted || this.is_wall_drag) {

            this.arrow.is_visible = true;
            this.calculate_arrow(event.point);
            Config.slow_motion_factor = 0.05;
            this.is_ready = true;

        }

        if(this.is_on_ground || this.is_wall_drag){
            this.can_double_jump = true;
        }
        
        if(!this.is_on_ground && 
                !this.is_wall_drag && 
                this.can_double_jump && 
                !this.is_ready){
            this.velocity.y = -this.jump_speed * 0.8;
            this.can_double_jump = false;
        }


    };

    Player.prototype.on_mouse_move = function (event, object) {

        if (this.is_ready) {
            this.calculate_arrow(event.point);
        }
    };

    Player.prototype.on_mouse_up = function (event, object) {

        if (this.is_ready) {
            this.arrow.is_visible = false;
            this.calculate_arrow(event.point);

            this.set_velocity(this.launch_angle, this.launch_speed);
            Config.slow_motion_factor = 1;
        }
        
        

        this.is_ready = false;
        this.is_attracted = false;
        this.is_wall_drag = false;
    };



    Player.prototype.on_mouse_cancel = function () {


        if (this.is_ready) {
            this.set_velocity(this.launch_angle, this.launch_speed);
            Config.slow_motion_factor = 1;
            this.arrow.is_visible = false;
            this.is_wall_drag = false;
        }

        this.is_ready = false;
        this.is_attracted = false;

    };

    Player.prototype.play = function (animation_name,loop,flipped) {
        if(flipped){
            this.character.set_scale_x(-1);
        } else {
            this.character.set_scale_x(1);
        }
    };

    Player.prototype.on_note = function (note, data, sender) {
        // if (note === Notes.NOTE_NAME) {}
    };


    window.Player = Player;

}(window));