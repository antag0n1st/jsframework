(function (window, undefined) {

    function TweenBlink(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }
    TweenBlink.prototype = new Tween();
    TweenBlink.prototype.parent_initialize = TweenBlink.prototype.initialize;
    TweenBlink.prototype.initialize = function (object, to, bezier, duration, callback) {

        bezier = bezier ? bezier : new Bezier(.26, .66, .32, 1.01);

        this.parent_initialize(object, to, bezier, duration, callback);

        this._original_alpha = object.alpha;
        this.start_alpha = object.alpha;
        this.difference = to - this.start_alpha;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenBlink.prototype.stop = function(){
        Tween.prototype.stop.call(this);
        this.object.alpha = this._original_alpha;
    };

    TweenBlink.prototype.step = function (dt) {

        this.time_passed += dt;

        var s = this.time_passed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;

        this.object.alpha = this.start_alpha + bstep * this.difference;

        if (s === 1) {
            this.callback(++this.ticks);
            this.time_passed -= this.duration;

            if (this.ticks % 2 === 0) {
                this.start_alpha = this._original_alpha;
                this.difference = this.to - this._original_alpha;
            } else {
                this.start_alpha = this.to;
                this.difference = this._original_alpha - this.to;
            }
        }

    };

    window.TweenBlink = TweenBlink;

}(window));