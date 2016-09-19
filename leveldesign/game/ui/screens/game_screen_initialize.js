GameScreen.prototype.initialize = function () {
    this.screen_initialize();
    game.input.snap_mode = true;

    this.obsticles = [];
    this.graphics = [];
    this.queue_points = [];
    this.queue_box = null;
    this.queue_circle = null;
    this.queue_path = null;
    this.layers = [];
    this.mouse_has_moved = false;
    this.selected_image = null;
    this.selected_obsticle = null;
    this.is_shift_pressed = false;
    this.is_space_pressed = false;


    this.inspector = document.getElementById('inspector');
    this.layer_visibility = document.getElementById('visibility');
    this.layer_selector = document.getElementById('layers');
    this.name_label = document.getElementById('name');

    this.x_position_label = document.getElementById('x_position');
    this.y_position_label = document.getElementById('y_position');

    this.z_index_label = document.getElementById('z_index');
    this.c_index_label = document.getElementById('c_index');
    this.tag_label = document.getElementById('tag');
    this.type_selector = document.getElementById('type');

    this.library = document.getElementById('library');

    this.opacity_field = document.getElementById('opacity');
    this.rotation_field = document.getElementById('rotation');
    this.anchor_y_position = document.getElementById('anchor_y_position');
    this.anchor_x_position = document.getElementById('anchor_x_position');
    this.set_child_button = document.getElementById('set_child_button');

    this.width_field = document.getElementById('width_field');
    this.height_field = document.getElementById('height_field');
    this.radius_field = document.getElementById('radius_field');

    this.scale_x_field = document.getElementById('scale_x');
    this.scale_y_field = document.getElementById('scale_y');

    this.import_files = document.getElementById('import-files');
    this.export_filename = document.getElementById("export_filename");

    this.add_property_button = document.getElementById('add_property_button');

    this.properties_container = document.getElementById('properties_container');
    this.property_dialog = document.getElementById('property_dialog');
    this.property_name = document.getElementById('property_name');

    this.copy_angle_field = document.getElementById('copy_angle');
    this.copy_length_field = document.getElementById('copy_length');
    
    this.objects_list = document.getElementById('objects_list');

    this.inspector.style.height = (Config.screen_height - 13) + "px";


    //////////////////////////////////////

    // bind mouse wheel events

    this.x_position_label.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 1, 'on_x_position_change');
    });

    this.y_position_label.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 1, 'on_y_position_change');
    });

    this.opacity_field.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 0.1, 'on_opacity_change');
    });

    this.rotation_field.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 1, 'on_rotation_change');
    });

    this.anchor_y_position.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 0.1, 'on_anchor_y_position_change');
    });

    this.anchor_x_position.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 0.1, 'on_anchor_x_position_change');
    });

    this.width_field.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 1, 'on_width_change');
    });

    this.height_field.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 1, 'on_height_change');
    });

    this.radius_field.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 1, 'on_radius_change');
    });

    this.scale_x_field.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 0.1, 'on_scale_x_change');
    });

    this.scale_y_field.addEventListener("mousewheel", function (event) {
        that.on_mouse_wheel(event, 0.1, 'on_scale_y_change');
    });


    this.start_drag_point = new Vector();
    this.start_drag_screen_position = new Vector();
    this.last_move_position = new Vector();
    this.start_obsticle_position = new Vector();
    this.box_reference_point = new Vector();
    this.circle_reference_poiont = new Vector();

    this.snap_axis_mode = 0;

    var button_distance = 100;
    var button_padding = 10;

    /////////////// mode buttons

    // polygon
    this.polygon_button = new Button({image: Images.blank_black, selected_image: Images.blank_black_highlighted});
    this.polygon_button.tag = 0;
    this.polygon_button.text = "Polygon";
    this.polygon_button.text_color = "#ffffff";
    this.polygon_button.set_position(button_padding + button_distance * 0, 20);
    this.polygon_button.on_mouse_up = GameScreen.prototype.on_modes_button.bind(this);
    this.polygon_button.on_mouse_down = GameScreen.prototype.on_modes_button_down.bind(this);

    //box
    this.box_button = new Button({image: Images.blank_black, selected_image: Images.blank_black_highlighted});
    this.box_button.tag = 1;
    this.box_button.is_selected = true;
    this.box_button.text = "Box";
    this.box_button.text_color = "#ffffff";
    this.box_button.set_position(button_padding + button_distance * 1, 20);
    this.box_button.on_mouse_up = GameScreen.prototype.on_modes_button.bind(this);
    this.box_button.on_mouse_down = GameScreen.prototype.on_modes_button_down.bind(this);

    // circle
    this.circle_button = new Button({image: Images.blank_black, selected_image: Images.blank_black_highlighted});
    this.circle_button.tag = 2;
    this.circle_button.text = "Circle";
    this.circle_button.text_color = "#ffffff";
    this.circle_button.set_position(button_padding + button_distance * 2, 20);
    this.circle_button.on_mouse_up = GameScreen.prototype.on_modes_button.bind(this);
    this.circle_button.on_mouse_down = GameScreen.prototype.on_modes_button_down.bind(this);

    // point
    this.point_button = new Button({image: Images.blank_black, selected_image: Images.blank_black_highlighted});
    this.point_button.tag = 3;
    this.point_button.text = "Point";
    this.point_button.text_color = "#ffffff";
    this.point_button.set_position(button_padding + button_distance * 3, 20);
    this.point_button.on_mouse_up = GameScreen.prototype.on_modes_button.bind(this);
    this.point_button.on_mouse_down = GameScreen.prototype.on_modes_button_down.bind(this);

    // path
    this.path_button = new Button({image: Images.blank_black, selected_image: Images.blank_black_highlighted});
    this.path_button.tag = 4;
    this.path_button.text = "Path";
    this.path_button.text_color = "#ffffff";
    this.path_button.set_position(button_padding + button_distance * 4, 20);
    this.path_button.on_mouse_up = GameScreen.prototype.on_modes_button.bind(this);
    this.path_button.on_mouse_down = GameScreen.prototype.on_modes_button_down.bind(this);

    // grapics
    this.graphics_button = new Button({image: Images.blank_black, selected_image: Images.blank_black_highlighted});
    this.graphics_button.tag = 5;
    this.graphics_button.text = "Graphics";
    this.graphics_button.text_color = "#ffffff";
    this.graphics_button.set_position(button_padding + button_distance * 5, 20);
    this.graphics_button.on_mouse_up = GameScreen.prototype.on_modes_button.bind(this);
    this.graphics_button.on_mouse_down = GameScreen.prototype.on_modes_button_down.bind(this);

    ////////////////////////////////

    this.undo_button = new Button({image: Images.blank_black});
    this.undo_button.text_color = "#ffffff";
    this.undo_button.text = "Remove Last";
    this.undo_button.set_position(button_padding + button_distance * 7, 20);
    this.undo_button.on_mouse_up = GameScreen.prototype.on_undo_button.bind(this);
    this.undo_button.on_mouse_down = GameScreen.prototype.on_undo_button_down.bind(this);

    this.snap_axis_button = new Button({image: Images.blank_black});
    this.snap_axis_button.text_color = "#ffffff";
    this.snap_axis_button.text = "Free Mode";
    this.snap_axis_button.set_position(button_padding + button_distance * 8, 20);
    this.snap_axis_button.on_mouse_up = GameScreen.prototype.on_snap_axis_button.bind(this);
    this.snap_axis_button.on_mouse_down = GameScreen.prototype.on_snap_axis_button_down.bind(this);

    this.empty_project_button = new Button({image: Images.blank_black});
    this.empty_project_button.text_color = "#ffffff";
    this.empty_project_button.text = "Empty Stage";
    this.empty_project_button.set_position(button_padding, 120);
    this.empty_project_button.on_mouse_up = GameScreen.prototype.on_empty_project_button.bind(this);
    this.empty_project_button.on_mouse_down = GameScreen.prototype.on_empty_project_button_down.bind(this);

    this.save_button = new Button({image: Images.blank_black});
    this.save_button.text_color = "#ffffff";
    this.save_button.text = "Save State";
    this.save_button.set_position(button_padding, 160);
    this.save_button.on_mouse_up = GameScreen.prototype.on_save_button.bind(this);
    this.save_button.on_mouse_down = GameScreen.prototype.on_save_button_down.bind(this);


    this.mouse_position_label = new Label();
    this.mouse_position_label.set({text: "x:0  y:0", text_color: "#ffffff"});
    this.mouse_position_label.set_position(20, 60);

    this.modes = [
        States.main_states.polygon_draw,
        States.main_states.box_draw,
        States.main_states.circle_draw,
        States.main_states.point_draw,
        States.main_states.path_draw,
        States.main_states.graphics_draw
    ];

    this.mode_count = 1;
    this.current_mode = this.modes[this.mode_count % this.modes.length];

    this.layers.length = ContentManager.layers.length;
    for (var i = ContentManager.layers.length - 1; i >= 0; i--) {

        var l = ContentManager.layers[i];
        var layer = new Layer();
        layer.factor = l.factor;
        layer.name = l.name;
        layer.set_size(Config.screen_width, Config.screen_height);
        this.layers[i] = layer;
        this.add_child(layer);

        if (i === 0) {
            this.active_layer = layer;
        }
    }

    this.move_layers_to(new V(Config.screen_width / 2, Config.screen_height / 2));

    this.add_child(this.polygon_button);
    this.add_child(this.box_button);
    this.add_child(this.circle_button);
    this.add_child(this.point_button);
    this.add_child(this.path_button);
    this.add_child(this.graphics_button);

    this.add_child(this.mouse_position_label);
    this.add_child(this.undo_button);
    this.add_child(this.snap_axis_button);

    this.add_child(this.save_button);
    this.add_child(this.empty_project_button);

    input_state.subscribe('*', this);




    var that = this;

    this.kibo = new Kibo();

    this.kibo.down('space', function () {
        that.is_space_pressed = true;
        game.stage.context.canvas.style.cursor = 'pointer';
    });

    this.kibo.up('space', function () {
        that.is_space_pressed = false;
        game.stage.context.canvas.style.cursor = 'default';
    });


    this.kibo.down('shift', function () {
        that.is_shift_pressed = true;
    });

    this.kibo.up('shift', function () {
        that.is_shift_pressed = false;
    });

    this.kibo.down('right', function () {
        that.move_right();
    });

    this.kibo.down('down', function () {
        that.move_down();
    });

    this.kibo.down('left', function () {
        that.move_left();
    });

    this.kibo.down('up', function () {
        that.move_up();
    });

    this.kibo.up('m', function () {
        that.on_m();
    });

    this.kibo.down('alt a', function () {
        that.on_o();
        return false;
    });

    this.kibo.up('delete', function () {
        that.on_delete();
        that.update_objects_list();
    });

    this.kibo.down('esc', function () {
        that.on_esc();
    });

    for (var i = 0; i < ContentManager.object_types.length; i++) {

        var type = ContentManager.object_types[i];

        var opt = document.createElement('option');
        opt.value = type.name;
        opt.innerHTML = type.name;
        this.type_selector.appendChild(opt);
    }

    for (var i = 0; i < ContentManager.layers.length; i++) {

        var l = ContentManager.layers[i];

        var opt = document.createElement('option');
        opt.value = l.name;
        opt.innerHTML = l.name;
        this.layer_selector.appendChild(opt);
    }

    this.set_all_properties('none');

    input_state.set(States.main_states.box_draw);



///////////////////// LIBRARY //////////////////////////

// try to read from the last state

    // load from the library
    var that = this;
    setTimeout(function () {
        ajax_get('load_library.php', function (data) {
            that.list_files(data);
        });
    }, 100);

    var saved_data = localStorage.getItem("level_editor_auto_save");
    if (saved_data) {
        saved_data = JSON.parse(saved_data);
        if (saved_data.length >= 1) {
            var data = saved_data[saved_data.length - 1];

            setTimeout(function () {
                that.import(JSON.stringify(data));
            }, 1000);

        }
    } else {

    }


/////////////////// READ IMPORT FILES /////////////////////

    ajax_get('import_files.php', function (data) {
        // set options
             
        for (var i = 0; i < data.length; i++) {
            var op = data[i];
            var html = "<option value='"+op.url+"' selected='unselected'>" + op.name + ".json" + "</option>";
            that.import_files.innerHTML += html;
        }
        
        that.import_files.selectedIndex = -1;
    });


///////////////// START AUTO SAVE /////////////////////////////

    window.setInterval(function () {
        that.save_current_data();
    }, 1000 * 30); // save every 30 seconds


};