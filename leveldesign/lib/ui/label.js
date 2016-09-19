//(function(window, undefined) {

    function Label() {
        this.initialize();
    }
    
    Label.prototype = new Drawable();
    Label.prototype.drawable_initialize = Drawable.prototype.initialize;   
    

    Label.prototype.initialize = function() {

        this.drawable_initialize();
        this.text = "Empty";
        this.text_color = "#000000";
        this.text_align = 'left';
        this.text_vertical_align = 'top';
        this.text_size = 14;
        this.text_font_name = "Verdana";
        
    };
    
    Label.prototype.set = function(config){
        this.text = config.text ? config.text : this.text;
        this.text_color = config.text_color ? config.text_color : this.text_color;
        this.text_align = config.text_align ? config.text_align : this.text_align;
        this.text_vertical_align = config.text_valign ? config.text_valign : this.text_vertical_align;
        this.text_size = config.text_size ? config.text_size : this.text_size;
        this.text_font_name = config.text_font_name ? config.text_font_name : this.text_font_name;
        
        var context = game.stage.context;
        
        context.font = this.text_size+"px "+this.text_font_name;
        context.textAlign = this.text_align;
        context.textBaseline = this.text_vertical_align;
        context.fillStyle = this.text_color;
        var size = context.measureText(this.text);
       
        this.set_size(size.width,this.text_size);
        
    };

    Label.prototype.draw = function(context) {

        var position = this.bounds.pos;
       
        if(this.text){
            context.font = this.text_size+"px "+this.text_font_name;
            context.textAlign = this.text_align;
            context.textBaseline = this.text_vertical_align;
            context.fillStyle = this.text_color;
          
            context.fillText(this.text, position.x , position.y );
        }

    };

    Label.prototype.clear = function(context) {

    };

//    window.Label = Label;
//
//}(window));
