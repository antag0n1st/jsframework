(function (window, undefined) {

    function Obsticle() {
        this.initialize();
    }

    Obsticle.prototype = new Sprite();
    Obsticle.prototype.sprite_initialize = Obsticle.prototype.initialize;
    Obsticle.prototype.initialize = function () {

        this.sprite_initialize();
        this.id = UID.gen();
        this.layer_name = "";
        this.layer = null;
        this.type = "";
        this.response = new Response();
        this.name = '';
        this.is_selected = false;
        this.normal_color = null;
        this.c_index = 0;
        this.inner_type = "Polygon";
        this.properties = {};

    };


    Obsticle.prototype.on_added_to_parent = function (parent) {
        Sprite.prototype.on_added_to_parent.call(this, parent);

    };

    Obsticle.prototype.on_remove_from_parent = function (parent) {
        Sprite.prototype.on_remove_from_parent.call(this, parent);
        if (parent instanceof Obsticle || parent instanceof Path || parent instanceof Graphic) {
            game.navigator.current_screen.remove_obsticle(this);
        }

    };

    Obsticle.prototype.check = function (point) {

        if (!this.layer || !this.layer.is_visible) {
            return false;
        }

        var bounds = this.bounds;

        if (bounds instanceof Circle) {

            if (SAT.pointInCircle(point, bounds)) {
                return this;
            }

        } else if (bounds instanceof Polygon) {
            if (SAT.pointInPolygon(point, bounds)) {
                return this;
            }
        }

        return false;

    };

    Obsticle.prototype.draw = function (context, x, y) {

        Sprite.prototype.draw.call(this, context);

        this.debug_bounds(context);

        var fillStyle = context.fillStyle;
        var alpha = context.globalAlpha;

        if (this.normal_color && !this.is_selected) {
            context.fillStyle = this.normal_color;
            context.globalAlpha = 0.3;
        } else {
            context.fillStyle = "blue";
        }

        if (this.is_selected || this.normal_color) {
            context.globalAlpha = 0.3;

        }

        if (this.normal_color || this.is_selected) {
            context.fill();
        }
        
        if(this.name){
            this.draw_label(context);
        }

        context.fillStyle = fillStyle;
        context.globalAlpha = alpha;

    };
    
    Obsticle.prototype.draw_label = function (context){
        
        var padding = 10;
        var height = 25;
        
        var alpha = context.globalAlpha;
        var fillStyle = context.fillStyle;
        var size = context.measureText(this.name);
        
        var p = this.bounds.pos;
        
        context.fillStyle = "white";
        context.globalAlpha = 0.3;
        
        context.fillRect(p.x,p.y - height - padding,size.width+padding*2,height);
        
        
        
        context.fillStyle = "black";
        context.globalAlpha = 1.0;
        
        
        
        context.fillText(this.name,p.x+padding,p.y - height - 7);
        
        
        context.fillStyle = fillStyle;
        context.globalAlpha = alpha;
        
    };

    Obsticle.prototype.clear = function (context) {

    };

    window.Obsticle = Obsticle;

}(window));