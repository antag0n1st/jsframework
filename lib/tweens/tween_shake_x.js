(function(window,undefined){
    
    function TweenShakeX(object,magnitude,frequency,bezier,duration,callback){
        this.initialize(object,magnitude,frequency,bezier,duration,callback);
    }    
    
    TweenShakeX.prototype = new Tween();
    TweenShakeX.prototype.parent_initialize = TweenShakeX.prototype.initialize;

    TweenShakeX.prototype.initialize = function(object,magnitude,frequency,bezier,duration,callback){        
    
        this.parent_initialize(object, null, bezier, duration, callback);
    
        this.magnitude = magnitude;
        this.frequency = frequency ? frequency : 25/1000;
     
        this.start_point = new Vector().copy(object.position);
        this.time_passed = 0;
        this.ticks = 0;
        this.shakes = 0;
        this.is_left = false;
    };
    
    TweenShakeX.prototype.step = function(dt){
        
        this.time_passed += dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var f = Math.round(this.frequency*this.time_passed) - this.shakes;
        
        if(f > 0){            
            this.shakes += f;
            
            var bstep = this.bezier ? this.bezier.get(s) : 1;
            var angle = 180;
            if(this.is_left){
                angle = -180;
            } 
            this.is_left = !this.is_left;            
            
            var move = SAT.pool.get();
            move.setLength(this.magnitude*bstep);
            move.setAngle( Math.degrees_to_radians(angle) );

            var new_point = this.start_point.clone();
            new_point.add(move);

            this.object.set_position(new_point.x,new_point.y);
            
        }
        
        if(s===1.0 && this.ticks > 1){
            this.object.set_position(this.start_point.x,this.start_point.y);
            this.callback(this.object);
            this.stop();
        }
        
    };
    
    window.TweenShakeX = TweenShakeX;
    
}(window));