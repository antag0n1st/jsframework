//(function(window,undefined){
    
    function TweenScale(object,to,bezier,duration,callback){
        this.initialize(object,to,bezier,duration,callback);
    }
    
    TweenScale.prototype = new Tween();
    TweenScale.prototype.parent_initialize = TweenScale.prototype.initialize;   
    
    TweenScale.prototype.initialize = function(object,to,bezier,duration,callback){        
    
        this.parent_initialize(object, null, bezier, duration, callback);
        
        this.start_scale = object.scale_x;
        this.difference = to - this.start_scale;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenScale.prototype.step = function(dt){
        
        this.time_passed = this.time_passed + dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
         this.object.set_scale(this.start_scale + bstep*this.difference);
        
        if(s===1.0 && this.ticks > 1){
            Actions.remove(this);
            this.callback(this.object);
        }
        
    };
    
//    window.TweenScale = TweenScale;
//    
//}(window));