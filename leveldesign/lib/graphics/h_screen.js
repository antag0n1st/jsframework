(function(window, undefined) {

    function HScreen() {
        this.initialize();
    }
    
    HScreen.prototype = new Drawable();
    HScreen.prototype.drawable_initialize = HScreen.prototype.initialize;

    HScreen.prototype.initialize = function() {
        this.drawable_initialize();
        this.set_size(Config.screen_width,Config.screen_height );
    };


    HScreen.prototype.show = function() {        
        game.stage.add(this);
    };

    HScreen.prototype.hide = function() {
        this.remove_from_parent();
    };
        
    HScreen.prototype.draw = function(context){
        
        this._alpha = context.globalAlpha;
        
        if (this.alpha !== 1) {
            context.globalAlpha = context.globalAlpha*this.alpha;
        }
        
        
    };
    
    HScreen.prototype.on_resize = function(){};
    
    HScreen.prototype.on_draw_finished = function(context) {    
        context.globalAlpha = this._alpha;    
    };

    HScreen.prototype.clear = function(context){};

    HScreen.prototype.update = function(dt) {};    
    
    HScreen.prototype.update_children = function(children) {

//        if (parent.is_children_sortable) {
//            this.sort_objects(children);
//        }

        var i = children.length;
        var step = Ticker.step*Config.slow_motion_factor;
        while (i--) {
            var child = children[i];
            child.update(step);
            this.update_children(child.get_children());
        }


    };

    window.HScreen = HScreen;

}(window));