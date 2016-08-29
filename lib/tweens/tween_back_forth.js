(function (window, undefined) {

    function TweenBackForth(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }
    TweenBackForth.prototype = new Tween();
    TweenBackForth.prototype.parent_initialize = TweenBackForth.prototype.initialize;
    TweenBackForth.prototype.initialize = function (object, to, bezier, duration, callback) {


        this.parent_initialize(object, to, bezier, duration, callback);
        this.half = new V().copy(to).scale(0.5);
        this.begin = new V().copy(object.get_position());
        this.dir = true;
    };

    TweenBackForth.prototype.step = function (dt) {


        this.time_passed += dt;

        var s = this.time_passed / this.duration;

        s = (s >= 1) ? 1.0 : s;
        var bs = this.bezier ? this.bezier.get(s) : s;
        
        var p = SAT.pool.get();

        if (s < 0.25) {
            
            p.copy(this.half);            
            p.scale(s/0.25);
            p = V.addition(this.begin , p);
            
        } else  if (s < 0.5) { 
            p.copy(this.half);   
            p.reverse();            
            p.scale((s - 0.25)/0.25);
            p = V.addition(this.begin , p);
            p.add(this.half);
        } else  if (s < 0.75)  {
            p.copy(this.half);   
            p.reverse();
            p.scale((s - 0.5)/0.25);
            p = V.addition(this.begin , p);
        } else {
            p.copy(this.half);
            p.scale((s - 0.75)/0.25);
            p = V.addition(this.begin , p);
            p.sub(this.half);
        }

        this.object.set_position(p.x, p.y);

        this.last_step = bs;

        if (this.time_passed > this.duration) {
            this.dir = !this.dir;
            this.time_passed = 0;
            this.last_step = 0;
        }

    };

    window.TweenBackForth = TweenBackForth;

}(window));