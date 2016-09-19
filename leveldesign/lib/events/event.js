//(function(window,undefined){
    
    function Event(){
        this.initialize();
    }    
    //Event.prototype = new ParentClassName();
    //Event.prototype.parent_initialize = Event.prototype.initialize;    
    Event.prototype.initialize = function(){        
       // this.parent_initialize();
       this.propagate = true;
       this.point = {x:0,y:0};
    };
    
    Event.prototype.stop_propagation = function(){
        this.propagate = false;
    };
        
//    window.Event = Event;
//    
//}(window));