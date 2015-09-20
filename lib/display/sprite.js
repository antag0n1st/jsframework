//(function(window, undefined) {

function Sprite(image_name) {
    if (image_name) {
        this.initialize(image_name);
    }
}

Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;
Sprite.prototype.initialize = function (image_name) {
    
    PIXI.Sprite.call(this);
    
    this.extend([Drawable]);
    
    var bt = new PIXI.BaseTexture(Images[image_name].image);  
   
    this.texture = new PIXI.Texture(bt);

};

window.Sprite = Sprite;

//}(window));