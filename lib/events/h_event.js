(function(window,undefined){
    
    function HEvent(){
        this.initialize();
    }    
    //HEvent.prototype = new ParentClassName();
    //HEvent.prototype.parent_initialize = HEvent.prototype.initialize;    
    HEvent.prototype.initialize = function(){        
       // this.parent_initialize();
       this.propagate = true;
       this.point = new V();
    };
    
    HEvent.prototype.stop_propagation = function(){
        this.propagate = false;
    };
        
    window.HEvent = HEvent;
    
}(window));