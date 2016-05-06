(function(window,undefined){

function TweenRotateBy(object, by, bezier, duration, callback) {
    this.initialize(object, by, bezier, duration, callback);
}

TweenRotateBy.prototype = new Tween();
TweenRotateBy.prototype.parent_initialize = TweenRotateBy.prototype.initialize;

TweenRotateBy.prototype.initialize = function (object, by, bezier, duration, callback) {

    this.parent_initialize(object, null, bezier, duration, callback);
    this.by = by;

    this.start_angle = object.rotation;
    this.time_passed = 0;
    this.ticks = 0;
};


TweenRotateBy.prototype.step = function (dt) {

    this.time_passed += dt;
    this.ticks++;

    var s = this.time_passed / this.duration;

    s = (s >= 1) ? 1.0 : s;

    var bstep = this.bezier ? this.bezier.get(s) : s;

    this.object.rotate_to(this.start_angle + bstep * this.by);

    if (s === 1.0 && this.ticks > 1) {        
        this.callback(this.object);
        this.stop();
    }

};

    window.TweenRotateBy = TweenRotateBy;
    
}(window));