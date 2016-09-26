(function (window, undefined) {

    function KeyboardScreen() {
        this.initialize();
    }

    KeyboardScreen.prototype = new HScreen();
    KeyboardScreen.prototype.screen_initialize = KeyboardScreen.prototype.initialize;
    KeyboardScreen.TYPE = UID.numbering();

    KeyboardScreen.prototype.initialize = function () {

        this.screen_initialize();
        this.TYPE = KeyboardScreen.TYPE;

        this.content = new Layer();
        this.add_child(this.content);

        this.button = new Button(Style.SAMPLE_BUTTON);
        this.button.label.txt = lang("Go Back");
        this.button.tag = 0;
        this.button.on_mouse_up = function () {
            game.navigator.go_back();
        };
        this.button.set_position(30, 50);
        this.content.add_child(this.button);

        this.keyboard = new Keyboard(Keyboard.HORIZONTAL);
        this.add_child(this.keyboard); // ADD this out of the content

        this.text_label = new InputLabel(Style.SAMPLE_LABEL, this.keyboard);
        this.text_label.set_position(Config.screen_width / 2, 300);
        this.text_label.set_placeholder('Input label , click it !');
        this.text_label.on_focus = KeyboardScreen.prototype.on_focus.bind(this);
        this.text_label.on_blur = KeyboardScreen.prototype.on_blur.bind(this);
        this.content.add_child(this.text_label);

    };

    KeyboardScreen.prototype.on_focus = function (label) {
        if (game.device.is_touch) {
            var to = new V(0, -100);
            var t = new TweenMoveTo(this.content, to, null, 200);
            t.run();
        }
    };

    KeyboardScreen.prototype.on_blur = function (label) {
       if (game.device.is_touch) {
            var to = new V(0,0);
            var t = new TweenMoveTo(this.content, to, null, 200);
            t.run();
        };
    };

    KeyboardScreen.prototype.update = function (dt) {
        HScreen.prototype.update.call(this);

    };

    KeyboardScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);

        game.input.add(this);
        game.input.add(this.button);
        game.input.add(this.text_label);
    };

    KeyboardScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);

        game.input.remove(this);
        game.input.remove(this.button);
        game.input.remove(this.text_label);

        this.text_label.blur();
        this.keyboard.hide();
    };

    KeyboardScreen.prototype.on_note = function (event_name, data, sender) {

    };

    KeyboardScreen.prototype.on_resize = function () {

    };

    KeyboardScreen.prototype.on_mouse_up = function (event, element) {
        this.text_label.blur();
    };

    KeyboardScreen.prototype.on_mouse_cancel = function (element) {
        this.text_label.blur();
    };


    KeyboardScreen.prototype.destroy = function () {

    };

    window.KeyboardScreen = KeyboardScreen; // make it available in the main scope

}(window));