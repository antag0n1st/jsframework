//(function(window,undefined){

function TweenTime(to, bezier, duration, callback) {
    this.initialize(to, bezier, duration, callback);
}

TweenTime.prototype = new Tween();
TweenTime.prototype.parent_initialize = TweenTime.prototype.initialize;

TweenTime.prototype.initialize = function (to, bezier, duration, callback) {

    this.parent_initialize(null, null, bezier, duration, callback);

    this.start_value = Config.slow_motion_factor;
    this.difference = to - this.start_value;
    this.time_passed = 0;
    this.ticks = 0;
};

TweenTime.prototype.step = function (dt) {

    this.time_passed = this.time_passed + Ticker.step;
    this.ticks++;

    var s = this.time_passed / this.duration;

    s = (s >= 1) ? 1.0 : s;

    var bstep = this.bezier ? this.bezier.get(s) : s;


    Config.slow_motion_factor = this.start_value + bstep * this.difference;

    if (s === 1.0 && this.ticks > 1) {
        Actions.remove(this);
        this.callback(this.object);
    }

};

//    window.TweenTime = TweenTime;
//    
//}(window));