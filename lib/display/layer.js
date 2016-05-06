(function(window,undefined){
    
    function Layer(){
        this.initialize();
    }    
    Layer.prototype = new Sprite();
    Layer.TYPE = UID.numbering();
    Layer.prototype.sprite_initialize = Layer.prototype.initialize;    
    
    Layer.prototype.initialize = function(){        
        this.sprite_initialize();
        this.TYPE = Layer.TYPE;
    };
    
    window.Layer = Layer;
    
}(window));