GameScreen.prototype.on_right_mouse_down = function (event) {

    if (!this.active_layer.is_visible) { // do not interact with invisible layers
        return;
    }

    if (this.is_space_pressed) {

        this.start_drag_point = new Vector(event.point.x, event.point.y);

        this.start_drag_screen_position = new Vector(this.active_layer.get_position().x, this.active_layer.get_position().y);
        this.last_move_position = new Vector(this.start_drag_point.x, this.start_drag_point.y);

    }
    
    


    this.deselect_images();
    this.deselect_graphics();

    this.update_inspector_with_obsticle();
    
    

};

GameScreen.prototype.on_right_mouse_move = function (event) {


    if (!this.active_layer.is_visible) { // do not interact with invisible layers
        return;
    }

    this.mouse_has_moved = true;
    event.point.x = Math.round(event.point.x);
    event.point.y = Math.round(event.point.y);

    if (this.is_space_pressed) {

        if (!game.input.snap_mode) {
            alert("Can't move the screen position in Free Mode");
            return;
        }

        var scale_factor = 20.0;

        var v = new V(event.point.x, event.point.y);
        v.sub(this.start_drag_point.clone());
        v.scale(scale_factor, scale_factor);
        var p = this.start_drag_screen_position.clone().add(v);

        this.move_layers_to(p);


        if (this.queue_points.length > 0) {

            // lets move some points

            var v = new V(event.point.x, event.point.y);
            v.sub(this.last_move_position.clone());

            this.last_move_position = new V(event.point.x, event.point.y);

        }

    }

};
