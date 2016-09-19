//(function(window, undefined) {

function Button(config) {
    this.initialize(config);
}

Button.prototype = new Sprite();
Button.prototype.parent_initialize = Drawable.prototype.initialize;


Button.prototype.initialize = function(config) {

    this.parent_initialize();
    this.text = null;
    this.text_color = "#000000";
    this.font_size = 14;
    this.font_family = 'Verdana';
    this.image = config.image.image;
    this.normal_image = config.image.image;
    this.selected_image = config.selected_image ? config.selected_image.image : null;

    if (Config.is_low_resolution) {
        this.set_size(this.image.width * 2, this.image.height * 2);
    } else {
        this.set_size(this.image.width, this.image.height);
    }
    
    this.priority = 10; // top listener

};


Button.prototype.draw = function(context) {
    
    if(this.is_selected){
        this.image = this.selected_image ? this.selected_image : this.image;
    }else{
        this.image = this.normal_image;
    }

    Sprite.prototype.draw.call(this, context);


    if (this.text) {
        var position = this.bounds.pos.clone();
        context.font = this.font_size + "px " + this.font_family;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = this.text_color;
        context.fillText(this.text, position.x + this.image.width / 2, position.y + this.image.height / 2);
    }

};

Button.prototype.clear = function(context) {

};

//    window.Button = Button;
//
//}(window));
