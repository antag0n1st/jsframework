//(function(window,undefined){
    
    function TweenBlink(object,to,bezier,duration,callback){
        this.initialize(object,to,bezier,duration,callback);
    }    
    //TweenBlink.prototype = new ParentClassName();
    //TweenBlink.prototype.parent_initialize = TweenBlink.prototype.initialize;    
    TweenBlink.prototype.initialize = function(object,to,bezier,duration,callback){        
    
        this.object = object;
        this.to = to;
        this.bezier = bezier;
        this.duration = duration;  
        this.callback = callback || function(){};     
        this.start_alpha = object.alpha;
        this.difference = to - this.start_alpha;
        this.time_passed = 0;
        this.ticks = 0;
    };
    
    TweenBlink.prototype.run = function(){
        Actions.add(this);
    };
    
    TweenBlink.prototype.stop = function(){
        Actions.remove(this);
    };
    
    TweenBlink.prototype.step = function(dt){
        
        this.time_passed += dt;
        
        var s = this.time_passed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;
        
        this.object.alpha = this.start_alpha + bstep*this.difference;
        
        if(s===1){
            this.callback(++this.ticks);
            this.time_passed -= this.duration;
            
            if(this.ticks %2 == 0){
                this.start_alpha = 1;
                this.difference = this.to - this.start_alpha;
            }else{
                this.start_alpha = this.to;
                this.difference = 1;
            }
        }
        
    };
    
//    window.TweenBlink = TweenBlink;
//    
//}(window));