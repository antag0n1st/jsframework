//(function(window,undefined){
    
    function TweenRotate(object,to,bezier,duration,callback){
        this.initialize(object,to,bezier,duration,callback);
    }    

    TweenRotate.prototype.initialize = function(object,to,bezier,duration,callback){        
    
        this.object = object;
        this.to = (to !== 0) ? to/Math.abs(to) : 1;
        this.bezier = bezier;
        this.duration = (duration !== undefined) ? duration : 1000;  
        this.callback = callback || function(){};       
        this.start_angle = object.angle;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenRotate.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenRotate.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenRotate.prototype.step = function(dt){
        
        this.time_passed += dt;
                
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
        this.object.rotate_to(this.start_angle + 2*Math.PI*bstep*this.to);
        
        if(s===1.0){
            
            this.object.rotate_to(this.start_angle);
            this.time_passed -= this.duration;
            s = this.time_passed / this.duration;        
            s = (s >= 1) ? 1.0 : s;
            bstep = bstep = this.bezier ? this.bezier.get(s) : s;
            this.object.rotate_to(this.start_angle + 2*Math.PI*bstep*this.to);
            this.callback(++this.ticks);
            
        }
        
    };
    
//    window.TweenRotate = TweenRotate;
//    
//}(window));