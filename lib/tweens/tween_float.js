//(function(window,undefined){

function TweenFloat(object, magnitude, bezier, duration, callback) {
    this.initialize(object, magnitude, bezier, duration, callback);
}
TweenFloat.prototype = new Tween();
TweenFloat.prototype.parent_initialize = TweenFloat.prototype.initialize;
TweenFloat.prototype.initialize = function (object, magnitude, bezier, duration, callback) {


    this.parent_initialize(object, null, bezier, duration, callback);

    this.magnitude = magnitude;
    this.last_step = 0;
    this.current_magnitude = 0;
    this.time_passed = 0;
    this.dir = true;
};

TweenFloat.prototype.step = function (dt) {


    this.time_passed += dt;

    var s = this.time_passed / this.duration;

    s = (s >= 1) ? 1.0 : s;
    var bs = this.bezier ? this.bezier.get(s) : s;

    var p = this.object.get_position();
    if (this.dir) {
        p.add(new V(0, this.magnitude * (this.last_step - bs)));
    } else {
        p.sub(new V(0, this.magnitude * (this.last_step - bs)));
    }

    this.object.set_position(p.x, p.y);

    this.last_step = bs;

    if (this.time_passed > this.duration) {
        this.dir = !this.dir;
        this.time_passed = 0;
        this.last_step = 0;
    }

};

//    window.TweenFloat = TweenFloat;
//    
//}(window));