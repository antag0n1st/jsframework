//(function(window,undefined){
    
    function TweenRotateTo(object,to,bezier,duration,callback){
        this.initialize(object,to,bezier,duration,callback);
    }    

    TweenRotateTo.prototype.initialize = function(object,to,bezier,duration,callback){        
    
        this.object = object;
        this.to = to;
        this.bezier = bezier;
        this.duration = (duration !== undefined) ? duration : 1000;  
        this.callback = callback || function(){};       
        this.start_angle = object.angle;
        this.diffrenece = to - object.angle;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenRotateTo.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenRotateTo.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenRotateTo.prototype.step = function(dt){
        
        this.time_passed += dt;
        this.ticks++;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
        this.object.rotate_to(this.start_angle + bstep*this.diffrenece);
        
        if(s===1.0 && this.ticks > 1){
            Actions.remove(this);
            this.callback();
        }
        
    };
    
//    window.TweenRotateTo = TweenRotateTo;
//    
//}(window));