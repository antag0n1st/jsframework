//(function(window,undefined){
    
    function TweenShake(object,magnitude,bezier,duration,callback){
        this.initialize(object,magnitude,bezier,duration,callback);
    }    

    TweenShake.prototype.initialize = function(object,magnitude,frequency,bezier,duration,callback){        
    
        this.object = object;
        this.magnitude = magnitude;
        this.frequency = frequency ? frequency : 25/1000;
        this.bezier = bezier;
        this.duration = (duration !== undefined) ? duration : 1000;  
        this.callback = callback || function(){};
        this.start_point = new Vector().copy(object.position);
        this.time_passed = 0;
        this.ticks = 0;
        this.shakes = 0;
    };
    
    TweenShake.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenShake.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenShake.prototype.step = function(dt){
        
        this.time_passed += dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var f = Math.round(this.frequency*this.time_passed) - this.shakes;
        
        if(f > 0){            
            this.shakes += f;
            
            var bstep = this.bezier ? this.bezier.get(s) : 1;
        
            var angle = Math.random_int(0,360);
            var move = SAT.pool.get();
            move.setLength(this.magnitude*bstep);
            move.setAngle( Math.degrees_to_radians(angle) );

            var new_point = this.start_point.clone();
            new_point.add(move);

            this.object.set_position(new_point.x,new_point.y);
            
        }
        
        
        
        
        if(s===1.0 && this.ticks > 1){
            this.object.set_position(this.start_point.x,this.start_point.y);
            Actions.remove(this);
            this.callback();
        }
        
    };
    
//    window.TweenShake = TweenShake;
//    
//}(window));