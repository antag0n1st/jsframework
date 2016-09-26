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

        // lets add some music 
        game.playlist.add(Sounds.background, 0.7);
        game.playlist.play();

        this.background = new Sprite('white');
        this.background.strech(Config.screen_width, Config.screen_height);
        this.add_child(this.background);

        // this buttons

        this.ori_button = new Button(Style.SAMPLE_BUTTON);
        this.ori_button.label.txt = lang("Ori");
        this.ori_button.set_anchor(0.5, 0.5);
        this.ori_button.set_position(Config.screen_width / 2, 300);
        this.ori_button.tag = 0;
        this.ori_button.on_mouse_up = MainScreen.prototype.on_button.bind(this);
        this.add_child(this.ori_button);


        this.gui_button = new Button(Style.SAMPLE_BUTTON);
        this.gui_button.label.txt = lang("GUI");
        this.gui_button.set_anchor(0.5, 0.5);
        this.gui_button.set_position(Config.screen_width / 2, 400);
        this.gui_button.tag = 1;
        this.gui_button.on_mouse_up = MainScreen.prototype.on_button.bind(this);
        this.add_child(this.gui_button);

        this.keyboardbutton = new Button(Style.SAMPLE_BUTTON);
        this.keyboardbutton.label.txt = lang("Keyboard");
        this.keyboardbutton.set_anchor(0.5, 0.5);
        this.keyboardbutton.set_position(Config.screen_width / 2, 500);
        this.keyboardbutton.tag = 2;
        this.keyboardbutton.on_mouse_up = MainScreen.prototype.on_button.bind(this);
        this.add_child(this.keyboardbutton);
        
        this.filters_button = new Button(Style.SAMPLE_BUTTON);
        this.filters_button.label.txt = lang("Filters");
        this.filters_button.set_anchor(0.5, 0.5);
        this.filters_button.set_position(Config.screen_width / 2, 600);
        this.filters_button.tag = 3;
        this.filters_button.on_mouse_up = MainScreen.prototype.on_button.bind(this);
        this.add_child(this.filters_button);



    };

    MainScreen.prototype.on_button = function (event, sender) {
        if (sender.tag === 0) {
            var screen = new OriScreen();
            game.navigator.add(screen, HNavigator.ANIMATION_TYPE_FADEOUT, 200);
        } else if (sender.tag === 1) {
            var screen = new GuiScreen();
            game.navigator.add(screen, HNavigator.ANIMATION_TYPE_FADEOUT, 200);
        } else if (sender.tag === 2) {
            var screen = new KeyboardScreen();
            game.navigator.add(screen, HNavigator.ANIMATION_TYPE_FADEOUT, 200);
        } else if (sender.tag === 3) {
            var screen = new FiltersScreen();
            game.navigator.add(screen, HNavigator.ANIMATION_TYPE_FADEOUT, 200);
        }
    };

    MainScreen.prototype.update = function (dt) {
        HScreen.prototype.update.call(this);

    };

    MainScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);
        game.input.add(this.ori_button);
        game.input.add(this.gui_button);
        game.input.add(this.keyboardbutton);
        game.input.add(this.filters_button);
    };

    MainScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);
        game.input.remove(this.ori_button);
        game.input.remove(this.gui_button);
        game.input.remove(this.keyboardbutton);
        game.input.remove(this.filters_button);
    };

    MainScreen.prototype.on_note = function (event_name, data, sender) {

    };

    MainScreen.prototype.on_resize = function () {

    };

    MainScreen.prototype.on_mouse_down = function (event, element) {

    };

    MainScreen.prototype.on_mouse_move = function (event, element) {

    };

    MainScreen.prototype.on_mouse_up = function (event, element) {

    };

    MainScreen.prototype.on_mouse_cancel = function (element) {

    };

    MainScreen.prototype.on_right_mouse_down = function (event) {

    };

    MainScreen.prototype.destroy = function () {

    };

    window.MainScreen = MainScreen; // make it available in the main scope

}(window));