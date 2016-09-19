(function (window, undefined) {

    function GameScreen() {
        this.initialize();
    }

    GameScreen.prototype = new Screen();
    GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;


    GameScreen.prototype.on_state = function (prev_state, current_state, data) {
        if (current_state.name !== States.main_states.set_parent) {
            this.deselect_all();
        }

    };

    GameScreen.prototype.deselect_buttons = function () {

        this.polygon_button.is_selected = false;
        this.box_button.is_selected = false;
        this.circle_button.is_selected = false;
        this.point_button.is_selected = false;
        this.path_button.is_selected = false;
        this.graphics_button.is_selected = false;

    };

    GameScreen.prototype.on_modes_button = function (event, element) {

        this.deselect_buttons(); // deselect the others
        element.is_selected = true;

        if (element.tag === 0) {
            input_state.set(States.main_states.polygon_draw);
        } else if (element.tag === 1) {
            input_state.set(States.main_states.box_draw);
        } else if (element.tag === 2) {
            input_state.set(States.main_states.circle_draw);
        } else if (element.tag === 3) {
            input_state.set(States.main_states.point_draw);
        } else if (element.tag === 4) {
            input_state.set(States.main_states.path_draw);
        } else if (element.tag === 5) {
            input_state.set(States.main_states.graphics_draw);
        }

        if (this.selected_obsticle) {
            this.selected_obsticle.is_selected = false;
            this.selected_obsticle = null;
        }

        this.update_inspector_with_obsticle();

    };



    GameScreen.prototype.on_undo_button = function (event) {

        if (this.queue_points.length > 0) {
            this.queue_points.splice(this.queue_points.length - 1, 1);
        } else {

            if (this.obsticles.length > 0) {
                var obsticle = this.obsticles[this.obsticles.length - 1];
                obsticle.remove_from_parent();
                this.obsticles.splice(this.obsticles.length - 1, 1);
            }

        }

    };


    GameScreen.prototype.on_snap_axis_button = function (event) {

        this.snap_axis_mode++;

        this.snap_axis_mode = this.snap_axis_mode % 3;

        if (this.snap_axis_mode === 0) {
            this.snap_axis_button.text = 'Free';
        } else if (this.snap_axis_mode === 1) {
            this.snap_axis_button.text = 'Snap X';
        } else if (this.snap_axis_mode === 2) {
            this.snap_axis_button.text = 'Snap Y';
        }

    };
    GameScreen.prototype.on_empty_project_button = function (event) {

        if (confirm('Are you sure you want clear this project ?')) {
            this.clear_project();
        } else {

        }

        event.stop_propagation();
    };

    GameScreen.prototype.on_empty_project_button_down = function (event) {
        event.stop_propagation();
    };


    GameScreen.prototype.on_save_button = function (event) {
        this.save_current_data();
        Popup.show("Data Saved", this);
        event.stop_propagation();
    };

    GameScreen.prototype.on_save_button_down = function (event) {
        event.stop_propagation();
    };



    GameScreen.prototype.on_snap_axis_button_down = function (event) {
        event.stop_propagation();
    };

    GameScreen.prototype.on_undo_button_down = function (event) {
        event.stop_propagation();
    };

    GameScreen.prototype.on_modes_button_down = function (event) {
        event.stop_propagation();
    };

    GameScreen.prototype.is_point_in_obsticles = function (point) {

        for (var i = this.obsticles.length - 1; i >= 0; i--) {

            var obsticle = this.obsticles[i];

            for (var j = obsticle.children.length - 1; j >= 0; j--) {

                var obs = obsticle.children[j];
                if (obs.check(point)) {
                    if (obs.layer_name === this.active_layer.name) {
                        return obs;
                    }
                }
            }

            if (obsticle.check(point)) {
                if (obsticle.layer_name === this.active_layer.name) {
                    return obsticle;
                }
            }





        }
        return false;

    };



    GameScreen.prototype.remove_obsticle = function (obsticle) {

        var index = this.obsticles.indexOf(obsticle);
        if (index !== -1) {
            this.obsticles.splice(index, 1);
        }

        if (obsticle instanceof Graphic) {
            var index = this.graphics.indexOf(obsticle);
            if (index !== -1) {
                this.graphics.splice(index, 1);
            }
        }

    };

    GameScreen.prototype.order_z_index = function (a, b) {
        return a.z_index > b.z_index;
    };

    GameScreen.prototype.update = function () {

        Math.insertionSort(this.obsticles, this.order_z_index);

        var p = this.active_layer.get_position();
        p.scale(this.active_layer.factor, this.active_layer.factor);
        var m = new Vector(game.input.point.x, game.input.point.y);
        m.sub(p);
        this.mouse_position_label.set({text: "x: " + Math.round_decimal(m.x, 2) + "  y: " + Math.round_decimal(m.y, 2)});

        if (input_state.get() === States.main_states.graphics_draw && this.selected_image) {
            var w = this.selected_image.width;
            var h = this.selected_image.height;
            this.selected_image.set_position(game.input.point.x - w / 2, game.input.point.y - h / 2);
        }

    };

    GameScreen.prototype.draw = function (context) {

        context.fillStyle = "#094837";
        context.fillRect(0, 0, Config.screen_width, Config.screen_height);

        Screen.prototype.draw.call(this, context);

        this.draw_path_last_point(context);
    };

    GameScreen.prototype.draw_path_last_point = function (context) {

        if (this.queue_path !== null) {

            var p = this.active_layer.bounds.pos.clone();
            var new_point = new V(game.input.point.x, game.input.point.y);

            var last_point = this.queue_path.points[this.queue_path.points.length - 1].clone();
            last_point.add(p);

            //////////////////

            if (this.snap_axis_mode === 0) {

            } else if (this.snap_axis_mode === 1) {
                // snap x
                new_point = new V(game.input.point.x, last_point.y);

            } else if (this.snap_axis_mode === 2) {
                // snap y
                new_point = new V(last_point.x, game.input.point.y);

            }

            this.queue_path.buffer_point = new_point.clone().sub(p);

            context.beginPath();
            context.moveTo(last_point.x, last_point.y);
            context.lineTo(new_point.x, new_point.y);
            context.closePath();
            context.stroke();
        }

    };

    GameScreen.prototype.on_draw_finished = function (context) {
        Screen.prototype.on_draw_finished.call(this, context);

        this.draw_queue(context);

        var strokeStyle = context.strokeStyle;
        var lineWidth = context.lineWidth;

        context.lineWidth = 1;
        context.strokeStyle = 'white';

        context.beginPath();

        var p = this.active_layer.bounds.pos.clone();

        context.moveTo(p.x + 0, p.y - this.height);
        context.lineTo(p.x + 0, p.y + this.height);

        context.moveTo(p.x - this.width, p.y);
        context.lineTo(p.x + this.width, p.y);

        context.stroke();
        context.closePath();

        context.strokeStyle = strokeStyle;

        context.lineWidth = lineWidth;
    };



    GameScreen.prototype.draw_queue = function (context) {

        context.fillStyle = '#f00';
        context.beginPath();
        var alpha = context.globalAlpha;

        context.globalAlpha = 0.3;

        var p = this.active_layer.get_position();

        var first = true;
        for (var ind in this.queue_points) {

            var c = this.queue_points[ind].clone();
            c.add(p);

            if (first) {
                first = false;
                context.moveTo(c.x, c.y);
            } else {
                context.lineTo(c.x, c.y);
            }
        }


        if (this.queue_points.length > 0 && !this.is_space_pressed) {

            var last = this.queue_points[this.queue_points.length - 1].clone();
            last.add(p);

            if (this.snap_axis_mode === 0) {
                context.lineTo(game.input.point.x, game.input.point.y);

                if (this.queue_path !== null) {
                    this.queue_path.buffer_point = new V(game.input.point.x, game.input.point.y);
                }

            } else if (this.snap_axis_mode === 1) {
                context.lineTo(game.input.point.x, last.y);
                if (this.queue_path !== null) {
                    this.queue_path.buffer_point = new V(game.input.point.x, last.y);
                }
            } else if (this.snap_axis_mode === 2) {
                context.lineTo(last.x, game.input.point.y);
                if (this.queue_path !== null) {
                    this.queue_path.buffer_point = new V(last.x, game.input.point.y);
                }
            }


        }

        context.closePath();

        context.fill();
        context.stroke();

        context.globalAlpha = alpha;

    };

    GameScreen.prototype.move_layers_to = function (point) {

        var pp = point.clone();

        var d = this.active_layer.factor;

        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            var f = layer.factor / d;
            layer.set_position(pp.x * f, pp.y * f);
        }

    };

    GameScreen.prototype.show = function () {
        Screen.prototype.show.call(this);
        game.input.add(this);
        game.input.add(this.polygon_button);
        game.input.add(this.box_button);
        game.input.add(this.circle_button);
        game.input.add(this.point_button);
        game.input.add(this.path_button);
        game.input.add(this.graphics_button);

        game.input.add(this.undo_button);
        game.input.add(this.snap_axis_button);

        game.input.add(this.empty_project_button);
        game.input.add(this.save_button);

    };

    GameScreen.prototype.hide = function () {
        Screen.prototype.hide.call(this);
    };

    GameScreen.prototype.end_polygon = function () {
        // create polygon 
        if (this.queue_points.length > 2) {

            var o = this.queue_points;
            var polygon_vectors = [];
            var first_vector;
            for (var j = 0; j < o.length; j++) {
                var v = o[j];
                var current_vector = new Vector(v.x, v.y);
                if (j === 0) {
                    first_vector = new Vector(v.x, v.y);
                }
                polygon_vectors.push(current_vector.sub(first_vector));
            }
            var cv = new Polygon(new Vector(0, 0), polygon_vectors);
            cv.pos = first_vector.sub(this.get_position());
            cv.recalc();

            var obsticle = new Obsticle();
            obsticle.bounds = cv;
            obsticle.set_position(cv.pos.x, cv.pos.y);

            // check if it is counter clockwise

            var sum = 0.0;
            for (var i = 0; i < obsticle.bounds.points.length; i++) {
                var v1 = obsticle.bounds.points[i];
                var v2 = obsticle.bounds.points[(i + 1) % obsticle.bounds.points.length];
                sum += (v2.x - v1.x) * (v2.y + v1.y);
            }

            if (sum < 0) {

                var p = obsticle.get_position();
                p.x = Math.round(p.x);
                p.y = Math.round(p.y);
                obsticle.set_position(p.x, p.y);

                this.obsticles.push(obsticle);
                this.active_layer.add_child(obsticle);
                obsticle.layer_name = this.active_layer.name;
                obsticle.layer = this.active_layer;

            } else {
                alert("polygon points must be defined clockwise");
            }

        }
        this.queue_points = [];
        return false;
    };

    GameScreen.prototype.deselect_graphics = function () {

        for (var i = 0; i < this.graphics.length; i++) {
            var g = this.graphics[i];
            if (g.is_selected) {
                g.is_selected = false;
                g.alpha = 1;
            }
        }
        if (this.selected_obsticle) {
            this.selected_obsticle.is_selected = false;
            this.selected_obsticle = null;
        }

    };

    GameScreen.prototype.move_up = function () {
        if (this.selected_obsticle) {
            var p = this.selected_obsticle.get_position();
            p.y -= 1;
            this.selected_obsticle.set_position(p.x, p.y);
        }
        this.update_inspector_with_obsticle(this.selected_obsticle);
    };

    GameScreen.prototype.move_down = function () {
        if (this.selected_obsticle) {
            var p = this.selected_obsticle.get_position();
            p.y += 1;
            this.selected_obsticle.set_position(p.x, p.y);
        }
        this.update_inspector_with_obsticle(this.selected_obsticle);
    };

    GameScreen.prototype.move_left = function () {
        if (this.selected_obsticle) {
            var p = this.selected_obsticle.get_position();
            p.x -= 1;
            this.selected_obsticle.set_position(p.x, p.y);
        }
        this.update_inspector_with_obsticle(this.selected_obsticle);
    };

    GameScreen.prototype.move_right = function () {
        if (this.selected_obsticle) {
            var p = this.selected_obsticle.get_position();
            p.x += 1;
            this.selected_obsticle.set_position(p.x, p.y);
        }
        this.update_inspector_with_obsticle(this.selected_obsticle);
    };

    GameScreen.prototype.on_esc = function () {
        this.deselect_all();
    };

    GameScreen.prototype.deselect_all = function () {
        this.end_polygon();
        this.deselect_images();
        this.deselect_graphics();
        this.update_inspector_with_obsticle();
    };

    GameScreen.prototype.on_m = function () {
        this.on_snap_axis_button();
    };
    
    GameScreen.prototype.on_o = function () {
        if(this.selected_obsticle){
            this.selected_obsticle.set_anchor(0.5,0.5);
            this.update_inspector_with_obsticle(this.selected_obsticle);
        }
    };

    GameScreen.prototype.on_delete = function () {

        this.end_polygon();

        if (this.queue_path !== null) {
            this.obsticles.push(this.queue_path);
            this.queue_path = null;
        }

        if (this.selected_obsticle) {
            this.selected_obsticle.is_selected = false;
            this.remove_obsticle(this.selected_obsticle);
            this.selected_obsticle.remove_from_parent();
            this.selected_obsticle = null;
        }

    };

    window.GameScreen = GameScreen;

}(window));