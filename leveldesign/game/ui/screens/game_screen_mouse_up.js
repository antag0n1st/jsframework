GameScreen.prototype.on_mouse_up = function (event) {
   
    if(!this.active_layer.is_visible){ // do not interact with invisible layers
        Popup.show("layer is invisible",this);
        return;
    }

    event.point.x = Math.round(event.point.x);
    event.point.y = Math.round(event.point.y);

    var p = this.active_layer.get_position();
    var pp = new Vector(event.point.x, event.point.y);
    pp.sub(p);


    if (input_state.get() === States.main_states.polygon_draw && !this.is_space_pressed) {


        // determine the snap acording the last point
        if (this.queue_points.length > 0) {
            var last = this.queue_points[this.queue_points.length - 1];
            if (this.snap_axis_mode === 1) {
                pp.y = last.y;
            } else if (this.snap_axis_mode === 2) {
                pp.x = last.x;
            }
        }

        this.queue_points.push(pp);



    } else if (input_state.get() === States.main_states.box_draw && !this.is_space_pressed) {

        if (this.queue_box !== null && !this.selected_obsticle) {
            
            var p = this.queue_box.get_position();
            p.x = Math.round(p.x);
            p.y = Math.round(p.y);
            this.queue_box.set_position(p.x,p.y);
            
            this.obsticles.push(this.queue_box);
            this.queue_box = null;
            this.selected_obsticle = null;
            
            this.update_objects_list();

        }

    }


    if (!this.is_space_pressed && !this.selected_image &&
            (input_state.get() === States.main_states.polygon_draw ||
                    input_state.get() === States.main_states.box_draw ||
                    input_state.get() === States.main_states.circle_draw ||
                    input_state.get() === States.main_states.point_draw ||
                    input_state.get() === States.main_states.path_draw ||
                    input_state.get() === States.main_states.graphics_draw
            )) {



        // check if we are selecting existing polugon
        // but first deselect all of them
        for (var i = 0; i < this.obsticles.length; i++) {
            if (this.obsticles[i].is_selected) {
                this.obsticles[i].is_selected = false;
                this.selected_obsticle = null;
                this.end_polygon(); // it will remove the previous point added
                this.update_inspector_with_obsticle(null);
            }
        }
        
        this.deselect_graphics();

       

        if (this.queue_points.length < 2 && !this.mouse_has_moved && this.queue_path === null) {
         
            var collided = this.is_point_in_obsticles(event.point);
            if (collided) {
                collided.is_selected = true;
                this.start_obsticle_position = new Vector(collided.get_position().x, collided.get_position().y);
                this.selected_obsticle = collided;

                this.update_inspector_with_obsticle(collided);

                this.end_polygon(); // it will remove the previous point added


            }

        }
    }

    if (!this.is_space_pressed && input_state.get() === States.main_states.circle_draw) {

        if (this.queue_circle !== null && !this.selected_obsticle) {
            
            this.queue_circle.bounds.r = Math.round(this.queue_circle.bounds.r);
            var p = this.queue_circle.get_position();
            p.x = Math.round(p.x);
            p.y = Math.round(p.y);
            this.queue_circle.set_position(p.x,p.y);
            this.queue_circle.inner_type = "Circle";
            this.obsticles.push(this.queue_circle);
            this.queue_circle = null;
            this.selected_obsticle = null;
            this.update_objects_list();
        }
    }

    if (input_state.get() === States.main_states.point_draw && !this.is_space_pressed) {

        var collided = this.is_point_in_obsticles(event.point);

        if (collided) {

        } else {
            var p = this.active_layer.get_position();
            var pp = new Vector(event.point.x, event.point.y);
            pp.sub(p);

            var obsticle = new Obsticle();
            var bb = new Circle(new V().copy(pp), 10);
            obsticle.bounds = bb;
            obsticle.normal_color = 'yellow';
            obsticle.inner_type = "Point";
            bb.pos.x = Math.round(bb.pos.x);
            bb.pos.y = Math.round(bb.pos.y);
            obsticle.set_position(bb.pos.x, bb.pos.y);
            this.obsticles.push(obsticle);
            this.active_layer.add_child(obsticle);
            obsticle.layer_name = this.active_layer.name;
            obsticle.layer = this.active_layer;
            this.update_objects_list();
        }



    }

    if (input_state.get() === States.main_states.path_draw && !this.is_space_pressed) {


        if (!this.selected_obsticle && !this.mouse_has_moved) {
            var p = this.active_layer.get_position();
            var pp = new Vector(event.point.x, event.point.y);
            pp.sub(p);

            if (this.queue_path === null) {
                this.queue_path = new Path();
                this.queue_path.add_point(pp);
                this.active_layer.add_child(this.queue_path);
                this.queue_path.layer_name = this.active_layer.name;
                this.queue_path.layer = this.active_layer;
            } else {
                this.queue_path.add_point(pp);
            }
        }
    }

    if (input_state.get() === States.main_states.set_parent) {

        var collided = this.is_point_in_obsticles(event.point);
        if (collided) {
            collided.remove_from_parent();
            this.selected_obsticle.add_child(collided);
            if (collided instanceof Path) {
                var p = this.selected_obsticle.get_position();
                collided.set_position(p.x * -1, p.y * -1);
            } else {
                collided.set_position(0, 0);
            }
            
            // remove from obsticles
            
            var index = this.obsticles.indexOf(collided);
            if(index >=0 ){
                this.obsticles.splice(index,1);
            }
            
            input_state.go_to_previus_state();
            
            Popup.show("element is now child",this);
            
            
        }
    }
    
    if (input_state.get() === States.main_states.graphics_draw && !this.is_space_pressed ) {
        
        if(this.selected_image && !this.selected_obsticle){            
            var p = this.active_layer.get_position();
            var sprite = new Graphic(this.selected_image.image_name);
            var pos = this.selected_image.get_position();
            var pp = pos.clone().sub(p);
            pp.x = Math.round(pp.x);
            pp.y = Math.round(pp.y);
            sprite.set_position(pp.x,pp.y);            
            this.active_layer.add_child(sprite);
            sprite.layer_name = this.active_layer.name;
            sprite.layer = this.active_layer;
            this.obsticles.push(sprite);
            this.graphics.push(sprite);
            this.update_objects_list();
        }else{
            

        }
    }
    
   this.update_inspector_with_obsticle(this.selected_obsticle);

    this.mouse_has_moved = false;
    
    this.is_mouse_down = false;
};