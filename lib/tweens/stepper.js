(function(window,undefined){
    
    function Stepper(object,step_callback,duration,callback){
        this.initialize(object,step_callback,duration,callback);
    }    
    Stepper.prototype = new Tween();
    Stepper.prototype.parent_initialize = Stepper.prototype.initialize;    
    Stepper.prototype.initialize = function(object,step_callback,duration,callback){        
        this.parent_initialize(object,null,null,duration,callback);  
        this.step_callback = step_callback;
    };
    
    Stepper.prototype.step = function(dt){
        
        this.time_passed = this.time_passed + dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        if(s===1.0 && this.ticks > 1){
            this.callback(this.object);
            this.stop();
        } else {
            this.step_callback(s,this.object,dt);
        }
        
    };
    
    window.Stepper = Stepper;
    
}(window));