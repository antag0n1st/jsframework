(function (window, undefined) {

    function MainScreen() {
        this.initialize();
    }

    MainScreen.prototype = new HScreen();
    MainScreen.prototype.screen_initialize = MainScreen.prototype.initialize;
    MainScreen.TYPE = UID.numbering();
    MainScreen.prototype.initialize = function () {
        this.screen_initialize();
        this.TYPE = MainScreen.TYPE;



        this.background = new Sprite('magical_forest');
        this.background.set_position(-300, -300);
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
        platform3.set_position(50,100);
        this.add_child(platform3); 
        
        var platform4 = new SolidPlatform('wall');
        platform4.set_position(1000,100);
        this.add_child(platform4); 

        var attractor = new Attractor();
        attractor.set_position(600, 190);
        this.add_child(attractor);

        this.player.platforms.push(platform)
        this.player.platforms.push(platform2);
        this.player.platforms.push(platform3);
        this.player.platforms.push(platform4);
        this.player.attractors.push(attractor);

        

//        this.arrow_point = new V();
//        
//        this.attraction_timeout = 0;
//
//        this.launch_angle = 0;
//        this.launch_speed = 0;

        this.sensor = new SAT.Box(new V(-Config.screen_width / 2, Config.screen_height), Config.screen_width * 2, 500).toPolygon();

    };
    
    MainScreen.prototype.on_note = function (event_name, data, sender) {
        
    };
   

    MainScreen.prototype.on_mouse_down = function (event, object) {
        this.player.on_mouse_down(event, object);
    };

    MainScreen.prototype.on_mouse_move = function (event, object) {
        this.player.on_mouse_move(event, object);
    };

    MainScreen.prototype.on_mouse_up = function (event, object) {
        this.player.on_mouse_up(event, object);
    };

    MainScreen.prototype.on_mouse_cancel = function () {
        this.player.on_mouse_cancel();
    };

    MainScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);
        game.input.add(this);
        
        Notes.add(this, Notes.CHARACTER_LANDED);
    };

    MainScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);
        game.input.remove(this);
        Notes.remove(this, Notes.CHARACTER_LANDED);
    };

    MainScreen.prototype.update = function () {
        HScreen.prototype.update.call(this);

        if (SAT.testPolygonPolygon(this.sensor, this.player.bounds)) {
            this.player.set_position(400, 300);
            this.player.velocity.x = 0;
            this.player.velocity.y = 0;
        }

    };

    MainScreen.prototype.on_added_to_parent = function (parent) {
        HScreen.prototype.on_added_to_parent.call(this, parent);

    };

    MainScreen.prototype.on_remove_from_parent = function (parent) {
        HScreen.prototype.on_remove_from_parent.call(this, parent);

    };

    window.MainScreen = MainScreen;

}(window));