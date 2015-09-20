//(function(window,undefined){

function TweenRotate(object, to, bezier, duration, callback) {
    this.initialize(object, to, bezier, duration, callback);
}

TweenRotate.prototype = new Tween();
TweenRotate.prototype.parent_initialize = TweenRotate.prototype.initialize;

TweenRotate.prototype.initialize = function (object, to, bezier, duration, callback) {

    this.parent_initialize(object, to, bezier, duration, callback);

    this.start_angle = object.rotation;
    this.time_passed = 0;
    this.ticks = 0;
};

TweenRotate.prototype.step = function (dt) {

    this.time_passed += dt;

    var s = this.time_passed / this.duration;

    s = (s >= 1) ? 1.0 : s;

    var bstep = this.bezier ? this.bezier.get(s) : s;

    this.object.rotate_to(this.start_angle + 2 * Math.PI * bstep * this.to);
   

    if (s === 1.0) {

        this.object.rotate_to(this.start_angle);
        this.time_passed -= this.duration;
        s = this.time_passed / this.duration;
        s = (s >= 1) ? 1.0 : s;
        bstep = bstep = this.bezier ? this.bezier.get(s) : s;
        this.object.rotate_to(this.start_angle + 2 * Math.PI * bstep * this.to);
       
        this.callback(++this.ticks);

    }

};

//    window.TweenRotate = TweenRotate;
//    
//}(window));