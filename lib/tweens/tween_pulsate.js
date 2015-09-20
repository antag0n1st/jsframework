//(function(window,undefined){
    
    function TweenPulsate(object,scale,bezier,duration,callback){
        this.initialize(object,scale,bezier,duration,callback);
    }    
    TweenPulsate.prototype = new Tween();
    TweenPulsate.prototype.parent_initialize = TweenPulsate.prototype.initialize;    
    TweenPulsate.prototype.initialize = function(object,scale,bezier,duration,callback){        
    
        this.parent_initialize(object, to, bezier, duration, callback);
        
        this.duration = duration/2; 
        
        this.initial_duration = duration;      
        this.start_scale = object.scale_x;
        this.difference = scale;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenPulsate.prototype.step = function(dt){
        
        this.time_passed = this.time_passed + dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
        this.object.set_scale(this.start_scale + bstep*this.difference);
        
        if(s===1.0 && this.ticks > 1){
           
            this.callback(this.ticks);
            this.time_passed -= this.duration;
            this.duration = this.initial_duration;
            this.difference = this.to*2 * ( this.difference *-1 / Math.abs(this.difference) );
            this.start_scale = this.object.scale_x;
            
        }
        
    };
    
//    window.TweenPulsate = TweenPulsate;
//    
//}(window));