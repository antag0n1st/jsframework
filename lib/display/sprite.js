//(function(window, undefined) {

function Sprite(image_name) {
    if (image_name) {
        this.initialize(image_name);
    }
}

Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;
Sprite.prototype.initialize = function (image_name) {

    if (Images[image_name]) {
        PIXI.Sprite.call(this, Images[image_name].texture);
    } else if (image_name) {
        var texture = PIXI.Texture.fromFrame(image_name);
        PIXI.Sprite.call(this, texture);
    } else {
        PIXI.Sprite.call(this);
    }

    this.extend([Drawable]);
    
    this.set_size(this.width,this.height);
    
};

window.Sprite = Sprite;

//}(window));