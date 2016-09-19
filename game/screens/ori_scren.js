(function (window, undefined) {

    function OriScreen() {
        this.initialize();
    }

    OriScreen.prototype = new HScreen();
    OriScreen.prototype.screen_initialize = OriScreen.prototype.initialize;
    OriScreen.TYPE = UID.numbering();
    OriScreen.prototype.initialize = function () {
        this.screen_initialize();
        this.TYPE = OriScreen.TYPE;

        this.background = new Sprite('magical_forest');
        this.background.set_anchor(0.5, 0.5);
        this.background.set_position(Config.screen_width / 2, Config.screen_height / 2);
        this.add_child(this.background);

        this.player = new Player();
        this.player.set_position(400, 300);
        this.add_child(this.player);

        var platform = new SolidPlatform('platform');
        platform.set_position(200, 400);
        this.add_child(platform);

        var platform2 = new SolidPlatform('platform');
        platform2.set_position(900, 400);
        this.add_child(platform2);

        var platform3 = new SolidPlatform('wall');
        platform3.set_position(50, 100);
        this.add_child(platform3);

        var platform4 = new SolidPlatform('wall');
        platform4.set_position(1000, 100);
        this.add_child(platform4);

        var attractor = new Attractor();
        attractor.set_position(600, 190);
        this.add_child(attractor);

        this.player.platforms.push(platform)
        this.player.platforms.push(platform2);
        this.player.platforms.push(platform3);
        this.player.platforms.push(platform4);
        this.player.attractors.push(attractor);
        
        this.back_button = new Button(Style.SAMPLE_BUTTON);
        this.back_button.label.txt = lang("Go Back");
        this.back_button.tag = 0;
        this.back_button.on_mouse_down = function(event,sender){
          event.stop_propagation();  
        };
        this.back_button.on_mouse_up = function(){
            game.navigator.go_back();
        };
        this.back_button.set_position(30,50);
        this.add_child(this.back_button);


        this.sensor = new SAT.Box(new V(-Config.screen_width / 2, Config.screen_height), Config.screen_width * 2, 500).toPolygon();

    };

    OriScreen.prototype.on_note = function (event_name, data, sender) {

    };


    OriScreen.prototype.on_mouse_down = function (event, object) {

        this.player.on_mouse_down(event, object);
    };

    OriScreen.prototype.on_mouse_move = function (event, object) {
        this.player.on_mouse_move(event, object);
    };

    OriScreen.prototype.on_mouse_up = function (event, object) {
        this.player.on_mouse_up(event, object);
    };

    OriScreen.prototype.on_mouse_cancel = function () {
        this.player.on_mouse_cancel();
    };

    OriScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);
        game.input.add(this);
        game.input.add(this.back_button);
        Notes.add(this, Notes.CHARACTER_LANDED);
        
    };

    OriScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);
        game.input.remove(this);
        game.input.remove(this.back_button);
        Notes.remove(this, Notes.CHARACTER_LANDED);
    };

    OriScreen.prototype.update = function () {
        HScreen.prototype.update.call(this);

        if (SAT.testPolygonPolygon(this.sensor, this.player.bounds)) {
            this.player.set_position(400, 300);
            this.player.velocity.x = 0;
            this.player.velocity.y = 0;
        }

    };

    OriScreen.prototype.on_added_to_parent = function (parent) {
        HScreen.prototype.on_added_to_parent.call(this, parent);

    };

    OriScreen.prototype.on_remove_from_parent = function (parent) {
        HScreen.prototype.on_remove_from_parent.call(this, parent);

    };

    window.OriScreen = OriScreen;

}(window));