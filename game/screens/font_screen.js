(function (window, undefined) {

    function FontScreen() {
        this.initialize();
    }

    FontScreen.prototype = new HScreen();
    FontScreen.prototype.screen_initialize = FontScreen.prototype.initialize;
    FontScreen.TYPE = UID.numbering();

    FontScreen.prototype.initialize = function () {
        this.screen_initialize();
        this.TYPE = FontScreen.TYPE;
        
        this.background = new Sprite('white');
        this.background.tint = 0x333333;
        this.background.strech(Config.screen_width,Config.screen_height);
        this.add_child(this.background);
        
        
        label = new BitmapLabel(Style.BITMAP_LABEL);
//        label.font_size = 35;
//        label.font_name = 'Half Bold Pixel-7';
        label.txt = "0098645 HI";
        
        label.set_position(200,200);
        this.add_child(label);
        
    };

    FontScreen.prototype.update = function (dt) {
        HScreen.prototype.update.call(this);

    };

    FontScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);

    };

    FontScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);

    };

    FontScreen.prototype.on_note = function (event_name, data, sender) {

    };

    FontScreen.prototype.on_resize = function () {

    };

    FontScreen.prototype.on_mouse_down = function (event, element) {

    };

    FontScreen.prototype.on_mouse_move = function (event, element) {

    };

    FontScreen.prototype.on_mouse_up = function (event, element) {

    };

    FontScreen.prototype.on_mouse_cancel = function (element) {

    };

    FontScreen.prototype.on_right_mouse_down = function (event) {

    };

    FontScreen.prototype.destroy = function () {

    };

    window.FontScreen = FontScreen; // make it available in the main scope

}(window));