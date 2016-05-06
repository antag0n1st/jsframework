(function (window, undefined) {

    function Keyboard() {
        this.initialize();
    }

    Keyboard.prototype = new Sprite();
    Keyboard.prototype.sprite_initialize = Keyboard.prototype.initialize;
    Keyboard.TYPE = UID.numbering();
    Keyboard.prototype.initialize = function () {
        this.sprite_initialize(); // your image name
        this.TYPE = Keyboard.TYPE;

        this.priority = 99;
        this.is_visible = false;

        this.character_rows = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm']
        ];

        this.digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        this.number_of_rows = this.character_rows.length + 2;

        this.basic_size = Math.floor(Config.screen_width / 10);

        this.buttons = [];

        this.is_capital = false;

        this.background_setup();
        this.vertical_setup();
        this.position_setup();

        this.stream = '';

        this.preview = new Button();
        this.preview.image_normal = 'preview_key';
        this.preview.label.font_size = 40;
        this.preview.label.font_color = '#bbbbbb';
        this.preview.is_visible = false;
        this.add_child(this.preview);

    };

    Keyboard.prototype.background_setup = function () {
        this.backgorund = new DrawingLayer();
        this.add_child(this.backgorund);

        this.backgorund.beginFill(0x111111, 1);
        this.backgorund.drawRect(0, 0, Config.screen_width, this.basic_size * this.number_of_rows);
        this.backgorund.endFill();
    };

    Keyboard.prototype.vertical_setup = function () {

        for (var i = 0; i < this.digits.length; i++) {
            var digit = this.digits[i];
            var button = this.create_button(digit);
            button.set_position(i * this.basic_size, 0);
            this.add_child(button);
            this.buttons.push(button);
        }

        for (var j = 0; j < this.character_rows.length; j++) {
            var characters = this.character_rows[j];

            var x_offset = 0;

            if (characters.length < 10) {
                x_offset = (Config.screen_width - characters.length * this.basic_size) / 2;
            }

            for (var i = 0; i < characters.length; i++) {
                var character = characters[i];
                var button = this.create_button(character);

                button.set_position(i * this.basic_size + x_offset, this.basic_size + this.basic_size * j);
                this.add_child(button);
                this.buttons.push(button);
            }
        }

        var space = this.create_button('space');
        space.image_normal = 'space';
        space.set_position(Config.screen_width / 2, this.basic_size * (this.number_of_rows - 1) + this.basic_size / 2);
        space.set_anchor(0.5, 0.5);
        space.label.txt = '';
        space.is_special = true;
        this.add_child(space);
        this.buttons.push(space);

        var backspace = this.create_button('backspace');
        backspace.image_normal = 'backspace';
        backspace.set_position(Config.screen_width - this.basic_size / 2 - 8, this.basic_size * (this.number_of_rows - 1) + this.basic_size / 2);
        backspace.set_anchor(0.5, 0.5);
        backspace.label.txt = '';
        backspace.is_special = true;
        this.add_child(backspace);
        this.buttons.push(backspace);

        var capitalize = this.create_button('capitalize');
        capitalize.image_normal = 'capitalize';
        capitalize.set_position(this.basic_size / 2 + 8, this.basic_size * (this.number_of_rows - 1) + this.basic_size / 2);
        capitalize.set_anchor(0.5, 0.5);
        capitalize.label.txt = '';
        capitalize.is_special = true;
        this.add_child(capitalize);
        this.buttons.push(capitalize);

    };

    Keyboard.prototype.create_button = function (symbol) {
        var button = new Button();
        button.symbol = symbol;
        button.set_size(this.basic_size, this.basic_size);
        button.label.txt = symbol;
        button.label.font_color = '#bbbbbb';
        button.label.font_size = 30;
        button.priority = 100;
        button.on_mouse_up = Keyboard.prototype.key_mouse_up.bind(this);
        button.on_mouse_down = Keyboard.prototype.key_mouse_down.bind(this);
        button.on_mouse_cancel = Keyboard.prototype.key_mouse_cancel.bind(this);
        button.is_special = false;
        return button;
    };

    Keyboard.prototype.on_change = function (stream) {

    };

    Keyboard.prototype.on_type = function (letter, stream) {

    };

    Keyboard.prototype.on_backspace = function (stream) {

    };

    Keyboard.prototype.key_mouse_cancel = function () {
        this.preview.is_visible = false;
    };

    Keyboard.prototype.key_mouse_down = function (event, object) {
        event.stop_propagation();

        if (!object.is_special) {

            this.preview.is_visible = true;
            var p = object.get_position();
            this.preview.label.txt = object.symbol;
            this.preview.set_position(p.x - this.preview.width / 2 + object.__width / 2, p.y - this.preview.height - 5);

        }
    };

    Keyboard.prototype.key_mouse_up = function (event, object) {
        event.stop_propagation();

        if (object.symbol === 'capitalize') {
            this.is_capital = !this.is_capital;
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                if (!button.is_special) {
                    if (this.is_capital) {
                        //                   
                        var capital = button.label.txt.toString().charAt(0).toUpperCase();
                        button.label.txt = capital;
                        button.symbol = capital;
                    } else {
                        var lower = button.label.txt.toString().charAt(0).toLowerCase();
                        button.label.txt = lower;
                        button.symbol = lower;
                    }
                }
            }
        }

        if (object.is_special) {
            if (object.symbol === 'backspace') {
                this.stream = this.stream.slice(0, -1);
                this.on_backspace(this.stream);
                this.on_change(this.stream);
            } else if (object.symbol === 'space') {
                this.stream += ' ';
                this.on_type(' ', this.stream);
                this.on_change(this.stream);
            }
        } else {
            this.stream += object.symbol;
            this.on_type(object.symbol, this.stream);
            this.on_change(this.stream);
        }

        this.preview.is_visible = false;

    };

    Keyboard.prototype.position_setup = function () {
        var y = Config.screen_height - this.basic_size * this.number_of_rows;
        this.set_position(0, y);
    };

    Keyboard.prototype.show = function () {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            game.input.add(button);
        }
        game.input.add(this);
        this.is_visible = true;
    };

    Keyboard.prototype.hide = function () {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            game.input.remove(button);
        }
        game.input.remove(this);
        this.is_visible = false;
    };

    Keyboard.prototype.on_mouse_down = function (event, object) {
        event.stop_propagation();
    };

    Keyboard.prototype.on_mouse_up = function (event, object) {
        event.stop_propagation();
    };

    Keyboard.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this, parent);
    };

    Keyboard.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this, parent);
    };

    Keyboard.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);
    };

    Keyboard.prototype.on_note = function (note, data, sender) {

    };


    window.Keyboard = Keyboard;

}(window));