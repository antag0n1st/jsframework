(function(window,undefined){
    
    function TweenScaleY(object,to,bezier,duration,callback){
        this.initialize(object,to,bezier,duration,callback);
    }
    
    TweenScaleY.prototype = new Tween();
    TweenScaleY.prototype.parent_initialize = TweenScaleY.prototype.initialize;   
    
    TweenScaleY.prototype.initialize = function(object,to,bezier,duration,callback){        
    
        this.parent_initialize(object, null, bezier, duration, callback);
        
        this.start_scale = object.scale.y;
        this.difference = to - this.start_scale;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenScaleY.prototype.step = function(dt){
        
        this.time_passed = this.time_passed + dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
         this.object.set_scale_y(this.start_scale + bstep*this.difference);
        
        if(s===1.0 && this.ticks > 1){
            this.callback(this.object);
            this.stop();
        }
        
    };
    
    window.TweenScaleY = TweenScaleY;
    
}(window));