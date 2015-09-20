//(function(window,undefined){
    
    function GameScreen(){
        this.initialize();
    }    
    
    GameScreen.prototype = new HScreen();
    GameScreen.prototype.screen_initialize = GameScreen.prototype.initialize;    
    GameScreen.prototype.initialize = function(){        
        this.screen_initialize();
        
    };
    
    GameScreen.prototype.show = function(){
        HScreen.prototype.show.call(this);
        
    };
    
    GameScreen.prototype.hide = function(){
        HScreen.prototype.hide.call(this);
        
    };
    
    GameScreen.prototype.update = function(){
        HScreen.prototype.update.call(this);
        
    };
    
    GameScreen.prototype.on_added_to_parent = function(parent){
        HScreen.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    GameScreen.prototype.on_remove_from_parent = function(parent){
        HScreen.prototype.on_remove_from_parent.call(this,parent);
        
    };   
    
    
//    window.GameScreen = GameScreen;
    
//}(window));