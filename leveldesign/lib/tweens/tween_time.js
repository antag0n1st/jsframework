//(function(window,undefined){
    
    function TweenTime(to,bezier,duration,callback){
        this.initialize(to,bezier,duration,callback);
    }    
    //TweenTime.prototype = new ParentClassName();
    //TweenTime.prototype.parent_initialize = TweenTime.prototype.initialize;    
    TweenTime.prototype.initialize = function(to,bezier,duration,callback){        
    
        
        this.to = to;
        this.bezier = bezier;
        this.duration = duration;  
        this.callback = callback || function(){};       
        this.start_value = Config.slow_motion_factor;
        this.difference = to - this.start_value;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenTime.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenTime.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenTime.prototype.step = function(dt){
        
        this.time_passed = this.time_passed + Ticker.step;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
       
        Config.slow_motion_factor = this.start_value + bstep*this.difference;
        
        if(s===1.0 && this.ticks > 1){
            Actions.remove(this);
            this.callback();
        }
        
    };
    
//    window.TweenTime = TweenTime;
//    
//}(window));