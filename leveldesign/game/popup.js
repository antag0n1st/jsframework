//(function(window,undefined){
    
    function Popup(image_name){
        this.initialize(image_name);
    }    
    
    Popup.prototype = new Sprite();
    Popup.prototype.sprite_initialize = Popup.prototype.initialize;    
    Popup.prototype.initialize = function(image_name){        
        this.sprite_initialize(image_name); // your image name
        this.label = new Label();
        this.add_child(this.label);
        this.padding = 20;
    };
    
    Popup.show = function(message,layer){
            var m = new Popup();
            m.label.set({
                text : message,
                text_font_name: "Arial",
                text_size : 30,
                text_align : "center",
                text_color : "white"
                
            });
            m.set_position( Config.screen_width/2 - 100,Config.screen_height/2 - 50 );
            layer.add_child(m);            
            var a = new TweenAlpha(m,0,new Bezier(.81,.09,.96,.63),2000,function(){
                this.object.remove_from_parent();
            });
            a.run();
    };
    
    Popup.prototype.on_added_to_parent = function(parent){
        Drawable.prototype.on_added_to_parent.call(this,parent);
        
    };
    
    Popup.prototype.on_remove_from_parent = function(parent){
        Drawable.prototype.on_remove_from_parent.call(this,parent);
        
    };
    
    Popup.prototype.on_draw = function(context,x,y){
        var fill = context.fillStyle;
        context.fillStyle = "green";
        context.fillRect(
        x - this.label.width/2 - this.padding,
        y-this.padding,
        this.label.width+this.padding*2,
        this.label.height+this.padding*2);
        context.fillStyle = fill;
    };
    
    Popup.prototype.update = function(dt){
        
    };
    
    
//    window.Popup = Popup;
    
//}(window));