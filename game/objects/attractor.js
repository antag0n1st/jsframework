(function (window, undefined) {

    function Attractor(name) {
        this.initialize(name);
    }

    Attractor.prototype = new Sprite();
    Attractor.prototype.sprite_initialize = Attractor.prototype.initialize;
    Attractor.TYPE = UID.numbering();
    Attractor.prototype.initialize = function (name) {

        this.sensor = new SAT.Circle(new V(), 100);

        this.sprite_initialize(); // your image name
        this.set_anchor(0.5, 0.5);
        this.TYPE = Attractor.TYPE;

        this.back1 = new Sprite('attractor');
        this.back1.set_anchor(0.5, 0.5);
        this.add_child(this.back1);

        this.back2 = new Sprite('attractor2');
        this.back2.set_anchor(0.5, 0.5);
        this.add_child(this.back2);

        this.looper = new Looper([
            {name: 'rotate1', duration: 4000},
            {name: 'rotate2', duration: 4000}
        ]);
        
        this.looper2 = new Looper([
            {name: 'alpha1', duration: 1000},
            {name: 'alpha2', duration: 1000}
        ]);


    };

    Attractor.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this, parent);

    };

    Attractor.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this, parent);

    };

    Attractor.prototype.set_position = function (x, y) {
        Sprite.prototype.set_position.call(this, x, y);
        this.sensor.pos.x = x;
        this.sensor.pos.y = y;
    };

    Attractor.prototype.update = function (dt) {
        Sprite.prototype.update.call(this, dt);

        this.looper.update(dt);
        this.looper2.update(dt);

        var event = this.looper.get();
        var pr = event.percent;
        
        var event2 = this.looper2.get();
        var pr2 = event2.percent;
        
        var min = 0.4;
        var max = 0.5;
        
        var d1 = min + max*pr2;
        var d2 = min + (max - max*pr2);
        
        var a1 = pr * 2 * Math.PI;
        var a2 = (1 - pr) * 2 * Math.PI;
        
        if (event2.name === 'alpha1') {

            this.back1.set_alpha(d1);
            this.back2.set_alpha(d2);

        } else if (event2.name === 'alpha2') {

            this.back2.set_alpha(d1);
            this.back1.set_alpha(d2);
        }

        if (event.name === 'rotate1') {

            this.back1.rotate_to(a1)
            this.back2.rotate_to(a2);

        } else if (event.name === 'rotate2') {
            this.back1.rotate_to(a1)
            this.back2.rotate_to(a2);
        }


    };

    Attractor.prototype.on_note = function (note, data, sender) {
        // if (note === Notes.NOTE_NAME) {}
    };


    window.Attractor = Attractor;

}(window));