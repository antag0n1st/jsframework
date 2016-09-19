(function (window, undefined) {

    function FiltersScreen() {
        this.initialize();
    }

    FiltersScreen.prototype = new HScreen();
    FiltersScreen.prototype.screen_initialize = FiltersScreen.prototype.initialize;
    FiltersScreen.TYPE = UID.numbering();

    FiltersScreen.prototype.initialize = function () {
        this.screen_initialize();
        this.TYPE = FiltersScreen.TYPE;


        var s = new Sprite('magical_forest');
        s.set_anchor(0.5,0.5);
        s.set_position(Config.screen_width/2,Config.screen_height/2);
        this.add_child(s);


        this.shock = new PIXI.filters.ShockwaveFilter();
        
        this.shock.center = [0.5,0.25];
        this.shock.params = [10, 0.1, 0.05]; // [10, 0.8, 0.1]

        s.filters = [this.shock];

        this.looper = new Looper([
            {name: 'start', duration: 3000}
        ]);
                

    };

    FiltersScreen.prototype.update = function (dt) {
        HScreen.prototype.update.call(this);

        this.looper.update(dt);

        var event = this.looper.get();

        if (event.name === 'start') {
            this.shock.time = event.percent;
        }

    };

    FiltersScreen.prototype.show = function () {
        HScreen.prototype.show.call(this);

    };

    FiltersScreen.prototype.hide = function () {
        HScreen.prototype.hide.call(this);

    };

    FiltersScreen.prototype.on_note = function (event_name, data, sender) {

    };

    FiltersScreen.prototype.on_resize = function () {

    };

    FiltersScreen.prototype.on_mouse_down = function (event, element) {

    };

    FiltersScreen.prototype.on_mouse_move = function (event, element) {

    };

    FiltersScreen.prototype.on_mouse_up = function (event, element) {

    };

    FiltersScreen.prototype.on_mouse_cancel = function (element) {

    };

    FiltersScreen.prototype.on_right_mouse_down = function (event) {

    };

    FiltersScreen.prototype.destroy = function () {

    };

    window.FiltersScreen = FiltersScreen; // make it available in the main scope

}(window));