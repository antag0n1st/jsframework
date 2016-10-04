(function (window, undefined) {

    function Fake3dScreen() {
        this.initialize();
    }

    Fake3dScreen.prototype = new HScreen();
    Fake3dScreen.prototype.screen_initialize = Fake3dScreen.prototype.initialize;
    Fake3dScreen.TYPE = UID.numbering();

    Fake3dScreen.prototype.initialize = function () {
        this.screen_initialize();
        this.TYPE = Fake3dScreen.TYPE;

        this.button = new Button(Style.SAMPLE_BUTTON);
        this.button.label.txt = lang("Go Back");
        this.button.tag = 0;
        this.button.on_mouse_up = function () {
            game.navigator.go_back();
        };
        this.button.set_position(30, 50);
        this.add_child(this.button);


        this.fl_button_increase = new Button(Style.SAMPLE_BUTTON);
        this.fl_button_increase.label.txt = lang("+ 20");
        this.fl_button_increase.on_mouse_up = function () {
            for (var i = 0; i < 20; i++) {
                timeout(function () {
                    game.navigator.current_screen.fl += 1;
                }, 30 * i);
            }
        };
        this.fl_button_increase.set_position(30, 200);
        this.add_child(this.fl_button_increase);


        this.fl_button_decrease = new Button(Style.SAMPLE_BUTTON);
        this.fl_button_decrease.label.txt = lang("- 20");
        this.fl_button_decrease.on_mouse_up = function () {
            for (var i = 0; i < 20; i++) {
                timeout(function () {
                    game.navigator.current_screen.fl -= 1;
                }, 30 * i);
            }
        };
        this.fl_button_decrease.set_position(30, 280);
        this.add_child(this.fl_button_decrease);


        ///////// fake 3D

        this.content = new Layer();
        this.content.set_position(Config.screen_width / 2, Config.screen_height / 2);
        this.add_child(this.content);

        this.fl = 100; // fokal length



        this.objects = [];

        for (var i = 0; i < 100; i++) {

            var x = Math.random_int(-800, 800);
            var y = Math.random_int(-600, 600);
            var z = Math.random_int(0, 2000);

            var object = new Sprite('player');
            var pos3D = object.pos3D = {x: x, y: y, z: z};

            var perspective = this.fl / (this.fl + pos3D.z);

            object.set_position(pos3D.x * perspective, pos3D.y * perspective);
            object.set_scale(perspective);

            this.content.add_child(object);
            this.objects.push(object);

        }



    };

    Fake3dScreen.prototype.update = function (dt) {
        HScreen.prototype.update.call(this);
        
        //
        
        var center_x =Config.screen_width/2;
        var center_y = Config.screen_height/2;
        
       var dx = center_x - game.input.point.x;
       var dy = center_y - game.input.point.y;
       
       //this.content.set_position(center_x+dx*0.2,center_y+dy*0.2);


        for (var i = 0; i < this.objects.length; i++) {


            var object = this.objects[i];
            var pos3D = object.pos3D;
            

            var perspective = this.fl / (this.fl + pos3D.z);
            var factor = 0.4;

            object.set_position((pos3D.x + dx*factor) * perspective , (pos3D.y + dy*factor) * perspective);
            object.set_scale(perspective);

            object.pos3D.z -= dt * 0.3;

            if (object.pos3D.z < 0) {
                object.pos3D.z = 2000;
            }

        }

    };

    Fake3dScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);
        game.input.add(this.button);
        game.input.add(this.fl_button_increase);
        game.input.add(this.fl_button_decrease);
    };

    Fake3dScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);
        game.input.remove(this.button);
        game.input.remove(this.fl_button_increase);
        game.input.remove(this.fl_button_decrease);
    };

    Fake3dScreen.prototype.on_note = function (event_name, data, sender) {

    };

    Fake3dScreen.prototype.on_resize = function () {

    };

    Fake3dScreen.prototype.on_mouse_down = function (event, element) {

    };

    Fake3dScreen.prototype.on_mouse_move = function (event, element) {

    };

    Fake3dScreen.prototype.on_mouse_up = function (event, element) {

    };

    Fake3dScreen.prototype.on_mouse_cancel = function (element) {

    };

    Fake3dScreen.prototype.on_right_mouse_down = function (event) {

    };

    Fake3dScreen.prototype.destroy = function () {

    };

    window.Fake3dScreen = Fake3dScreen; // make it available in the main scope

}(window));