//(function(window,undefined){
    
    function TweenRotateBy(object,by,bezier,duration,callback){
        this.initialize(object,by,bezier,duration,callback);
    }    

    TweenRotateBy.prototype.initialize = function(object,by,bezier,duration,callback){        
    
        this.object = object;
        this.by = by;
        this.bezier = bezier;
        this.duration = (duration !== undefined) ? duration : 1000;  
        this.callback = callback || function(){};       
        this.start_angle = object.angle;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenRotateBy.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenRotateBy.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenRotateBy.prototype.step = function(dt){
        
        this.time_passed += dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
        this.object.rotate_to(this.start_angle + bstep*this.by);
        
        if(s===1.0 && this.ticks > 1){
            Actions.remove(this);
            this.callback();
        }
        
    };
    
//    window.TweenRotateBy = TweenRotateBy;
//    
//}(window));