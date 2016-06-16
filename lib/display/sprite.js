(function (window, undefined) {

    function Sprite(image_name) {
        this.initialize(image_name);
    }

    Sprite.prototype = Object.create(PIXI.Sprite.prototype);
    Sprite.TYPE = UID.numbering();
    Sprite.prototype.constructor = Sprite;
    Sprite.prototype.initialize = function (image_name) {

        PIXI.Sprite.call(this, PIXI.Texture.EMPTY);
        this.set_texture(image_name);
        this.extend([Drawable]);
        this.TYPE = Sprite.TYPE;
        this.set_size(this.width, this.height);

    };

    Sprite.prototype.set_texture = function (name) {
        if (Images[name]) {
            this.texture = Images[name].texture;
        } else if (name) {
            this.texture = PIXI.Texture.fromFrame(name);
        } else {
            this.texture = PIXI.Texture.EMPTY;
        }
    };

    Sprite.prototype.strech = function (width, height) {

        this.set_scale_x(1);
        this.set_scale_y(1);

        if (width) {
            var a = width / this.width;
            this.set_scale_x(a);
        }

        if (height) {
            var a = height / this.height;
            this.set_scale_y(a);
        }

    };
    
    Sprite.prototype.scale_to_fill = function(width,height){
        this.set_scale_x(1);
        this.set_scale_y(1);
        
        var HRatio = height / this.height;
        var WRatio = width / this.width;
        
        this.set_scale(Math.max(HRatio,WRatio));
    };


    window.Sprite = Sprite;

}(window));