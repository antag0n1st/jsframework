(function (window, undefined) {

    function TweenPop(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }

    TweenPop.prototype = new Tween();
    TweenPop.prototype.parent_initialize = TweenPop.prototype.initialize;

    TweenPop.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parent_initialize(object, null, bezier, duration, callback);

        this.bezier = new Bezier(.35,-0.27,.49,.89);
        this.bezier2 = new Easing(Easing.EASE_OUT_ELASTIC);
        this.start_scale = object.scale.x;
        this.to = to;
        this.difference = this.start_scale - to; // we are going reverse here
        this.time_passed = 0;
        this.ticks = 0;
    };

    TweenPop.prototype.step = function (dt) {

        this.time_passed = this.time_passed + dt;
        this.ticks++;

        var s = this.time_passed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var percent = 0.2;

        if (s <= percent) {

            var ss = s / percent;
            var bstep = this.bezier.get(ss);
            // scale up
            this.object.set_scale(this.start_scale + (this.to - this.start_scale) * ss);
        } else {
            var ss = (s - percent) / 0.7;
            var bstep = this.bezier2.get(ss);
            this.object.set_scale(this.to + bstep * this.difference);
        }



        if (s === 1.0 && this.ticks > 1) {
            this.callback(this.object);
            this.stop();
        }

    };

    window.TweenPop = TweenPop;

}(window));