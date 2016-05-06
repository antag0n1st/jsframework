(function(window,undefined){

function TweenRotateTo(object, to, bezier, duration, callback) {
    this.initialize(object, to, bezier, duration, callback);
}

TweenRotateTo.prototype = new Tween();
TweenRotateTo.prototype.parent_initialize = TweenRotateTo.prototype.initialize;

TweenRotateTo.prototype.initialize = function (object, to, bezier, duration, callback) {

    this.parent_initialize(object, null, bezier, duration, callback);

    this.start_angle = object.rotation;
    this.diffrenece = to - object.rotation;
    this.time_passed = 0;
    this.ticks = 0;
};

TweenRotateTo.prototype.step = function (dt) {

    this.time_passed += dt;
    this.ticks++;

    var s = this.time_passed / this.duration;

    s = (s >= 1) ? 1.0 : s;

    var bstep = this.bezier ? this.bezier.get(s) : s;

    this.object.rotate_to(this.start_angle + bstep * this.diffrenece);

    if (s === 1.0 && this.ticks > 1) {        
        this.callback(this.object);
        this.stop();
    }

};

    window.TweenRotateTo = TweenRotateTo;
    
}(window));