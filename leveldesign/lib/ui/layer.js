(function(window,undefined){
    
    function Layer(){
        this.initialize();
    }    
    Layer.prototype = new Drawable();
    Layer.prototype.drawable_initialize = Layer.prototype.initialize;    
    
    Layer.prototype.initialize = function(){        
        this.drawable_initialize();
        
    };
    
    Layer.prototype.draw = function(context){};
    Layer.prototype.clear = function(context){};
    
    window.Layer = Layer;
    
}(window));