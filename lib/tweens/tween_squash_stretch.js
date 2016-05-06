(function(window,undefined){

function TweenSquashStretch(object, scale, bezier, duration, callback) {
    this.initialize(object, scale, bezier, duration, callback);
}
TweenSquashStretch.prototype = new Tween();
TweenSquashStretch.prototype.parent_initialize = TweenSquashStretch.prototype.initialize;
TweenSquashStretch.prototype.initialize = function (object, to, bezier, duration, callback) {

    this.parent_initialize(object, to, bezier, duration, callback);

    this.duration = duration / 2;

    this.initial_duration = duration;
    this.start_scale_x = 1 - to/2;
    this.start_scale_y = 1 + to/2;
    this.time_passed = 0;
    this.ticks = 0;
};

TweenSquashStretch.prototype.step = function (dt) {

    this.time_passed = this.time_passed + dt;
    this.ticks++;

    var s = this.time_passed / this.duration;

    s = (s >= 1) ? 1.0 : s;

    var bstep = this.bezier ? this.bezier.get(s) : s;

    this.object.set_scale_x(this.start_scale_x + this.to * bstep);
    this.object.set_scale_y(this.start_scale_y - this.to * bstep);

    if (s === 1.0 && this.ticks > 1) {

        this.callback(this.ticks);
        this.time_passed -= this.duration;
        this.duration = this.initial_duration;
        this.to *= -1;
        
        this.start_scale_x = Math.round_decimal(this.object.scale.x,2);
        this.start_scale_y = Math.round_decimal(this.object.scale.y,2);

    }

};

    window.TweenSquashStretch = TweenSquashStretch;
    
}(window));