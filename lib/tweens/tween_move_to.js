(function(window,undefined){

function TweenMoveTo(object, to, bezier, duration, callback) {
    this.initialize(object, to, bezier, duration, callback);
}
TweenMoveTo.prototype = new Tween();
TweenMoveTo.prototype.parent_initialize = TweenMoveTo.prototype.initialize;
TweenMoveTo.prototype.initialize = function (object, to, bezier, duration, callback) {

    this.parent_initialize(object, to, bezier, duration, callback);
    
    var p = object.get_position();

    this.start_position = new Vector(p.x, p.y);

    this.distance_x = to.x - p.x;
    this.distance_y = to.y - p.y;

    this.time_passed = 0;
};

TweenMoveTo.prototype.step = function (dt) {

    this.time_passed += dt;

    var s = this.time_passed / this.duration;

    s = (s >= 1) ? 1.0 : s;

    var bstep = this.bezier ? this.bezier.get(s) : s;

    this.object.set_position(this.start_position.x + this.distance_x * bstep, this.start_position.y + this.distance_y * bstep);

    if (s === 1) {
        this.callback(this.object);
        this.stop();
    }

};

    window.TweenMoveTo = TweenMoveTo;
    
}(window));