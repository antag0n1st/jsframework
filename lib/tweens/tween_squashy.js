(function (window, undefined) {

    function TweenSquashy(object, scale, bezier, duration, callback) {
        this.initialize(object, scale, bezier, duration, callback);
    }
    TweenSquashy.prototype = new Tween();
    TweenSquashy.prototype.parent_initialize = TweenSquashy.prototype.initialize;
    TweenSquashy.prototype.initialize = function (object, to, bezier, duration, callback) {

        bezier = bezier ? bezier : new Bezier(.34,-0.14,.48,.98); // set a default bezier

        this.parent_initialize(object, to, bezier, duration, callback);

        this.duration = duration;
        this.initial_duration = duration;
        this.start_scale_x = object.scale.x;
        this.start_scale_y = object.scale.y;
        this.time_passed = 0;
        this.ticks = 0;
    };

    TweenSquashy.prototype.step = function (dt) {

        this.time_passed = this.time_passed + dt;
        this.ticks++;

        var s = this.time_passed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;
        
        var ds = bstep - s; // strech for the difference of the variation of the curve

        this.object.set_scale_x(this.start_scale_x + this.to * ds);
        this.object.set_scale_y(this.start_scale_y - this.to * ds);

        if (s === 1) {
            this.callback(this.object);
            this.stop();
        }

    };

    window.TweenSquashy = TweenSquashy;

}(window));