(function(window,undefined){
    
    function Timer(object,callback,duration){
        this.initialize(object,callback,duration);
    }    
    Timer.prototype = new Tween();
    Timer.prototype.parent_initialize = Timer.prototype.initialize;    
    Timer.prototype.initialize = function(object,callback,duration){        
        this.parent_initialize(object,null,null,duration,callback);        
    };
    
    Timer.prototype.step = function(dt){
        
        this.time_passed = this.time_passed + dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        if(s===1.0 && this.ticks > 1){
            this.callback(this.object);
            this.stop();
        }
        
    };
    
    window.Timer = Timer;
    
}(window));